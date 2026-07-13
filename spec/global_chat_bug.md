# PRD: Server-Trusted Identity for Global Chat (Guest + Logged-in Users)

## 1. Background

Global Chat currently supports two sender types:
- **Logged-in users**, identified via an auth session (cookie-based, handled by `auth.api.getSession`).
- **Guests**, identified via a `guestId` + `guestName` pair generated client-side and stored in `localStorage`.

On every `chat:send` socket event, the client currently includes `guestId` and `guestName` directly in the payload. The server reads these values from the payload and uses them, mostly as-is, to persist and broadcast the message.

## 2. Core Problem

**The server trusts identity fields that the client fully controls.**

`guestId` and `guestName` are read from `localStorage` and sent inside the `chat:send` payload on every message. Anyone can open DevTools and do:

```js
localStorage.setItem("deathroit_guest_id", "guest_<someone-elses-uuid>");
localStorage.setItem("deathroit_guest_name", "zetroit");
```

This enables two concrete exploits:

1. **Impersonation** — copying another guest's `guestId` (visible in network responses / localStorage) lets an attacker send messages that appear to come from that guest's identity.
2. **Name spoofing** — a guest can set `guestName` to any string, including the display name of a real logged-in user, with nothing on the server preventing it.

The root cause: **identity is self-asserted per-message by the client instead of being established once, verified server-side, and reused for the lifetime of the connection.**

This applies to guests today, but the same class of bug would exist for logged-in users too if `userId` were ever read from client payload instead of from the verified session — the fix must guarantee this for both paths.

## 3. Goals

- Guests can no longer impersonate another guest or spoof arbitrary names.
- Logged-in user identity remains derived only from the verified auth session — never from client-supplied fields.
- No client-controlled identity fields (`guestId`, `guestName`, `userId`) are accepted anywhere in the `chat:send` payload.
- Existing chat UX (optimistic sending, message history, live broadcast, guest display name in UI) continues to work unchanged from the user's point of view.
- No breaking change to the shape of messages already stored in the database or already rendered by the client for `chat:new` / history — only the transport/validation layer changes.

## 4. Non-goals

- Changing the visual chat UI/UX.
- Adding guest login/signup flows.
- Changing the DB schema for `ChatMessage` (no migration required; `guestId`/`guestName`/`userId` columns stay as-is).
- Rate limiting redesign (existing per-key rate limiter logic is preserved, just re-keyed off trusted identity).

## 5. Current (Broken) Flow

```
1. Client loads → getOrCreateGuestIdentity() reads/writes guestId + guestName
   directly in localStorage (fully client-controlled, no server involvement).

2. Client connects socket.io (withCredentials: true).

3. Client emits "chat:send" with payload:
   { message, guestId, guestName }

4. Server validates payload shape only (zod schema), then:
   - Tries to resolve a logged-in session from the request headers.
   - If no session, falls back to guestId/guestName EXACTLY AS SENT BY THE CLIENT.
   - Rate-limits by userId ?? guestId (guestId is attacker-controlled).
   - Persists message with the (possibly spoofed) guestId/guestName.
   - Broadcasts to all clients via "chat:new".

5. Any client can rewrite localStorage values before step 3 and impersonate
   any existing guest or claim any name.
```

## 6. Proposed Flow (Fix)

**Principle:** Identity is resolved exactly once per socket connection, from data the client cannot forge (an httpOnly, server-signed cookie, or a verified auth session) — never from the message payload.

