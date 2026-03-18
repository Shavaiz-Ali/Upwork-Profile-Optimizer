import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import connectToDatabase from "@/lib/db";
import Analysis from "@/lib/models/analysis.model";
import Link from "next/link";
import { 
    History, 
    Search, 
    Filter, 
    ChevronRight,
    Calendar,
    ArrowUpRight,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading2, Paragraph, Muted, Small } from "@/components/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getHistoryData(userId: string) {
    try {
        await connectToDatabase();
        const history = await Analysis.find({ userId })
            .sort({ createdAt: -1 })
            .lean();
        return { history: history as any[], error: null };
    } catch (error: any) {
        return { history: [], error: error.message || "Failed to fetch history" };
    }
}

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const { history, error } = await getHistoryData(session.user.id);

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto">
                <DashboardHeader />
                
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <Heading2 className="mt-0 border-none pb-0 text-3xl font-extrabold tracking-tight">Analysis History</Heading2>
                            <Muted className="mt-1 text-base">
                                View and compare all your previous profile optimizations.
                            </Muted>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Search by profile..." 
                                    className="h-10 w-64 rounded-lg border bg-card/60 backdrop-blur-md pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-10 w-10 border-border/50 bg-card/60 hover:bg-accent/50">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5" />
                            <div className="text-sm font-medium">
                                <span className="font-bold">Error:</span> {error}. Please try again later.
                            </div>
                        </div>
                    )}

                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-0 pt-6 px-6">
                            <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider pb-4 border-b border-border/50">
                                <div className="col-span-5">Profile Details</div>
                                <div className="col-span-2 text-center">Score</div>
                                <div className="col-span-3">Date</div>
                                <div className="col-span-2 text-right">Action</div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <History className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold">No history found</h3>
                                    <p className="text-muted-foreground text-sm mt-1 max-w-[280px]">
                                        Your optimization reports will appear here once you run them via the extension.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {history.map((item: any) => (
                                        <div key={item._id.toString()} className="grid grid-cols-12 gap-4 p-6 items-center transition-colors hover:bg-accent/30 group">
                                            <div className="col-span-5 flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                    {item.profileName?.charAt(0) || "P"}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-sm truncate">{item.profileName || "Untitled Profile"}</p>
                                                    <p className="text-[11px] text-muted-foreground truncate group-hover:text-foreground transition-colors">{item.profileTitle}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-2 flex justify-center">
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    item.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                    item.overallScore >= 50 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                    {item.overallScore}/100
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-3 flex items-center gap-2 text-sm text-dim">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                            
                                            <div className="col-span-2 text-right">
                                                <Button asChild variant="link" size="sm" className="font-bold text-primary px-0 group/link">
                                                    <Link href={`/dashboard/history/${item._id.toString()}`}>
                                                        View Report
                                                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
