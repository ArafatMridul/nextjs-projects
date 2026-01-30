"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { PenLine, Users, Sparkles, ArrowRight, Zap, Globe, Heart } from "lucide-react";
import { motion } from "motion/react";

const Page = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="secondary" className="mb-8 px-4 py-2 text-sm font-medium">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Where ideas come to life
                        </Badge>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
                    >
                        Share your stories with the{" "}
                        <span className="text-primary">world</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Blooogy is a minimal blogging platform for writers, thinkers, and creators.
                        Write beautifully, publish effortlessly, and connect with readers everywhere.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button size="lg" className="w-full sm:w-auto px-8 group" asChild>
                            <Link href="/signup">
                                Start writing free
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="w-full sm:w-auto px-8" asChild>
                            <Link href="#features">
                                Learn more
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-muted/30"
            >
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "50K+", label: "Writers" },
                            { value: "1M+", label: "Articles" },
                            { value: "10M+", label: "Readers" },
                            { value: "150+", label: "Countries" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            >
                                <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                id="features"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="py-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Everything you need to blog
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Focus on what matters most — your writing. We handle the rest.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: PenLine,
                                title: "Beautiful Editor",
                                description: "A distraction-free writing experience with markdown support and real-time preview."
                            },
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "Optimized for speed. Your blog loads instantly, keeping readers engaged."
                            },
                            {
                                icon: Globe,
                                title: "SEO Optimized",
                                description: "Built-in SEO tools to help your content rank higher and reach more readers."
                            },
                            {
                                icon: Users,
                                title: "Build Community",
                                description: "Connect with readers through comments, newsletters, and social sharing."
                            },
                            {
                                icon: Sparkles,
                                title: "Custom Themes",
                                description: "Personalize your blog with beautiful themes that match your style."
                            },
                            {
                                icon: Heart,
                                title: "Analytics",
                                description: "Understand your audience with detailed insights and engagement metrics."
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <motion.div
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card className="border-border bg-card hover:bg-muted/50 hover:shadow-lg transition-all duration-300 h-full">
                                        <CardContent className="p-6">
                                            <motion.div
                                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                                transition={{ duration: 0.5 }}
                                                className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                                            >
                                                <feature.icon className="h-6 w-6 text-primary" />
                                            </motion.div>
                                            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Testimonial Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 overflow-hidden"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.blockquote
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-2xl sm:text-3xl font-medium text-foreground leading-relaxed mb-8"
                    >
                        &ldquo;Blooogy transformed how I share my ideas. The simplicity is refreshing —
                        I just write, and everything else falls into place.&rdquo;
                    </motion.blockquote>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center justify-center gap-4"
                    >
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary/20 text-primary font-semibold">SK</AvatarFallback>
                            </Avatar>
                        </motion.div>
                        <div className="text-left">
                            <div className="font-medium text-foreground">Sarah Kim</div>
                            <div className="text-sm text-muted-foreground">Tech Writer & Creator</div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="py-24 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Card className="border-border bg-linear-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
                                <CardContent className="p-8 sm:p-12 text-center">
                                    <motion.h2
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 }}
                                        className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
                                    >
                                        Ready to start your journey?
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="text-muted-foreground max-w-xl mx-auto mb-8"
                                    >
                                        Join thousands of writers who trust Blooogy to share their voice.
                                        No credit card required.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.4 }}
                                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                    >
                                        <Button size="lg" className="w-full sm:w-auto px-8 group" asChild>
                                            <Link href="/signup">
                                                Create your blog
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="flex items-center gap-2"
                        >
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">B</span>
                            </div>
                            <span className="text-xl font-semibold tracking-tight text-foreground">Blooogy</span>
                        </motion.div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            {["About", "Blog", "Privacy", "Terms"].map((item, index) => (
                                <motion.a
                                    key={item}
                                    href="#"
                                    className="hover:text-foreground transition-colors"
                                    whileHover={{ y: -2 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {item}
                                </motion.a>
                            ))}
                        </div>

                        <div className="text-sm text-muted-foreground">
                            © 2026 Blooogy. All rights reserved.
                        </div>
                    </div>
                </div>
            </motion.footer>
        </div>

    );
};

export default Page;