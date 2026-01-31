"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BlogHeader, BlogFilters, BlogGrid } from "@/components/blog";

const Page = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const articles = useQuery(api.articles.getPublicArticles, {
        category: selectedCategory || undefined,
    });

    const isLoading = articles === undefined;

    // Filter articles based on search query
    const filteredArticles = useMemo(() => {
        if (!articles) return undefined;
        if (!searchQuery.trim()) return articles;

        const query = searchQuery.toLowerCase();
        return articles.filter(
            (article) =>
                article.title.toLowerCase().includes(query) ||
                article.content.toLowerCase().includes(query) ||
                article.excerpt?.toLowerCase().includes(query) ||
                article.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
                article.authorName.toLowerCase().includes(query)
        );
    }, [articles, searchQuery]);

    return (
        <div className="space-y-6">
            <BlogHeader totalArticles={filteredArticles?.length || 0} />

            <BlogFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <BlogGrid articles={filteredArticles} isLoading={isLoading} />
        </div>
    );
};

export default Page;