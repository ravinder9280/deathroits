# Product Requirements Document (PRD)

# Global Chat

## Overview

Implement a real-time **Global Chat** for the Deathroit platform where
both authenticated users and guest users can participate in a single
public chat room.

The chat should feel instant while ensuring that the server remains the
source of truth.

------------------------------------------------------------------------

# Goals

-   Real-time messaging
-   Support authenticated and guest users
-   Persist chat history
-   Load recent messages on page open
-   Prevent spam
-   Provide a scalable architecture for future chat features

------------------------------------------------------------------------

# Tech Stack

  Layer           Technology
  --------------- ------------------------------
  Frontend        Next.js + React
  Backend         Express
  Real-time       Socket.IO
  ORM             Prisma
  Database        PostgreSQL
  Validation      Zod
  State           TanStack Query + React State
  Auth            Better Auth
  Rate Limiting   rate-limiter-flexible

------------------------------------------------------------------------

# Functional Requirements

## Guest Users

-   Can join without logging in.
-   Assigned a persistent local guest identity.
-   Guest ID stored in localStorage.
-   Display name such as `Guest_A7K2`.

## Authenticated Users

-   Use Better Auth identity.
-   Show username and avatar.
-   Future support for roles (Admin, Moderator, Organizer).

------------------------------------------------------------------------

# Message Flow

``` text
User
  │
  ▼
socket.emit("chat:send")
  │
  ▼
Server validates payload
  │
  ▼
Rate limit
  │
  ▼
Save message to PostgreSQL
  │
  ▼
io.emit("chat:new", savedMessage)
  │
  ├── Sender
  └── All connected users
```

The database is the source of truth.

------------------------------------------------------------------------

# Initial Chat Load

When a user opens chat:

1.  Fetch latest 50 messages via HTTP.
2.  Render history.
3.  Connect Socket.IO.
4.  Receive future messages in real time.

History comes from PostgreSQL.

Live updates come from Socket.IO.

------------------------------------------------------------------------

# Optimistic UI

The sender immediately sees a temporary message.

Example lifecycle:

    sending...
          ↓
    Saved
          ↓
    Replace temporary message

If persistence fails:

    Failed to send
    Retry

Only successfully persisted messages are broadcast.

------------------------------------------------------------------------

# Socket Events

## Client → Server

-   chat:send
-   chat:typing:start (future)
-   chat:typing:stop (future)

## Server → Client

-   chat:new
-   chat:error
-   chat:onlineCount (future)
-   chat:typing (future)

------------------------------------------------------------------------

# Database Model

``` prisma
model ChatMessage {
  id         String   @id @default(cuid())
  content    String

  userId     String?
  guestId    String?
  guestName  String?

  createdAt  DateTime @default(now())

  isDeleted  Boolean  @default(false)
}
```

------------------------------------------------------------------------

# Validation Rules

-   Message cannot be empty.
-   Trim whitespace.
-   Maximum length: 500 characters.
-   Reject invalid payloads using Zod.

------------------------------------------------------------------------

# Security

-   Server validates every message.
-   Never trust client data.
-   Authenticated users identified from Better Auth session.
-   Guests identified by generated guest ID.
-   Apply socket rate limiting.
-   Add profanity filtering in a future iteration.

------------------------------------------------------------------------

# API

## Load History

    GET /chat/messages?cursor=<cursor>&limit=50

Returns messages ordered by newest first.

------------------------------------------------------------------------

# Socket Handler (High Level)

1.  Receive event.
2.  Validate.
3.  Resolve user/guest.
4.  Rate-limit.
5.  Save with Prisma.
6.  Broadcast saved message.
7.  Acknowledge sender.

------------------------------------------------------------------------

# Folder Structure

``` text
apps/
├── web/
│   ├── components/chat/
│   ├── hooks/useGlobalChat.ts
│   └── services/chat.ts
│
└── server/
    ├── socket/
    │   ├── handlers/chat.handler.ts
    │   ├── middleware.ts
    │   └── index.ts
    ├── services/chat.service.ts
    ├── validators/chat.validator.ts
    └── repositories/chat.repository.ts
```

------------------------------------------------------------------------

# Future Enhancements

## Phase 2

-   Typing indicator
-   Emoji picker
-   Edit message
-   Delete own message
-   Reply to message

## Phase 3

-   Moderation tools
-   Report message
-   User mentions
-   Search messages
-   Pinned messages

## Phase 4

-   Tournament chat
-   Team chat
-   Private messaging
-   Media attachments
-   AI moderation

------------------------------------------------------------------------

# Acceptance Criteria

-   Guest users can chat without signing in.
-   Authenticated users can chat using their account.
-   Messages appear instantly for the sender via optimistic UI.
-   Persisted messages are broadcast to all connected clients.
-   Refreshing the page restores recent history.
-   Failed sends are clearly indicated with a retry option.
-   Chat remains functional after reconnecting.