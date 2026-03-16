"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background/80 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:gap-4",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-semibold group-[.toast]:rounded-lg",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-lg",
          success: "group-[.toast]:border-primary/30 group-[.toast]:bg-primary/5",
          error: "group-[.toast]:border-destructive/30 group-[.toast]:bg-destructive/5",
        },
      }}
      icons={{
        success: <CheckCircle2 className="h-5 w-5 text-primary" />,
        error: <XCircle className="h-5 w-5 text-destructive" />,
        info: <Info className="h-5 w-5 text-accent" />,
        warning: <AlertCircle className="h-5 w-5 text-warning" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
