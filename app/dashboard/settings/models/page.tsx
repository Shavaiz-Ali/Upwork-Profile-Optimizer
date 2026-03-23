import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AiConfigService } from "@/services/ai-config.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ModelSettings } from "@/components/dashboard/ModelSettings";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ModelsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20 min-h-full">
      <DashboardHeader title="AI Model Configurations" />

      <div className="max-w-7xl mx-auto pt-6">
        <Suspense fallback={<ModelsSkeleton />}>
          <ModelsContent userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

async function ModelsContent({ userId }: { userId: string }) {
  const [models, apiKeys] = await Promise.all([
    AiConfigService.getUserModels(userId),
    AiConfigService.getUserApiKeys(userId)
  ]);
  
  return (
    <ModelSettings 
      initialModels={JSON.parse(JSON.stringify(models))} 
      apiKeys={JSON.parse(JSON.stringify(apiKeys))} 
    />
  );
}

function ModelsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
