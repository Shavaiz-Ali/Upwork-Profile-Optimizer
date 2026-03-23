import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AiConfigService } from "@/services/ai-config.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ApiKeySettings } from "@/components/dashboard/ApiKeySettings";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20 min-h-full">
      <DashboardHeader title="API Configurations" />

      <div className="max-w-7xl mx-auto pt-6">
        <Suspense fallback={<ApiKeysSkeleton />}>
          <ApiKeysContent userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

async function ApiKeysContent({ userId }: { userId: string }) {
  const keys = await AiConfigService.getUserApiKeys(userId);
  return <ApiKeySettings initialKeys={JSON.parse(JSON.stringify(keys))} />;
}

function ApiKeysSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
