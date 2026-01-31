import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    articles: defineTable({
        title: v.string(),
        content: v.string(),
        excerpt: v.optional(v.string()),
        category: v.string(),
        tags: v.optional(v.array(v.string())),
        featuredImage: v.optional(v.union(v.string(), v.null())),
        isPublic: v.boolean(),
        allowComments: v.boolean(),
        authorName: v.string(),

        // recommended metadata
        authorId: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_category", ["category"])
        .index("by_author", ["authorId"]),
});
