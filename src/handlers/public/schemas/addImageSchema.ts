import z from "zod";

export const addImagebodySchema = z
  .object({
    imageId: z.string(),
    folderId: z.string(),
    folderName: z.string(),
    imageFileName: z.string(),
  })
  .strict();
