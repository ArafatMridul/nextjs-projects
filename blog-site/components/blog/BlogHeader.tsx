"use client";

import { FileText } from "lucide-react";

interface BlogHeaderProps {
    totalArticles: number;
}

const BlogHeader = ({ totalArticles }: BlogHeaderProps) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Blog Articles</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {totalArticles > 0
                            ? `Discover ${totalArticles} ${totalArticles === 1 ? "article" : "articles"} from our community`
                            : "Discover articles from our community"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogHeader;
