export const GAMES = ["BGMI", "COD_MOBILE", "FREE_FIRE", "VALORANT"] as const;

export type Game = (typeof GAMES)[number];

export const GAME_LABELS: Record<Game, string> = {
    BGMI: "BGMI",
    COD_MOBILE: "Call of Duty",
    FREE_FIRE: "Free Fire",
    VALORANT: "Valorant",
};