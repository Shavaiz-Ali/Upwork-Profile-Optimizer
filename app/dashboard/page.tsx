import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import connectToDatabase from "@/lib/db";
import Analysis from "@/lib/models/analysis.model";
import {
    LayoutDashboard,
    TrendingUp,
    Activity,
    Target,
    ArrowUpRight,
    Search,
    Zap,
    History
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heading2, Paragraph, Muted, Small } from "@/components/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getDashboardData(userId: string) {
    try {
        await connectToDatabase();
        
        // Get recent analyses
        const recentAnalyses = await Analysis.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Calculate stats
        const totalAnalyses = await Analysis.countDocuments({ userId });
        
        const allAnalyses = await Analysis.find({ userId }).select('overallScore').lean();
        const avgScore = allAnalyses.length > 0 
            ? Math.round(allAnalyses.reduce((acc, curr) => acc + curr.overallScore, 0) / allAnalyses.length)
            : 0;

        const lastAnalysis = recentAnalyses[0];
        const scoreTrend = recentAnalyses.length > 1 
            ? Math.round(recentAnalyses[0].overallScore - recentAnalyses[1].overallScore)
            : 0;

        return {
            recentAnalyses,
            totalAnalyses,
            avgScore,
            scoreTrend,
            lastScore: lastAnalysis?.overallScore || 0,
            error: null
        };
    } catch (error: any) {
        console.error("Dashboard data fetch error:", error);
        return {
            recentAnalyses: [],
            totalAnalyses: 0,
            avgScore: 0,
            scoreTrend: 0,
            lastScore: 0,
            error: error.message || "Database connection failed"
        };
    }
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const data = await getDashboardData(session.user.id);

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <DashboardHeader />

                <div className="p-8">
                    {data.error && (
                        <div className="mb-8 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-3">
                            <Activity className="h-5 w-5" />
                            <div className="text-sm font-medium">
                                <span className="font-bold">Database Connection Error:</span> {data.error}. Please ensure your MongoDB server is running.
                            </div>
                        </div>
                    )}
                    <div className="mb-10">
                        <Heading2 className="mt-0 border-none pb-0 text-3xl font-extrabold tracking-tight">Welcome back, {session.user.name?.split(' ')[0]}</Heading2>
                        <Muted className="mt-1 text-base">
                            Here's what's happening with your Upwork profiles.
                        </Muted>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Average AI Score</CardTitle>
                                <Target className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.avgScore}/100</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Overall performance across all profiles
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Analyses</CardTitle>
                                <Activity className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.totalAnalyses}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Profiles optimized so far
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Last Score</CardTitle>
                                <TrendingUp className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.lastScore}/100</div>
                                {data.scoreTrend !== 0 && (
                                    <p className={`text-xs mt-1 flex items-center gap-1 ${data.scoreTrend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        <ArrowUpRight className={`h-3 w-3 ${data.scoreTrend < 0 ? 'rotate-90' : ''}`} />
                                        {data.scoreTrend > 0 ? '+' : ''}{data.scoreTrend}% from last check
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 shadow-primary/5">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Pro Status</CardTitle>
                                <Zap className="h-4 w-4 text-primary fill-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Active</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Unlimited AI optimizations
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent History */}
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
                        <Card className="lg:col-span-4 border-border/50 bg-card/60 backdrop-blur-md">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl font-bold">Recent Profile Optimizations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {data.recentAnalyses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <Search className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground font-medium">No analyses found yet</p>
                                        <p className="text-xs text-muted-foreground mt-1 px-8">
                                            Run the Upwork Optimizer extension on any profile to see results here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {data.recentAnalyses.map((item: any) => (
                                            <div key={item._id.toString()} className="flex items-center justify-between p-4 rounded-lg border bg-background/50 transition-all hover:border-primary/30">
                                                <div className="flex items-center gap-4">
                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${item.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                            item.overallScore >= 50 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                                'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                                        }`}>
                                                        {item.overallScore}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm">{item.profileName || "Unknown Profile"}</p>
                                                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.profileTitle}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <Link 
                                                        href={`/dashboard/history/${item._id.toString()}`} 
                                                        className="text-[10px] text-primary font-bold mt-1 hover:underline block"
                                                    >
                                                        View Full Result
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3 border-border/50 bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" className="w-full justify-between h-14 px-6 rounded-xl border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group/action">
                                    <div className="flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-primary" />
                                        <div className="text-left font-bold text-primary">Change AI Model</div>
                                    </div>
                                    <ArrowUpRight className="h-5 w-5 text-primary group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform" />
                                </Button>

                                <Button asChild variant="outline" className="w-full justify-between h-14 px-6 rounded-xl border-border/50 bg-background/50 hover:bg-accent/50 transition-all group/action">
                                    <Link href="/dashboard/history" className="flex items-center justify-between w-full h-full">
                                        <div className="flex items-center gap-3">
                                            <History className="h-5 w-5 text-muted-foreground group-hover/action:text-foreground transition-colors" />
                                            <div className="text-left font-bold">View All History</div>
                                        </div>
                                        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover/action:text-foreground group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 transition-transform" />
                                    </Link>
                                </Button>

                                <div className="mt-8 pt-6 border-t">
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Support & Resources</p>
                                    <ul className="space-y-3">
                                        <li className="text-sm text-dim hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            How to optimize your profile
                                        </li>
                                        <li className="text-sm text-dim hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Latest Upwork algorithm updates
                                        </li>
                                        <li className="text-sm text-dim hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            Get expert review
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
