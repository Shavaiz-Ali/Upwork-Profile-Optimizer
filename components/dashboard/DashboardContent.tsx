import React from "react";
import { AnalysisService } from "@/services/analysis.service";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, TrendingUp, CheckCircle, BarChart3 } from "lucide-react";

export const DashboardStats = async ({ userId }: { userId: string }) => {
  const stats = await AnalysisService.getDashboardStats(userId);

  const cards = [
    { title: "Total Analyses", value: stats.totalAnalyses, icon: FileText, desc: "Across all profiles" },
    { title: "Latest Score", value: `${stats.latestScore}/100`, icon: TrendingUp, desc: "Most recent profile score" },
    { title: "Target Score", value: "90+", icon: CheckCircle, desc: "Goal for all sections" },
    { title: "Avg. Completion", value: "85%", icon: BarChart3, desc: "Profile completeness" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <Card key={i} className="relative overflow-hidden border-none bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const RecentAnalysesList = async ({ userId }: { userId: string }) => {
  const { data: analyses } = await AnalysisService.getUserAnalyses(userId, { limit: 5 });

  if (!analyses || analyses.length === 0) {
    return (
      <Card className="border-none bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="flex flex-col items-center justify-center h-48 py-10">
          <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">No analyses yet</p>
          <p className="text-sm text-muted-foreground">Run your first analysis with the extension</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-card/60 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Review the latest insights from your profile analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <div key={analysis._id.toString()} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <p className="text-sm font-bold leading-none">{analysis.profileTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(analysis.createdAt).toLocaleDateString()} • {analysis.profileName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  analysis.overallScore >= 80 ? 'bg-green-500/10 text-green-500' : 
                  analysis.overallScore >= 60 ? 'bg-yellow-500/10 text-yellow-500' : 
                  'bg-red-500/10 text-red-500'
                }`}>
                  {analysis.overallScore}
                </span>
                <a 
                  href={`/dashboard/analysis/${analysis._id}`} 
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
