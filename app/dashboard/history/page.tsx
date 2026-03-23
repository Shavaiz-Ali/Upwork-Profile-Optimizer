import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalysisService } from "@/services/analysis.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AnalysisTable } from "@/components/dashboard/AnalysisTable";
import { RecentAnalysesSkeleton } from "@/components/skeletons/DashboardSkeletons";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { page?: string; q?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;
  
  const page = parseInt(searchParams.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20 min-h-full">
      <DashboardHeader title="Analysis History" />

      <div className="space-y-4 max-w-7xl mx-auto pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by profile or title..." 
              className="pl-9 bg-card border-none shadow-sm"
              defaultValue={searchParams.q}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-card border-none shadow-sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="bg-card border-none shadow-sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <Suspense fallback={<RecentAnalysesSkeleton />}>
          <HistoryContent userId={userId} skip={skip} limit={limit} />
        </Suspense>
      </div>
    </div>
  );
}

async function HistoryContent({ userId, skip, limit }: { userId: string; skip: number; limit: number }) {
  const { data: analyses, totalCount, hasMore } = await AnalysisService.getUserAnalyses(userId, { skip, limit });

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-xl bg-card/40">
        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="h-6 w-6 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-bold">No analyses found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your search or run a new analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnalysisTable analyses={analyses} />
      
      {/* Simple Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{skip + 1}</span> to <span className="font-medium">{Math.min(skip + limit, totalCount)}</span> of <span className="font-medium">{totalCount}</span> results
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={skip === 0}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={!hasMore}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
