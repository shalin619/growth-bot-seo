import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StepCard, StepStatus } from "@/components/seo/StepCard";
import { MetricsCard, MetricItem } from "@/components/seo/MetricsCard";
import { ResultsDashboard } from "@/components/seo/ResultsDashboard";
import { Download, Clock } from "lucide-react";
const Index = () => {
  const {
    toast
  } = useToast();
  const [running, setRunning] = useState(false);
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const [statuses, setStatuses] = useState<StepStatus[]>(Array(6).fill("pending"));
  const [metrics, setMetrics] = useState<Record<string, MetricItem[]>>({});
  const [autoRunDialogOpen, setAutoRunDialogOpen] = useState(false);
  const [frequency, setFrequency] = useState("");
  const [totals, setTotals] = useState({
    keywordsImproved: 0,
    pagesOptimized: 0,
    avgRankingBoostPct: 0,
    projectedMonthlyTraffic: 0,
    roiProjectionPct: 0
  });
  const steps = useMemo(() => [{
    id: "step1",
    title: "Keyword Performance Scan",
    desc: "We’re scanning 200+ ranking factors for your store’s products and blog content, including live SERP positions, volume, difficulty and trends."
  }, {
    id: "step2",
    title: "Competitive Gap Analysis",
    desc: "We’re analysing the top 3 competitors to uncover missing keywords and content gaps against your store."
  }, {
    id: "step3",
    title: "Content Rewrite & Enhancement",
    desc: "We’re rewriting product copy, headlines and alt text using competitive data and conversion-focused language."
  }, {
    id: "step4",
    title: "Meta Structure Optimization",
    desc: "We’re updating titles, meta descriptions and URLs for optimal length, placement and uniqueness."
  }, {
    id: "step5",
    title: "Schema Markup Deployment",
    desc: "We’re injecting Product, Review, Breadcrumb and FAQ JSON-LD for enhanced Google rich results."
  }, {
    id: "step6",
    title: "Final Quality Assurance",
    desc: "We’re validating broken links, alt tags, mobile SEO and fixing minor issues automatically."
  }], []);
  const completed = statuses.filter(s => s === "done").length;
  const progress = completed / steps.length;
  function rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  async function runAll() {
    if (running) return;
    setRunning(true);
    setMetrics({});
    setStatuses(Array(steps.length).fill("pending"));
    setTotals({
      keywordsImproved: 0,
      pagesOptimized: 0,
      avgRankingBoostPct: 0,
      projectedMonthlyTraffic: 0,
      roiProjectionPct: 0
    });
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setOpenItem(step.id);
      setStatuses(prev => prev.map((s, idx) => idx === i ? "running" : s));
      // Simulated work
      await new Promise(res => setTimeout(res, rand(800, 1400)));

      // Generate step metrics and accumulate results
      let items: MetricItem[] = [];
      setTotals(t => ({
        ...t
      }));
      if (step.id === "step1") {
        const scanned = rand(1200, 3000);
        const page1 = rand(50, 200);
        const gains = rand(60, 140);
        const drops = rand(10, 40);
        const avgPos = +(Math.random() * 3 - 0.5).toFixed(1); // -0.5 to 2.5
        items = [{
          label: "Total keywords scanned",
          value: scanned
        }, {
          label: "Keywords on Page 1",
          value: page1
        }, {
          label: "Ranking changes (drops vs. gains)",
          value: `${drops} drops / ${gains} gains`
        }, {
          label: "Average position change",
          value: `${avgPos > 0 ? "+" : ""}${avgPos}`
        }];
        setTotals(t => ({
          ...t,
          keywordsImproved: t.keywordsImproved + gains,
          projectedMonthlyTraffic: t.projectedMonthlyTraffic + rand(100, 400)
        }));
      }
      if (step.id === "step2") {
        const competitors = 3;
        const opps = rand(40, 120);
        const gaps = rand(10, 30);
        const diff = -rand(1, 5) - Math.random();
        items = [{
          label: "Competitors analysed",
          value: competitors
        }, {
          label: "New keyword opportunities",
          value: opps
        }, {
          label: "Content gaps identified",
          value: gaps
        }, {
          label: "Avg. ranking difference",
          value: `${diff.toFixed(1)} positions`
        }];
        setTotals(t => ({
          ...t,
          keywordsImproved: t.keywordsImproved + Math.round(opps * 0.4),
          projectedMonthlyTraffic: t.projectedMonthlyTraffic + rand(120, 300)
        }));
      }
      if (step.id === "step3") {
        const rewritten = rand(20, 100);
        const density = +(Math.random() * 1.2 + 0.3).toFixed(1);
        const readability = rand(8, 20);
        const ctr = +(Math.random() * 3 + 1.5).toFixed(1);
        items = [{
          label: "Product descriptions rewritten",
          value: rewritten
        }, {
          label: "Keyword density improvement",
          value: `+${density}%`
        }, {
          label: "Readability score improvement",
          value: `+${readability} pts`
        }, {
          label: "Predicted CTR lift",
          value: `+${ctr}%`
        }];
        setTotals(t => ({
          ...t,
          pagesOptimized: t.pagesOptimized + rewritten,
          projectedMonthlyTraffic: t.projectedMonthlyTraffic + rand(150, 400)
        }));
      }
      if (step.id === "step4") {
        const pagesMeta = rand(30, 200);
        const dups = rand(5, 30);
        const metaScore = rand(10, 25);
        const traffic = +(Math.random() * 8 + 4).toFixed(1);
        items = [{
          label: "Pages with meta optimized",
          value: pagesMeta
        }, {
          label: "Duplicate metas removed",
          value: dups
        }, {
          label: "Avg. meta score improvement",
          value: `+${metaScore}%`
        }, {
          label: "Projected organic traffic gain",
          value: `+${traffic}%`
        }];
        setTotals(t => ({
          ...t,
          pagesOptimized: t.pagesOptimized + pagesMeta,
          projectedMonthlyTraffic: t.projectedMonthlyTraffic + rand(200, 500)
        }));
      }
      if (step.id === "step5") {
        const schemaCount = rand(30, 120);
        items = [{
          label: "Products with schema added",
          value: schemaCount
        }, {
          label: "Schema types deployed",
          value: "Product, Review, Breadcrumb, FAQ"
        }, {
          label: "SERP feature eligibility increase",
          value: "+22%"
        }];
        setTotals(t => ({
          ...t,
          pagesOptimized: t.pagesOptimized + schemaCount,
          projectedMonthlyTraffic: t.projectedMonthlyTraffic + rand(80, 220)
        }));
      }
      if (step.id === "step6") {
        const fixed = rand(15, 80);
        const mobile = rand(8, 18);
        const pass = rand(120, 400);
        items = [{
          label: "SEO errors fixed",
          value: fixed
        }, {
          label: "Mobile performance score improvement",
          value: `+${mobile}`
        }, {
          label: "Pages passing all audits",
          value: pass
        }];
        setTotals(t => ({
          ...t,
          pagesOptimized: t.pagesOptimized + pass,
          projectedMonthlyTraffic: t.projectedMonthlyTraffic + rand(100, 300)
        }));
      }
      setMetrics(prev => ({
        ...prev,
        [step.id]: items
      }));
      setStatuses(prev => prev.map((s, idx) => idx === i ? "done" : s));
    }

    // Finalise totals
    setTotals(t => ({
      ...t,
      avgRankingBoostPct: +(Math.random() * 14 + 12).toFixed(1),
      roiProjectionPct: +(Math.random() * 180 + 120).toFixed(0) as unknown as number
    }));
    setRunning(false);
    setOpenItem(undefined);
    toast({
      title: "SEO optimisation complete",
      description: "Your store’s SEO has been optimised. Review the results dashboard below."
    });
  }
  function downloadReport() {
    const payload = {
      generatedAt: new Date().toISOString(),
      steps: steps.map((s, i) => ({
        id: s.id,
        title: s.title,
        status: statuses[i],
        metrics: metrics[s.id] ?? []
      })),
      totals
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seo-optimization-report.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function saveAutoRunFrequency() {
    if (!frequency.trim()) {
      toast({
        title: "Error",
        description: "Please enter a frequency.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Auto-run scheduled",
      description: `SEO optimization will run every ${frequency}.`
    });
    
    setAutoRunDialogOpen(false);
    setFrequency("");
  }
  return <>
      <Helmet>
        <title>AI Shopify SEO Optimizer Agent</title>
        <meta name="description" content="One-click, end-to-end AI SEO optimization for Shopify: keyword scan, competitive analysis, content rewrite, meta & schema, QA and results dashboard." />
        <link rel="canonical" href={(typeof window !== "undefined" ? window.location.origin : "") + "/"} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "AI Shopify SEO Optimizer Agent",
          "applicationCategory": "SEO Tool",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "description": "Automated, multi-agent SEO optimization for Shopify stores."
        })}</script>
      </Helmet>

      <header className="border-b">
        <div className="container py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AI Shopify SEO Optimizer Agent</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">This AI agent boosts your Shopify store’s visibility, drives more organic traffic, and increases sales by combining advanced SEO intelligence with automated large-scale optimization — all in under a minute.</p>
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className="story-link border-b-2 border-primary text-foreground">Optimize SEO</Link>
              <Link to="/impact" className="story-link text-muted-foreground hover:text-foreground">Impact Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <section className="mb-6">
          <Card>
            <CardContent className="py-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
              <div>
                <div className="text-sm text-muted-foreground">One-click automation</div>
                <div className="text-lg font-medium">Run complete end-to-end SEO optimization</div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="lg" onClick={runAll} disabled={running}>
                  {running ? "Optimizing…" : "Optimize SEO"}
                </Button>
                
                <Dialog open={autoRunDialogOpen} onOpenChange={setAutoRunDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" disabled={running}>
                      <Clock className="h-4 w-4 mr-2" /> Auto Run Optimization
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule Auto-Run Optimization</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input
                          id="frequency"
                          placeholder="e.g., 1 hour, 2 days, 1 week"
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter how often you want the SEO optimization to run automatically.
                        </p>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setAutoRunDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveAutoRunFrequency}>
                          Save Schedule
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="secondary" size="lg" onClick={downloadReport} disabled={running || completed === 0}>
                  <Download className="h-4 w-4 mr-2" /> Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="workflow">
          <h2 id="workflow" className="sr-only">Workflow</h2>

          <Accordion type="single" collapsible value={openItem} onValueChange={setOpenItem} className="space-y-3">
            {steps.map((s, i) => <StepCard key={s.id} value={s.id} stepNumber={i + 1} title={s.title} description={s.desc} status={statuses[i]}>
                {metrics[s.id] && <MetricsCard items={metrics[s.id]} />}
              </StepCard>)}
          </Accordion>
        </section>

        <section aria-labelledby="results">
          <h2 id="results" className="sr-only">Results</h2>
          <ResultsDashboard keywordsImproved={totals.keywordsImproved} pagesOptimized={totals.pagesOptimized} avgRankingBoostPct={totals.avgRankingBoostPct} projectedMonthlyTraffic={totals.projectedMonthlyTraffic} roiProjectionPct={totals.roiProjectionPct} progress={progress} />
        </section>
      </main>
    </>;
};
export default Index;