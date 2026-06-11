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
    type: ["PLAYER", "ORGANIZER", "ADMIN"] as string[],
    required: false,
    defaultValue: "PLAYER",
    input: false,
  },
} as const;
