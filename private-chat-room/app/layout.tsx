import React from "react";
import type {Metadata} from "next";
import {JetBrains_Mono} from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Private Chat Room",
    description: "A self-destructive and secure chat room",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${jetBrainsMono.variable} antialiased`}
        >
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
