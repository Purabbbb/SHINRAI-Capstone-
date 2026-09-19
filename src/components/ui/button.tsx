import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,border-color] duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 active:not-disabled:scale-[0.96] [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-fg hover:opacity-90",
        secondary: "bg-surface-2 text-fg border border-border hover:bg-surface",
        outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
        ghost: "text-fg hover:bg-surface-2",
        accent: "bg-accent text-primary-fg hover:opacity-90",
        danger: "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
