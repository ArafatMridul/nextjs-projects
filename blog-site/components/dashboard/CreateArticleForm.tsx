"use client";

import React, {ReactNode, useState, useTransition} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import {
    ArrowLeft,
    ImagePlus,
    Save,
    Eye,
    Send,
    Bold,
    Italic,
    List,
    ListOrdered,
    Link2,
    Quote,
    Code,
    Heading2,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
    createArticleSchema,
    type CreateArticleFormData,
} from "@/schemas/createArticleSchema";
import {api} from "@/convex/_generated/api";

const categories = [
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "travel", label: "Travel" },
    { value: "food", label: "Food" },
    { value: "health", label: "Health" },
    { value: "business", label: "Business" },
];

const toolbarButtons = [
    { icon: Bold, label: "Bold" },
    { icon: Italic, label: "Italic" },
    { icon: Heading2, label: "Heading" },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Quote, label: "Quote" },
    { icon: Code, label: "Code" },
    { icon: Link2, label: "Link" },
];

const CreateArticleForm = () => {
    const router = useRouter();
    const [tagInput, setTagInput] = useState("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<CreateArticleFormData>({
        resolver: zodResolver(createArticleSchema),
        defaultValues: {
            title: "",
            content: "",
            excerpt: "",
            category: "",
            tags: [],
            featuredImage: null,
            isPublic: true,
            allowComments: true,
        },
    });
    const createArticleMutation = useMutation(api.articles.createArticle);

    const tags = form.watch("tags") || [];

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim().toLowerCase();
            if (!tags.includes(newTag)) {
                form.setValue("tags", [...tags, newTag]);
            }
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        form.setValue(
            "tags",
            tags.filter((tag) => tag !== tagToRemove)
        );
    };

    const handleSaveDraft = () => {
        const data = form.getValues();
        console.log("Draft saved:", data);
        toast.success("Draft saved successfully!");
    };

    const onSubmit = (data: CreateArticleFormData) => {
        try {
            startTransition(async () => {
                try {
                    await createArticleMutation(data);
                    toast.success("Article published 🎉");
                    // router.push("/dashboard/posts");
                } catch (err) {
                    toast.error("Failed to publish article");
                }
            })
        } catch {
            toast.error("Failed to publish article");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Create New Article</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Write and publish your blog post
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Button type="button" variant="outline" size="sm" onClick={handleSaveDraft} className="sm:size-default">
                            <Save className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Save Draft</span>
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="sm:size-default">
                            <Eye className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Preview</span>
                        </Button>
                        <Button type="submit" size="sm" disabled={isPending} className="sm:size-default">
                            {isPending ? (
                                <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">Publish</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title Input */}
                        <Card>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Article Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your article title..."
                                                    {...field}
                                                    className="text-lg sm:text-2xl font-semibold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Featured Image */}
                        <Card>
                            <CardContent className="pt-6">
                                <FormField
                                    control={form.control}
                                    name="featuredImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Featured Image</FormLabel>
                                            <FormControl>
                                                {field.value ? (
                                                    <div className="relative rounded-lg overflow-hidden h-48">
                                                        <Image
                                                            src={field.value}
                                                            alt="Featured"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            className="absolute bottom-3 right-3"
                                                            onClick={() => field.onChange(null)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
                                                        onClick={() =>
                                                            field.onChange(
                                                                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
                                                            )
                                                        }
                                                    >
                                                        <ImagePlus className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                                                        <p className="text-sm text-muted-foreground">
                                                            Click to upload or drag and drop
                                                        </p>
                                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                                            PNG, JPG or WebP (max. 2MB)
                                                        </p>
                                                    </div>
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Content Editor */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>

                                            {/* Toolbar */}
                                            <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg">
                                                {toolbarButtons.map((button) => (
                                                    <Button
                                                        key={button.label}
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        title={button.label}
                                                    >
                                                        <button.icon className="h-4 w-4" />
                                                    </Button>
                                                ))}
                                                <Separator orientation="vertical" className="h-6 mx-1 sm:mx-2 hidden sm:block" />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 sm:w-auto sm:px-3 p-0"
                                                >
                                                    <ImagePlus className="h-4 w-4 sm:mr-2" />
                                                    <span className="hidden sm:inline">Image</span>
                                                </Button>
                                            </div>

                                            <FormControl>
                                                <Textarea
                                                    placeholder="Start writing your article content here..."
                                                    {...field}
                                                    className="min-h-100 resize-none text-base leading-relaxed"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <Card>
                            <CardContent className="pt-6 space-y-5">
                                <h3 className="font-semibold text-foreground">Publish Settings</h3>

                                <div className="space-y-3">
                                    <FormField
                                        control={form.control}
                                        name="isPublic"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm">Public</FormLabel>
                                                    <FormDescription className="text-xs">
                                                        Make this article visible to everyone
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <Separator />
                                    <FormField
                                        control={form.control}
                                        name="allowComments"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-sm">Allow Comments</FormLabel>
                                                    <FormDescription className="text-xs">
                                                        Let readers comment on this post
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.value} value={cat.value}>
                                                            {cat.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Add a tag and press Enter"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleAddTag}
                                                />
                                            </FormControl>
                                            {tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {tags.map((tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                                            onClick={() => handleRemoveTag(tag)}
                                                        >
                                                            #{tag}
                                                            <span className="ml-1">×</span>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                            <FormDescription>
                                                Click on a tag to remove it
                                            </FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Excerpt */}
                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Excerpt</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write a short summary of your article..."
                                                    {...field}
                                                    className="min-h-25 resize-none"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This will appear in search results and social shares
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default CreateArticleForm;
