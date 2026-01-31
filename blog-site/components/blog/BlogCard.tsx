"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MessageCircle, User } from "lucide-react";

interface BlogCardProps {
    article: {
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
    };
}

const BlogCard = ({ article }: BlogCardProps) => {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const truncateContent = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + "...";
    };

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            {/* Featured Image */}
            {article.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                            {article.category}
                        </Badge>
                    </div>
                </div>
            )}

            <CardHeader className={`pb-3 ${!article.featuredImage ? "pt-6" : ""}`}>
                {!article.featuredImage && (
                    <Badge variant="secondary" className="w-fit mb-2">
                        {article.category}
                    </Badge>
                )}
                <h3 className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                </h3>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.excerpt || truncateContent(article.content)}
                </p>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {article.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                        {article.tags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                                +{article.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-0 border-t border-border mt-auto">
                <div className="flex items-center justify-between w-full pt-4">
                    {/* Author */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {article.authorName ? getInitials(article.authorName) : <User className="h-3 w-3" />}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs sm:text-sm text-muted-foreground truncate max-w-24 sm:max-w-32">
                            {article.authorName || "Unknown"}
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="hidden sm:inline">
                                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                            </span>
                            <span className="sm:hidden">
                                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: false })}
                            </span>
                        </div>
                        {article.allowComments && (
                            <MessageCircle className="h-3 w-3" />
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

export default BlogCard;
