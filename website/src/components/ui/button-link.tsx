import Link from "next/link";
import type { ComponentProps } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
  };

/**
 * Renders a Next.js <Link> styled as a Button. Wraps Base UI's `render`
 * composition pattern (the replacement for the old `asChild` API) in one
 * place so the rest of the app can use a familiar, simple component.
 */
export function ButtonLink({ variant, size, className, href, children, ...props }: ButtonLinkProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={
        <Link href={href} {...props}>
          {children}
        </Link>
      }
    />
  );
}
