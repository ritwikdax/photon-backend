import z from "zod";

export const addImageNoteSchema = z
  .object({
    note: z
      .string()
      .min(1, "Note cannot be empty")
      .max(500, "Note cannot exceed 500 characters"),
  })
  .strict();
