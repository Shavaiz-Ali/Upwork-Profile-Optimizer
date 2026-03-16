"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboboxOption {
    value: string
    label: string
}

export interface FormComboboxProps {
    id?: string
    label: string
    options: ComboboxOption[]
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyMessage?: string
    hint?: string
    error?: string
}

export function FormCombobox({
    id,
    label,
    options,
    value,
    onValueChange,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    hint,
    error,
}: FormComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const labelId = id || React.useId()

    const selectedOption = options.find((opt) => opt.value === value)

    return (
        <div className="space-y-2 w-full">
            <Label
                htmlFor={labelId}
                className={cn(error && "text-destructive")}
            >
                {label}
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={labelId}
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between bg-background border-muted-foreground/20 font-normal",
                            !value && "text-muted-foreground",
                            error && "border-destructive focus-visible:ring-destructive"
                        )}
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup className="space-y-2">
                                {options.map((option, index) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        data-checked={value === option.value}
                                        onSelect={() => {
                                            onValueChange(option.value)
                                            setOpen(false)
                                        }}
                                        className={cn("cursor-pointer bg-transparent! hover:bg-gray-200/10!", index !== options.length - 1 && "mb-1", value === option.value && "bg-gray-200/10!")}
                                    >
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {hint && !error && (
                <p className="text-sm text-muted-foreground">{hint}</p>
            )}
            {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
            )}
        </div>
    )
}
