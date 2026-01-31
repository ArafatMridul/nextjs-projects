import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {authComponent} from "./betterAuth/auth";

export const getPublicArticles = query({
    args: {
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const category = args.category;

        if (category === undefined) {
            return await ctx.db.query("articles")
                .filter((q) => q.eq(q.field("isPublic"), true))
                .order("desc")
                .collect();
        }

        return await ctx.db
            .query("articles")
            .withIndex("by_category", (q) => q.eq("category", category))
            .filter((q) => q.eq(q.field("isPublic"), true))
            .order("desc")
            .collect();
    },
});



export const createArticle = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        excerpt: v.optional(v.string()),
        category: v.string(),
        tags: v.optional(v.array(v.string())),
        featuredImage: v.optional(v.union(v.string(), v.null())),
        isPublic: v.boolean(),
        allowComments: v.boolean(),
    },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if(!user) {
            throw new ConvexError("Not authenticated");
        }

        const now = Date.now();
        const articleId = await ctx.db.insert("articles", {
            ...args,
            authorId: user._id,
            authorName: user.name,
            createdAt: now,
            updatedAt: now,
        });
        return articleId;
    }
})