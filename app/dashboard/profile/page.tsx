import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserService } from "@/services/user.service";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id as string;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-muted/20 min-h-full">
      <DashboardHeader title="User Profile" />

      <div className="max-w-7xl mx-auto pt-6">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileContent userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProfileContent({ userId }: { userId: string }) {
  const user = await UserService.getUserProfile(userId);
  return <ProfileForm user={JSON.parse(JSON.stringify(user))} />;
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="lg:col-span-2 h-96 w-full rounded-xl" />
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
