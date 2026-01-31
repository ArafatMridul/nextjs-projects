"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { sidebarItems } from "./DashboardSidebar";

interface DashboardHeaderProps {
    onMenuClick: () => void;
}

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between h-full px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold text-foreground">
                        {sidebarItems.find((item) => item.href === pathname)?.name || "Dashboard"}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            U
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
