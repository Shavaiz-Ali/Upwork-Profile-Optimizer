import { ThemeToggle } from "@/components/theme-toggle";

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative w-full flex items-center justify-center bg-background overflow-hidden p-4 md:p-8">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl mix-blend-multiply opacity-70 animate-pulse" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl mix-blend-multiply opacity-70 animate-pulse" style={{ animationDelay: "2s" }} />

            {/* Absolute Theme Toggle at top right */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
                <ThemeToggle />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                {children}
            </div>
        </div>
    );
}
