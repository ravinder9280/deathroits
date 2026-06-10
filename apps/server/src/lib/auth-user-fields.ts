export const userAdditionalFields = {
  gameId: {
    type: "string",
    required: false,
    unique: true,
    fieldName: "gameId",
  },
  onboarded: {
    type: "boolean",
    required: false,
    defaultValue: false,
    fieldName: "onboarded",
  },
  role: {
    type: ["player", "organizer", "admin"], 
    required: false,
    defaultValue: "player",
    input: false,
  },
} as const;
