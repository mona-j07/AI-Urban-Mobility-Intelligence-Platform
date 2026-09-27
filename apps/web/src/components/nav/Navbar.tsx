"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Search, MapPin, Navigation, Route, Bot, Ticket,
} from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/routes", label: "Routes", icon: Route },
  { href: "/tracking", label: "Tracking", icon: Navigation },
  { href: "/planner", label: "Planner", icon: MapPin },
  { href: "/ai", label: "AI", icon: Bot },
  { href: "/tickets", label: "Tickets", icon: Ticket },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <Link href="/" className="mr-8 font-bold text-lg text-primary">
        UrbanGo
      </Link>
      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
