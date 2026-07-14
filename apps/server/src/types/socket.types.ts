export interface SocketUser {
  id: string;
  name: string;
  username: string | null;
  image: string | null;
}

export interface SocketData {
  userId: string | null;
  user: SocketUser | null;
  guestId: string | null;
  guestName: string | null;
}
