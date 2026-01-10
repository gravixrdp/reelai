import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-0",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-green-500/10 text-green-400 hover:bg-green-500/20",
                secondary:
                    "border-transparent bg-white/5 text-zinc-400 hover:bg-white/10",
                destructive:
                    "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
                outline: "text-zinc-100 border-white/10",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
