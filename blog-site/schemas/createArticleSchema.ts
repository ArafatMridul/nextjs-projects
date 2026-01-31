import { z } from "zod";

export const createArticleSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title must be less than 200 characters"),
    content: z
        .string()
        .min(1, "Content is required")
        .min(50, "Content must be at least 50 characters"),
    excerpt: z
        .string()
        .max(300, "Excerpt must be less than 300 characters")
        .optional(),
    category: z.string().min(1, "Please select a category"),
    tags: z.array(z.string()).optional(),
    featuredImage: z.string().url().nullable().optional(),
    isPublic: z.boolean(),
    allowComments: z.boolean(),
});

export type CreateArticleFormData = z.infer<typeof createArticleSchema>;
