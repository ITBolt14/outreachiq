"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Building2, BookMarked, Search } from "lucide-react";
import { Button } from '../ui/button';

const navLinks = [
    {
        label: "Find Leads",
        href: "/",
        icon: Search,
    },
    {
        label: "Results",
        href: "/results",
        icon: Building2,
    },
    {
        label: "Saved Leads",
        href: "/leads",
        icon: BookMarked,
    },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                        <Search className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        Outreach <span className="text-blue-600">IQ</span>
                      </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}>
                                    <Button
                                      variant={isActive ? "default" : "ghost"}
                                      className={cn(
                                        "flex items-center gap-2",
                                        isActive
                                          ? "bg-blue-600 text-white hover:bg-blue-700"
                                          : "text-gray-600 hover:text-gray-900"
                                      )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {link.label}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>

                </div>
            </div>
        </nav>
    );
}