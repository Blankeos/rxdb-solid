export const messagesSchema = {
  primaryKey: "id",
  type: "object",
  version: 0,
  properties: {
    id: {
      type: "string",
      maxLength: 36,
    },
    name: {
      type: "string",
    },
    message: {
      type: "string",
    },
    timestamp: {
      type: "string",
      format: "date-time",
    },
  },
};
