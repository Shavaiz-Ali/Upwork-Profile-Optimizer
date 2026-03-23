import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const StatsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-1" />
          <Skeleton className="h-3 w-[120px]" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export const RecentAnalysesSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-[150px]" />
      <Skeleton className="h-4 w-[250px]" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[180px]" />
              <Skeleton className="h-3 w-[120px]" />
            </div>
            <Skeleton className="h-8 w-[80px] rounded-md" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
