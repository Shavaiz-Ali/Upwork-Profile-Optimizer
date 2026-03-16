import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    hint?: string
    error?: string
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ className, label, id, hint, error, ...props }, ref) => {
        const textareaId = id || React.useId()

        return (
            <div className="space-y-2 w-full">
                <Label
                    htmlFor={textareaId}
                    className={cn(error && "text-destructive")}
                >
                    {label}
                </Label>
                <Textarea
                    id={textareaId}
                    ref={ref}
                    className={cn(
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-sm text-muted-foreground">{hint}</p>
                )}
                {error && (
                    <p className="text-sm font-medium text-destructive">{error}</p>
                )}
            </div>
        )
    }
)
FormTextarea.displayName = "FormTextarea"
