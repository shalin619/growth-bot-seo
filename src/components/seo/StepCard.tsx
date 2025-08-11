import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import React from "react";

export type StepStatus = "pending" | "running" | "done";

interface StepCardProps {
  value: string;
  stepNumber: number;
  title: string;
  description: string;
  status: StepStatus;
  children?: React.ReactNode;
}

export const StepCard = ({ value, stepNumber, title, description, status, children }: StepCardProps) => {
  const StatusIcon = status === "done" ? (
    <CheckCircle2 className="h-5 w-5 text-primary" />
  ) : status === "running" ? (
    <Loader2 className="h-5 w-5 animate-spin" />
  ) : (
    <Circle className="h-5 w-5 text-muted-foreground" />
  );

  const statusLabel = status === "done" ? "Done" : status === "running" ? "Running" : "Pending";

  return (
    <AccordionItem value={value} className="border rounded-lg">
      <AccordionTrigger className="px-4">
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-3 text-left">
            {StatusIcon}
            <div>
              <div className="text-sm text-muted-foreground">Step {stepNumber}</div>
              <div className="font-medium">{title}</div>
            </div>
          </div>
          <Badge variant="secondary">{statusLabel}</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Card className="border-0 shadow-none">
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{description}</p>
            {children}
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
};
