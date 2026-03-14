import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-svh w-full items-center justify-center bg-background relative p-4">
            {/* Dark/Light mode switch prominently at top-right */}
            <div className="absolute right-4 top-4 z-50 md:right-8 md:top-8">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 ease-out z-10">
                {children}
            </div>
        </div>
    );
}
