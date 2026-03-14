"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Briefcase, LayoutDashboard, Search, FileText, Settings } from 'lucide-react';

export const Navbar = () => {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Analyze', href: '/analyze', icon: Search },
        { name: 'Proposals', href: '/proposals', icon: FileText },
        { name: 'Keywords', href: '/keywords', icon: Settings },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span className="hidden font-bold sm:inline-block">
                        Upwork Optimizer
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4 md:justify-start md:space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span className="hidden md:inline-block">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};