```
STEP A — Guest identity issuance (once per browser, before socket connects)
  Client → GET /api/guest/identity (withCredentials: true)
  Server:
    - Reads existing signed "guest_token" cookie, if present and valid → reuse it.
    - If missing/invalid → generate new { guestId, guestName }, sign as JWT,
      set as httpOnly, sameSite, secure cookie ("guest_token").
    - Responds with { guestId, guestName } — for DISPLAY ONLY on the client
      (e.g. "Chatting as Guest_XXXX"). This response is never used as an
      authentication credential.

STEP B — Socket handshake identity resolution (once per connection)
  Client → io(API_ORIGIN, { withCredentials: true })
  Server → io.use(resolveSocketIdentity) middleware runs before "connection":
    1. Attempt to resolve a logged-in session from handshake headers
       (existing auth.api.getSession logic). If present, this WINS:
       socket.data.userId / socket.data.user are set, guest fields are null.
    2. Else, parse the "guest_token" cookie from the raw handshake cookie
       header, verify its signature, and set
       socket.data.guestId / socket.data.guestName from the verified payload.
    3. If neither a valid session nor a valid guest cookie exists, reject
       the connection with a distinct error (client should have called
       Step A first; this should not normally happen).

STEP C — Sending a message
  Client emits "chat:send" with payload: { message }   ← identity fields
  removed entirely; nothing left for the client to spoof.

  Server "chat:send" handler:
    - Validates payload shape (message only) via zod.
    - Reads identity EXCLUSIVELY from socket.data (already verified in
      Step B) — never from the payload.
    - Rate-limits keyed by socket.data.userId ?? socket.data.guestId
      (both are now server-verified, not attacker-controlled).
    - Persists message using the trusted identity.
    - Broadcasts "chat:new" to all clients — SAME response shape as today,
      no changes needed on message consumers.

STEP D — Message history
  Client → GET /api/chat/messages?limit=50 (unchanged endpoint/contract)
  Server returns messages in the SAME shape as "chat:new" broadcasts,
  built from trusted DB rows — no client-facing shape changes.
```

