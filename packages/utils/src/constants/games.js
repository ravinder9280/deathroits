"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAME_LABELS = exports.GAME_KEYS = exports.GAMES = void 0;
exports.GAMES = {
    BGMI: { label: "BGMI", image: "/bgmi.png" },
    COD_MOBILE: { label: "Call of Duty", image: "/cod.png" },
    FREE_FIRE: { label: "Free Fire", image: "/ff.jpg" },
    VALORANT: { label: "Valorant", image: "/minecraft.svg" },
};
exports.GAME_KEYS = Object.keys(exports.GAMES);
exports.GAME_LABELS = Object.fromEntries(
    Object.entries(exports.GAMES).map(([k, v]) => [k, v.label])
);
//# sourceMappingURL=games.js.map