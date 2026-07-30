/** A single player entry on the leaderboard */
export type LeaderboardPlayer = {
  rank: number;
  userId: string;
  name: string;
  username: string | null;
  image: string | null;
  wins: number;
  totalKills: number;
  earnings: number;
};

/** API response shape for GET /v1/tournament/leaderboard */
export type LeaderboardResponse = {
  players: LeaderboardPlayer[];
};
