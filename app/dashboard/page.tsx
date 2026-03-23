import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats, RecentAnalysesList } from "@/components/dashboard/DashboardContent";
import { StatsSkeleton, RecentAnalysesSkeleton } from "@/components/skeletons/DashboardSkeletons";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20">
      <DashboardHeader title="Dashboard Overview" />

      <div className="space-y-6 max-w-7xl mx-auto pt-6">
        {/* Stats Section with Suspense */}
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats userId={userId} />
        </Suspense>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activity Section with Suspense */}
          <div className="col-span-4 space-y-4">
            <Suspense fallback={<RecentAnalysesSkeleton />}>
              <RecentAnalysesList userId={userId} />
            </Suspense>
          </div>

          {/* Quick Actions / New Analysis Sidebar */}
          <div className="col-span-3 space-y-4">
            <Card className="border-none bg-primary text-primary-foreground shadow-lg overflow-hidden relative">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                <Plus className="h-48 w-48" />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Optimize New Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm opacity-90 leading-relaxed">
                  Open any Upwork profile and use our Chrome extension to get an instant AI analysis and profile score.
                </p>
                <div className="flex flex-col gap-2">
                  <a 
                    href="https://chromewebstore.google.com" 
                    target="_blank" 
                    className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2.5 text-sm font-bold text-primary shadow transition-colors hover:bg-gray-100"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    How to use Extension
                  </a>
                  <Link 
                    href="/dashboard/history" 
                    className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
                  >
                    View All Analyses
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/60 backdrop-blur-sm shadow-sm">
                <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground opacity-70">Model Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm font-medium">AI Engine Active</span>
                        </div>
                        <span className="text-xs text-muted-foreground">OpenAI v4</span>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
