import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import connectToDatabase from "@/lib/db";
import Analysis from "@/lib/models/analysis.model";
import Link from "next/link";
import {
    ChevronLeft,
    Lightbulb,
    ArrowUpRight,
    Info,
    Zap,
    Check,
    X,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading2, Heading3, Paragraph, Muted, Small } from "@/components/typography";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

async function getAnalysisDetail(id: string, userId: string) {
    try {
        await connectToDatabase();
        const analysis = await Analysis.findOne({ _id: id, userId }).lean();
        return { analysis, error: null };
    } catch (error: any) {
        return { analysis: null, error: error.message || "Failed to fetch analysis detail" };
    }
}

export default async function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const { analysis, error } = await getAnalysisDetail(id, session?.user?.id || "");

    if (error || !analysis) {
        return (
            <div className="flex h-screen bg-background text-foreground items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="h-8 w-8 text-rose-500" />
                    </div>
                    <Heading2 className="mt-0 border-none pb-0">Analysis Not Found</Heading2>
                    <Muted className="mt-2">
                        {error || "We couldn't find the optimization report you're looking for. It may have been deleted or you may not have permission to view it."}
                    </Muted>
                    <div className="mt-8 flex flex-col gap-3">
                        <Button asChild size="lg" className="font-bold">
                            <Link href="/dashboard/history">Back to History</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/dashboard">Return to Overview</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const sections = [
        { key: 'Title', ...analysis.sections.title },
        { key: 'Overview', ...analysis.sections.overview },
        { key: 'Skills', ...analysis.sections.skills },
        { key: 'Portfolio', ...analysis.sections.portfolio },
        { key: 'Rates', ...analysis.sections.rates },
    ];

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <DashboardHeader />

                <div className="p-8 max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="space-y-1">
                            <Link href="/dashboard/history" className="inline-flex items-center text-xs font-bold text-primary hover:underline mb-2 transition-all">
                                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> BACK TO HISTORY
                            </Link>
                            <Heading2 className="mt-0 border-none pb-0 text-3xl">{analysis.profileName || "Optimization Report"}</Heading2>
                            <Muted className="text-sm">{analysis.profileTitle}</Muted>
                        </div>

                        <div className="flex items-center gap-4 bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm shadow-sm">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Overall AI Score</p>
                                <p className="text-3xl font-black">{analysis.overallScore}<span className="text-sm font-bold text-muted-foreground ml-1">/100</span></p>
                            </div>
                            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${analysis.overallScore >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                analysis.overallScore >= 50 ? 'bg-amber-500/10 text-amber-500' :
                                    'bg-rose-500/10 text-rose-500'
                                }`}>
                                <Zap className={`h-6 w-6 ${analysis.overallScore >= 50 ? 'fill-current' : ''}`} />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Column: Summary & Sections */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Summary Card */}
                            <Card className="border-primary/20 bg-primary/5 shadow-lg shadow-primary/5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Zap className="h-24 w-24 text-primary" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Executive AI Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Paragraph className="text-base md:text-lg leading-relaxed text-foreground/90 font-medium italic mt-0">
                                        "{analysis.summary}"
                                    </Paragraph>
                                </CardContent>
                            </Card>

                            {/* Detailed Sections */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold px-1">Section Analysis</h3>
                                {sections.map((section) => (
                                    <Card key={section.key} className="border-border/50 bg-card overflow-hidden">
                                        <div className="flex items-center justify-between p-6 border-b border-border/50">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${section.score >= 80 ? 'bg-emerald-500/10 text-emerald-500' :
                                                    section.score >= 50 ? 'bg-amber-500/10 text-amber-500' :
                                                        'bg-rose-500/10 text-rose-500'
                                                    }`}>
                                                    {section.score}
                                                </div>
                                                <span className="text-lg font-bold">{section.key}</span>
                                            </div>
                                            <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${section.score >= 80 ? 'bg-emerald-500' :
                                                        section.score >= 50 ? 'bg-amber-500' :
                                                            'bg-rose-500'
                                                        }`}
                                                    style={{ width: `${section.score}%` }}
                                                />
                                            </div>
                                        </div>
                                        <CardContent className="p-6 pt-0">
                                            <div className="grid gap-6">
                                                <div>
                                                    <Small className="text-muted-foreground uppercase tracking-widest mb-2 block">Expert Feedback</Small>
                                                    <Paragraph className="mt-0 text-[0.95rem] leading-relaxed text-foreground/80">{section.feedback}</Paragraph>
                                                </div>
                                                <div>
                                                    <Small className="text-muted-foreground uppercase tracking-widest mb-3 block">Actionable Suggestions</Small>
                                                    <ul className="space-y-3">
                                                        {section.suggestions.map((s: string, idx: number) => (
                                                            <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground group">
                                                                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary grow-0 shrink-0" />
                                                                <span className="group-hover:text-foreground transition-colors">{s}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Key Improvements & Keywords */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Top Improvements */}
                            <Card className="border-border/50 bg-card/50">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Lightbulb className="h-5 w-5 text-amber-500" />
                                        <CardTitle className="text-lg">Top 5 Improvements</CardTitle>
                                    </div>
                                    <CardDescription className="text-muted-foreground">Highest priority changes to boost conversion.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {(analysis.topImprovements || []).map((imp: string, idx: number) => (
                                            <div key={idx} className="flex gap-3 text-sm p-4 rounded-xl bg-background/50 border border-border/30 hover:border-primary/30 transition-all">
                                                <Small className="text-primary font-bold">{idx + 1}.</Small>
                                                <span className="font-medium text-foreground/90">{imp}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Keyword Health */}
                            <Card className="border-border/50 bg-card/50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Keyword Analysis</CardTitle>
                                    <CardDescription>SEO & search discoverability audit.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <Check className="h-3 w-3" />
                                            Present
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(analysis.keywords?.present || []).map((k: any) => (
                                                <span key={k} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[11px] font-bold border border-emerald-500/20">
                                                    {k}
                                                </span>
                                            ))}
                                            {(!analysis.keywords?.present || analysis.keywords.present.length === 0) && <p className="text-xs text-muted-foreground italic">No focus keywords found</p>}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/30">
                                        <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                            <X className="h-3 w-3" />
                                            Missing High-Impact
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(analysis.keywords?.missing || []).map((k: any) => (
                                                <span key={k} className="px-2 py-1 rounded bg-rose-500/10 text-rose-500 text-[11px] font-bold border border-rose-500/20">
                                                    {k}
                                                </span>
                                            ))}
                                            {(!analysis.keywords?.missing || analysis.keywords.missing.length === 0) && <p className="text-xs text-muted-foreground italic">None identified</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-primary/20 bg-linear-to-br from-primary/10 to-transparent">
                                <CardContent className="p-6">
                                    <Small className="font-bold mb-2 block text-lg">Need a faster review?</Small>
                                    <Muted className="text-xs mb-4 leading-relaxed">
                                        Get a manual diagnostic from an Upwork expert specializing in high-ticket contracts.
                                    </Muted>
                                    <Button size="lg" className="w-full font-bold shadow-lg shadow-primary/20">
                                        Request Professional Audit
                                        <ArrowUpRight className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
