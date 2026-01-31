"use client";

import BlogCard from "./BlogCard";
import { FileText } from "lucide-react";

interface Article {
    _id: string;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    tags?: string[];
    featuredImage?: string | null;
    isPublic: boolean;
    allowComments: boolean;
    authorName: string;
    createdAt: number;
}

interface BlogGridProps {
    articles: Article[] | undefined;
    isLoading?: boolean;
}

const BlogGrid = ({ articles, isLoading }: BlogGridProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-card rounded-lg border border-border overflow-hidden animate-pulse"
                    >
                        <div className="h-48 bg-muted" />
                        <div className="p-6 space-y-3">
                            <div className="h-4 bg-muted rounded w-1/4" />
                            <div className="h-6 bg-muted rounded w-3/4" />
                            <div className="space-y-2">
                                <div className="h-3 bg-muted rounded w-full" />
                                <div className="h-3 bg-muted rounded w-5/6" />
                            </div>
                            <div className="flex justify-between pt-4">
                                <div className="h-4 bg-muted rounded w-24" />
                                <div className="h-4 bg-muted rounded w-16" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    There are no public articles available at the moment. Check back later for new content!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {articles.map((article) => (
                <BlogCard key={article._id} article={article} />
            ))}
        </div>
    );
};

export default BlogGrid;