### Why this doesn't break the existing flow
- `chat:new` broadcast shape is unchanged — client-side rendering logic needs no changes.
- `GET /chat/messages` response shape is unchanged.
- The client still shows a guest name/id in the UI (from Step A's response) — this is purely cosmetic now, not a trust boundary.
- Logged-in flow behavior is unchanged (session already resolved server-side); this PRD only tightens the identity source, not the existing session-check logic.
- Existing optimistic-send / retry / ack UX on the client is unaffected — only the emitted payload shrinks from `{ message, guestId, guestName }` to `{ message }`.

## 7. API / Payload Contracts

### 7.1 `GET /api/guest/identity` (new endpoint)

Request: no body. Must be called with `withCredentials: true` so the response cookie is stored.

Response `200`:
```json
{
  "guestId": "guest_0cdcdb57-3d63-4e1f-b670-cf9d05ee2189",
  "guestName": "Guest_Beast"
}
```
Side effect: sets/refreshes an httpOnly `guest_token` cookie (JWT-signed, `{ guestId, guestName }` payload, ~180 day expiry).

This response is for client-side display only. It is never sent back to the server as an identity credential.

### 7.2 Socket event `chat:send` (payload — breaking change to the payload only)

**Before:**
```json
{ "message": "hello", "guestId": "guest_xxx", "guestName": "Guest_Beast" }
```

**After:**
```json
{ "message": "hello" }
```

Ack response (unchanged):
```json
{ "ok": true, "id": "cmrisqnmp0001dwzl6cixszxn" }
```
or
```json
{ "ok": false }
```

### 7.3 Socket event `chat:new` (broadcast — unchanged shape)

```json
{
  "id": "cmrisqnmp0001dwzl6cixszxn",
  "message": "What if we were all rich",
  "userId": "jhUamYe2EyxqiVBKOT7xxCu0iP0ocAKW",
  "user": {
    "id": "jhUamYe2EyxqiVBKOT7xxCu0iP0ocAKW",
    "name": "Ravinder",
    "username": "zetroit",
    "image": "https://i.pinimg.com/1200x/82/ed/3a/..."
  },
  "guestId": null,
  "guestName": null,
  "createdAt": "2026-07-13T05:42:27.640Z"
}
```

For a guest sender, `userId`/`user` are `null` and `guestId`/`guestName` are populated — same as today.

### 7.4 `GET /api/chat/messages?limit=50` (unchanged shape)

```json
{
  "messages": [
    {
      "id": "cmrisqnmp0001dwzl6cixszxn",
      "message": "What if we were all rich",
      "userId": "jhUamYe2EyxqiVBKOT7xxCu0iP0ocAKW",
      "user": { "id": "...", "name": "Ravinder", "username": "zetroit", "image": "https://..." },
      "guestId": null,
      "guestName": null,
      "createdAt": "2026-07-13T05:42:27.640Z"
    },
    {
      "id": "cmrisplbs0000dwzluugbhzca",
      "message": "This is the best Global chat service",
      "userId": null,
      "user": null,
      "guestId": "guest_0cdcdb57-3d63-4e1f-b670-cf9d05ee2189",
      "guestName": "Guest_Beast",
      "createdAt": "2026-07-13T05:42:20.173Z"
    }
  ]
}
```

## 8. Server-side Identity Middleware Contract

`io.use(resolveSocketIdentity)` must run before any `chat:*` handler is registered, and must populate exactly one of the following on `socket.data`, per connection:

- Logged-in: `{ userId: string, user: { id, name, username, image }, guestId: null, guestName: null }`
- Guest: `{ userId: null, user: null, guestId: string, guestName: string }`
- Neither resolvable: reject the connection (`next(new Error("NO_IDENTITY"))`).

All downstream handlers (`chat:send`, future `guest:rename`, etc.) must read identity **only** from `socket.data` — never from the event payload.

## 9. Validation Rules

- `chat:send` payload schema (zod): `{ message: string, trim, min 1, max 500 }` only. `guestId`/`guestName` fields must be rejected or ignored if present (do not silently accept and discard silently without logging — log unexpected extra fields as a potential abuse signal, optional).
- Guest cookie JWT must be verified with signature + expiry check on every socket connection; invalid/expired tokens are treated as "no identity" (client should re-hit `/guest/identity`).
- Rate limiting key must always be a server-verified identifier (`userId` or verified `guestId`), never a client-supplied string.

## 10. Edge Cases to Handle

1. **Guest logs in mid-session**: existing socket connection was resolved as guest at handshake time and won't auto-upgrade. Client must disconnect and reconnect the socket after successful login so `resolveSocketIdentity` re-resolves as the authenticated user.
2. **CORS/cookie delivery**: Express CORS and Socket.IO CORS must both set `credentials: true` with an explicit origin (not `*`), or the `guest_token` cookie will not be sent on either the REST call or the socket handshake.
3. **Cross-site deployment**: if API and frontend are on different top-level domains, cookie must use `SameSite: "none"; Secure: true` (requires HTTPS, including in dev).
4. **First-load race condition**: client must await the `/guest/identity` response (or at least ensure the cookie is set) before opening the socket connection, otherwise the handshake may hit the "no identity" rejection path for a first-time visitor.
5. **Guest identity endpoint idempotency**: repeated calls to `/guest/identity` with a valid existing cookie must return the same `guestId`/`guestName`, not mint a new one each time.
6. **Rename feature (future)**: any future guest rename capability must be its own explicit, validated, rate-limited event that re-signs the cookie server-side — must never be re-introduced as a field inside `chat:send`.

## 11. Acceptance Criteria

- [ ] Modifying `localStorage` guest values (or any client-side state) has no effect on the identity attached to sent messages.
- [ ] A guest cannot cause a message to be persisted/broadcast under another guest's `guestId`.
- [ ] A guest cannot cause `guestName` to display as a name belonging to a real registered account.
- [ ] `chat:send` payload contains only `{ message }`; server rejects/ignores any additional identity fields.
- [ ] Logged-in user messages continue to resolve `userId`/`user` purely from the verified session, unaffected by this change.
- [ ] `chat:new` broadcast and `GET /chat/messages` response shapes are unchanged from before this fix, so existing client rendering code requires no changes.
- [ ] Rate limiting continues to function, keyed by trusted identity.
- [ ] Existing optimistic send / retry / ack UX in the client works without modification beyond removing `guestId`/`guestName` from the emitted payload.

## 12. Rollout Notes

This change is purely additive at the transport layer (new endpoint + new socket middleware) plus a payload contraction (`chat:send` loses fields it never needed to expose). It does not require a DB migration and does not change any persisted or broadcast data shape, so it can be shipped without a client/server version compatibility window beyond deploying both sides together.