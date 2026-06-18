

export const GAMES = {
    BGMI: {
        label: "BGMI",
        image: "/bgmi.png",
    },
    COD_MOBILE: {
        label: "Call of Duty",
        image: "/cod.png",
    },
    FREE_FIRE: {
        label: "Free Fire",
        image: "/ff.jpg",
    },
    VALORANT: {
        label: "Valorant",
        image: "/minecraft.svg",
    },
};

export type GameKey = keyof typeof GAMES;

/** Tuple of all game keys — use with z.enum(GAME_KEYS) */
export const GAME_KEYS = Object.keys(GAMES) as [GameKey, ...GameKey[]];

/** Map of game key → display label */
export const GAME_LABELS = Object.fromEntries(
    Object.entries(GAMES).map(([key, val]) => [key, val.label])
) as Record<GameKey, string>;