import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalysisService } from "@/services/analysis.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileScore } from "@/components/profile-score";
import { ProfileSuggestions } from "@/components/profile-suggestions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  const { id } = await params;


  if (!id) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20 min-h-full">
      <DashboardHeader title="Analysis Details" />

      <div className="max-w-7xl mx-auto pt-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/dashboard/history">
              <ArrowLeft className="h-4 w-4" />
              Back to History
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-none shadow-sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="bg-card border-none shadow-sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="text-destructive bg-card border-none shadow-sm hover:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <Suspense fallback={<AnalysisDetailSkeleton />}>
          <AnalysisDetailContent analysisId={id} userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

async function AnalysisDetailContent({ analysisId, userId }: { analysisId: string; userId: string }) {
  try {
    const analysis = await AnalysisService.getAnalysisById(analysisId, userId);

    if (!analysis) {
      notFound();
    }

    return (
      <div className="space-y-10 pb-16 animate-in fade-in duration-700 slide-in-from-bottom-4">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground p-1 shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-primary/40 via-transparent to-primary/20 opacity-50" />
          <div className="relative flex flex-col md:flex-row items-center gap-10 bg-card/60 backdrop-blur-2xl rounded-[2.3rem] p-8 md:p-12 border border-white/10">
            {/* Score Component */}
            <div className="shrink-0 flex justify-center w-full md:w-auto">
              <ProfileScore score={analysis.overallScore} />
            </div>

            {/* Analysis Info */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary font-bold px-3 py-1 scale-110">
                    Detailed Report
                  </Badge>
                  <span className="text-muted-foreground text-sm font-medium">#{analysisId.slice(-6).toUpperCase()}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground drop-shadow-sm leading-tight">
                  {analysis.profileTitle} 
                </h1>
                <p className="text-xl text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Analyzed on {new Date(analysis.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 backdrop-blur-sm relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Share2 className="h-5 w-5" />
                 </div>
                 <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">AI Executive Summary</h3>
                 <p className="text-lg leading-relaxed text-foreground/80 font-medium italic">
                   "{analysis.summary}"
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <span className="bg-primary text-primary-foreground h-8 w-8 rounded-lg flex items-center justify-center text-sm">01</span>
                  Strategic Breakdown
                </h2>
              </div>
              <ProfileSuggestions
                suggestions={analysis.topImprovements}
                strengths={analysis.keywords?.present || []}
                weaknesses={analysis.keywords?.missing || []}
              />
            </div>

            {/* In-depth Recommendations (Optional placeholders or extra info) */}
            <div className="p-8 rounded-4xl bg-card/40 backdrop-blur-md border border-white/10 shadow-sm space-y-4">
               <h3 className="text-xl font-bold">Next Steps for Success</h3>
               <p className="text-muted-foreground leading-relaxed">
                 Based on our AI analysis, focusing on the <strong>{analysis.keywords?.missing?.[0] || 'missing skills'}</strong> section will provide the quickest boost to your profile's visibility. Implementing the suggested changes to your overview could increase your match rate for high-value jobs by up to 40%.
               </p>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-8">
            <div className="sticky top-6 space-y-8">
              {/* Keywords Card */}
              <Card className="rounded-4xl border-none bg-card/60 backdrop-blur-md shadow-xl overflow-hidden group">
                <CardHeader className="bg-primary/5 border-b border-primary/10 py-5">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary/80 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    Keywords Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">Optimized Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords?.present?.map(k => (
                        <Badge key={k} variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-3 py-1 font-bold text-[11px] rounded-lg">
                          {k}
                        </Badge>
                      ))}
                      {(!analysis.keywords?.present || analysis.keywords.present.length === 0) && (
                        <p className="text-sm text-muted-foreground italic">No keywords detected.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest opacity-60">High Priority Gaps</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords?.missing?.map(k => (
                        <Badge key={k} variant="secondary" className="bg-destructive/10 text-destructive border-none px-3 py-1 font-bold text-[11px] rounded-lg">
                          {k}
                        </Badge>
                      ))}
                      {(!analysis.keywords?.missing || analysis.keywords.missing.length === 0) && (
                        <p className="text-sm text-muted-foreground italic">Perfect keyword match!</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Card */}
              <Card className="rounded-4xl border-none bg-primary text-primary-foreground shadow-2xl shadow-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg font-bold">Ready to apply?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10">
                  <p className="text-sm opacity-80 leading-relaxed font-medium">
                    Use these insights to craft a winning proposal or update your profile descriptions now.
                  </p>
                  <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-2xl py-6">
                    Update Profile Descriptions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading analysis details:", error);
    return (
       <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-[2.5rem] bg-destructive/5 text-destructive space-y-6">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Trash2 className="h-8 w-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black">Something went wrong</h3>
          <p className="font-medium opacity-80">We couldn't load this analysis. It might have been deleted.</p>
        </div>
        <Button asChild variant="outline" className="rounded-2xl px-8 h-12 font-bold">
          <Link href="/dashboard/history">Return to History</Link>
        </Button>
      </div>
    );
  }
}

function AnalysisDetailSkeleton() {
  return (
    <div className="space-y-10 pb-16">
      {/* Hero Skeleton */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-muted/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 border border-muted/20">
        <Skeleton className="h-[240px] w-[240px] rounded-3xl shrink-0" />
        <div className="flex-1 space-y-6 w-full text-center md:text-left">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32 rounded-lg mx-auto md:mx-0" />
            <Skeleton className="h-16 w-3/4 rounded-2xl mx-auto md:mx-0" />
            <Skeleton className="h-6 w-48 rounded-lg mx-auto md:mx-0" />
          </div>
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-4xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[400px] w-full rounded-4xl" />
          <Skeleton className="h-[200px] w-full rounded-4xl" />
        </div>
      </div>
    </div>
  );
}
