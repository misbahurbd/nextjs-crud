import { z } from "zod";

export const createTodoScheme = z.object({
  title: z
    .string({
      required_error: "Title field is required",
      invalid_type_error: "Title must be string",
    })
    .min(1, "Title field is required")
    .trim(),
  description: z
    .string({ invalid_type_error: "Description must be string" })
    .trim()
    .optional(),
});

export const editTodoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['Pending', 'Complete']).optional(),
});
