"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-ink-700 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="section-container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-ink-50 lowercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <Image src="/valfin-mark-white.png" alt="" width={640} height={412} priority className="h-6 w-auto" />
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink-200 transition-colors hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={siteConfig.secondaryCta.href}
            className="text-sm text-ink-200 transition-colors hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            {siteConfig.secondaryCta.label}
          </Link>
          <ButtonLink href={siteConfig.primaryCta.href} size="sm" className="bg-accent-500 text-white hover:bg-accent-400">
            {siteConfig.primaryCta.label}
          </ButtonLink>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                  <Menu className="size-5" />
                </Button>
              }
            />
            <SheetContent side="right" className="bg-ink-900 border-ink-700">
              <SheetHeader>
                <SheetTitle className="text-ink-50 lowercase">{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1 px-4">
                {siteConfig.nav.map((item) => (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className="rounded-md px-3 py-3 text-base text-ink-200 transition-colors hover:bg-ink-800 hover:text-ink-50"
                      >
                        {item.label}
                      </Link>
                    }
                  />
                ))}
                <SheetClose
                  render={
                    <Link
                      href={siteConfig.primaryCta.href}
                      className={cn(buttonVariants(), "mt-4 bg-accent-500 text-white hover:bg-accent-400")}
                    >
                      {siteConfig.primaryCta.label}
                    </Link>
                  }
                />
                <SheetClose
                  render={
                    <Link
                      href={siteConfig.secondaryCta.href}
                      className="mt-1 rounded-md px-3 py-3 text-center text-sm text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-50"
                    >
                      {siteConfig.secondaryCta.label}
                    </Link>
                  }
                />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
