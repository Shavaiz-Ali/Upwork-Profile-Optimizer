import * as React from "react"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface FormSelectOption {
    value: string
    label: string
}

export interface FormSelectProps {
    id?: string
    label: string
    options: FormSelectOption[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    hint?: string
    error?: string
    className?: string
    triggerClassName?: string
}

export function FormSelect({
    id,
    label,
    options,
    value,
    onValueChange,
    placeholder = "Select an option",
    hint,
    error,
    triggerClassName,
}: FormSelectProps) {
    const selectId = id || React.useId()

    return (
        <div className="space-y-2 w-full">
            <Label
                htmlFor={selectId}
                className={cn(error && "text-destructive")}
            >
                {label}
            </Label>
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger
                    id={selectId}
                    className={cn(
                        "w-full bg-background border-muted-foreground/20",
                        error && "border-destructive focus-visible:ring-destructive",
                        triggerClassName
                    )}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {hint && !error && (
                <p className="text-sm text-muted-foreground">{hint}</p>
            )}
            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}
        </div>
    )
}
