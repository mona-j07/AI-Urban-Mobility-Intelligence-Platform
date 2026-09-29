"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Search, Navigation, MapPin, Bot, LayoutDashboard,
} from "lucide-react";

const links = [
  { href: "/",          label: "Home",  icon: Home            },
  { href: "/tracking",  label: "Track", icon: Navigation       },
  { href: "/planner",   label: "Plan",  icon: MapPin           },
  { href: "/ai",        label: "AI",    icon: Bot              },
  { href: "/authority", label: "Auth",  icon: LayoutDashboard  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
            pathname === href
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
