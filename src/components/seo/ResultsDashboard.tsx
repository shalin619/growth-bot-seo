import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, BarChart3, Rocket, LineChart, Percent } from "lucide-react";

export interface ResultsTotals {
  keywordsImproved: number;
  pagesOptimised: number;
  avgRankingBoostPct: number; // 0-100
  projectedMonthlyTraffic: number;
  roiProjectionPct: number; // 0-100+
  progress: number; // 0-1
}

export const ResultsDashboard = ({
  keywordsImproved,
  pagesOptimised,
  avgRankingBoostPct,
  projectedMonthlyTraffic,
  roiProjectionPct,
  progress,
}: ResultsTotals) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Results Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overall progress</span>
            <span className="text-sm font-medium">{Math.round(progress * 100)}%</span>
          </div>
          <Progress value={progress * 100} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Keywords improved" value={keywordsImproved.toLocaleString()} />
          <StatCard icon={<BarChart3 className="h-5 w-5" />} label="Pages optimised" value={pagesOptimised.toLocaleString()} />
          <StatCard icon={<LineChart className="h-5 w-5" />} label="Avg. ranking boost" value={`${avgRankingBoostPct.toFixed(1)}%`} />
          <StatCard icon={<Rocket className="h-5 w-5" />} label="Projected monthly traffic" value={projectedMonthlyTraffic.toLocaleString()} />
          <StatCard icon={<Percent className="h-5 w-5" />} label="ROI projection" value={`${roiProjectionPct.toFixed(0)}%`} />
        </div>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-lg border p-4 hover-scale">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      <span className="text-primary">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
    <div className="text-2xl font-semibold tracking-tight">{value}</div>
  </div>
);
