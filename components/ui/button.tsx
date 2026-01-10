import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white text-black hover:bg-zinc-100 hover:scale-105 duration-300 shadow-lg hover:shadow-xl",
                destructive:
                    "bg-red-900/20 text-red-200 hover:bg-red-900/40 border border-red-900/50 hover:scale-105 duration-300",
                outline:
                    "border border-white/10 bg-transparent hover:bg-white/5 text-zinc-100 hover:border-white/30 hover:scale-105 duration-300",
                secondary:
                    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:scale-105 duration-300",
                ghost: "hover:bg-white/5 text-zinc-300 hover:text-white hover:scale-105 duration-300",
                link: "text-zinc-100 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
