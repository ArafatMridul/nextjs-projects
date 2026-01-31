"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
    { value: "", label: "All" },
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food" },
    { value: "health", label: "Health" },
    { value: "business", label: "Business" },
];

interface BlogFiltersProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (value: string) => void;
}

const BlogFilters = ({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
}: BlogFiltersProps) => {
    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 pr-10"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => onSearchChange("")}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <Badge
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground transition-colors"
                        onClick={() => onCategoryChange(category.value)}
                    >
                        {category.label}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default BlogFilters;
