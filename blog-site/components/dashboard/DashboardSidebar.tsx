"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Settings,
    User,
    LogOut,
    X,
    PenSquare,
    BarChart3,
    Home,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {useTransition} from "react";

const sidebarItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Blogs", href: "/dashboard/blogs", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Create Post", href: "/dashboard/create", icon: PenSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            try {
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            toast.success("Logout successful");
                            router.push("/");
                        },
                        onError: (error) => {
                            toast.error(`Logout failed: ${error.error.message}`);
                        },
                    },
                });
            } catch (error) {
                toast.error(`Logout failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        })
    };

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-lg">B</span>
                            </div>
                            <span className="text-xl font-semibold text-sidebar-foreground">Blooogy</span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                    }`}
                                    onClick={onClose}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-3 border-t border-sidebar-border">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                            {isPending ? "Logging out..." : "Logout"}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default DashboardSidebar;
export { sidebarItems };
