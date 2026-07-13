export interface ChatUser {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
}

export interface ChatMessage {
  id: string;
  message: string;
  userId: string | null;
  user: ChatUser | null;
  guestId: string | null;
  guestName: string | null;
  createdAt: string; // ISO string
}

export interface ChatNewEvent extends ChatMessage {}
export interface ChatErrorEvent {
  message: string;
}
