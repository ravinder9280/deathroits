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
} as const;
