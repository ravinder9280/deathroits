const GUEST_ID_KEY = "deathroit_guest_id";
const GUEST_NAME_KEY = "deathroit_guest_name";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function getOrCreateGuestIdentity(): {
  guestId: string;
  guestName: string;
} {
  if (typeof window === "undefined") {
    return { guestId: "ssr", guestName: "Guest" };
  }

  let guestId = localStorage.getItem(GUEST_ID_KEY);
  let guestName = localStorage.getItem(GUEST_NAME_KEY);

  if (!guestId) {
    guestId = `guest_${crypto.randomUUID()}`;
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  if (!guestName) {
    guestName = `Guest_${randomSuffix()}`;
    localStorage.setItem(GUEST_NAME_KEY, guestName);
  }

  return { guestId, guestName };
}
