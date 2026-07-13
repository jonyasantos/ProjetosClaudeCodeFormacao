import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type LinkButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & { className?: string };

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      nativeButton={false}
      render={<Link href={href} {...props} />}
    >
      {children}
    </Button>
  );
}
