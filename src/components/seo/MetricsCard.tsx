import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export type MetricItem = {
  label: string;
  value: string | number;
};

interface MetricsCardProps {
  items: MetricItem[];
}

export const MetricsCard = ({ items }: MetricsCardProps) => {
  return (
    <Card className="mt-4 animate-fade-in">
      <CardHeader>
        <CardTitle>Metrics summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((m) => (
            <li key={m.label} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">{m.label}</div>
                <div className="text-base font-medium">{m.value}</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
