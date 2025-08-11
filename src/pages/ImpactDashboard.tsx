import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
} from "recharts";

// Types
type RangeKey = "yesterday" | "7d" | "30d" | "custom";

type KeywordRow = {
  keyword: string;
  oldPos: number;
  newPos: number;
  volume: number;
  estTraffic: number;
};

type PageRow = {
  url: string;
  before: number; // 0-100
  after: number; // 0-100
  visitsBefore: number;
  visitsAfter: number;
  conversionImpact: string;
};

const ImpactDashboard = () => {
  const { toast } = useToast();
  const [range, setRange] = useState<RangeKey>("7d");
  const [kwSort, setKwSort] = useState<{ key: keyof KeywordRow; dir: "asc" | "desc" }>({ key: "estTraffic", dir: "desc" });
  const [pgSort, setPgSort] = useState<{ key: keyof PageRow; dir: "asc" | "desc" }>({ key: "after", dir: "desc" });

  const days = useMemo(() => (range === "yesterday" ? 2 : range === "7d" ? 7 : 30), [range]);

  // Mock time-series data based on selected range
  const rankingSeries = useMemo(() => {
    const now = new Date();
    return Array.from({ length: days }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (days - 1 - i));
      const base = 100 + i * 2;
      return {
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        top3: Math.max(10, Math.round(18 + i * 0.8 + Math.random() * 3)),
        top10: Math.round(base + Math.random() * 10),
        top50: Math.round(base * 2 + 60 + Math.random() * 20),
      };
    });
  }, [days]);

  const trafficSeries = useMemo(() => {
    const now = new Date();
    return Array.from({ length: days }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (days - 1 - i));
      const visits = 300 + i * 40 + Math.round(Math.random() * 80);
      const convRate = 2 + Math.sin(i / 3) * 0.4 + 0.2 * Math.random();
      const conversions = Math.round((visits * convRate) / 100);
      return {
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        visits,
        conversions,
        convRate: +convRate.toFixed(2),
      };
    });
  }, [days]);

  // Tables
  const keywordRows = useMemo<KeywordRow[]>(() => {
    const base: KeywordRow[] = [
      { keyword: "organic cotton hoodie", oldPos: 14, newPos: 5, volume: 5200, estTraffic: 240 },
      { keyword: "winter boots for women", oldPos: 8, newPos: 2, volume: 3800, estTraffic: 340 },
      { keyword: "sustainable yoga leggings", oldPos: 22, newPos: 12, volume: 2900, estTraffic: 120 },
      { keyword: "vegan leather backpack", oldPos: 17, newPos: 9, volume: 4100, estTraffic: 210 },
      { keyword: "eco friendly water bottle", oldPos: 30, newPos: 18, volume: 5400, estTraffic: 160 },
    ];
    return [...base].sort((a, b) => (kwSort.dir === "asc" ? (a[kwSort.key] as any) - (b[kwSort.key] as any) : (b[kwSort.key] as any) - (a[kwSort.key] as any)));
  }, [kwSort]);

  const pageRows = useMemo<PageRow[]>(() => {
    const base: PageRow[] = [
      { url: "/products/organic-cotton-hoodie", before: 62, after: 86, visitsBefore: 820, visitsAfter: 1430, conversionImpact: "+$1,240/mo" },
      { url: "/collections/winter-boots", before: 70, after: 88, visitsBefore: 1200, visitsAfter: 1920, conversionImpact: "+$1,760/mo" },
      { url: "/products/vegan-leather-backpack", before: 58, after: 80, visitsBefore: 640, visitsAfter: 1100, conversionImpact: "+$860/mo" },
      { url: "/blog/how-to-choose-yoga-leggings", before: 65, after: 79, visitsBefore: 450, visitsAfter: 770, conversionImpact: "+$420/mo" },
    ];
    return [...base].sort((a, b) => (pgSort.dir === "asc" ? (a[pgSort.key] as any) - (b[pgSort.key] as any) : (b[pgSort.key] as any) - (a[pgSort.key] as any)));
  }, [pgSort]);

  const summary = {
    keywordsImproved: 124,
    pagesOptimised: 23,
    avgRankingChange: +3.4,
    projectedTraffic: 4500,
  };

  function downloadPdf() {
    toast({ title: "Report generation", description: "PDF export will be available soon. Downloading JSON for now." });
    const blob = new Blob([JSON.stringify({ summary, rankingSeries, trafficSeries, keywordRows, pageRows }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seo-impact-report-${range}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function emailReport() {
    toast({ title: "Email sent", description: "A mock email was sent to your team with the latest impact results." });
  }

  const activeTab = (tab: "optimise" | "impact") =>
    tab === "impact"
      ? "border-b-2 border-primary text-foreground"
      : "text-muted-foreground hover:text-foreground";

  return (
    <>
      <Helmet>
        <title>SEO Impact Dashboard | AI Shopify SEO Agent</title>
        <meta name="description" content="Real performance metrics and ROI from your SEO optimisation activities. View trends, traffic, conversions and ROI." />
        <link rel="canonical" href={(typeof window !== "undefined" ? window.location.origin : "") + "/impact"} />
      </Helmet>

      <header className="border-b">
        <div className="container py-6">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">SEO Impact Dashboard</h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">Real performance metrics and ROI from your SEO optimisation activities.</p>
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className={`story-link ${activeTab("optimise")}`}>Optimise SEO</Link>
              <Link to="/impact" className={`story-link ${activeTab("impact")}`}>Impact Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Controls */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={range} onValueChange={(v: RangeKey) => setRange(v)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={downloadPdf}>Download Full SEO Report (PDF)</Button>
              <Button onClick={emailReport}>Email Report to Team</Button>
            </div>
          </div>
        </section>

        {/* Impact Summary */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard title="Keywords Improved" value={`+${summary.keywordsImproved}`} sub="vs previous period" trend="up" />
            <SummaryCard title="Pages Optimised" value={`${summary.pagesOptimised}`} sub="fully optimised" trend="up" />
            <SummaryCard title="Avg Ranking Change" value={`+${summary.avgRankingChange} positions`} sub="overall avg change" trend="up" />
            <SummaryCard title="Projected Monthly Traffic" value={`+${summary.projectedTraffic.toLocaleString()} visits`} sub="estimated" trend="up" />
          </div>
        </section>

        {/* Ranking Trends */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Ranking Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankingSeries} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="top3" name="Top 3" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="top10" name="Top 10" stroke="hsl(var(--primary) / 0.6)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="top50" name="Top 50" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Traffic & Conversions */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Traffic & Conversions Impact</CardTitle>
            </CardHeader>
            <CardContent className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={trafficSeries} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 6]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: any, n: any) => (n === "convRate" ? `${v}%` : v)} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="visits" name="Organic visits" fill="hsl(var(--accent-foreground) / 0.15)" />
                  <Line yAxisId="left" type="monotone" dataKey="conversions" name="Estimated conversions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="convRate" name="Conversion rate" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Keyword Movement Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Detailed Keyword Movement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTh label="Keyword" onClick={() => toggleKwSort("keyword")} active={kwSort.key === "keyword"} dir={kwSort.dir} />
                      <SortableTh label="Old Position" onClick={() => toggleKwSort("oldPos")} active={kwSort.key === "oldPos"} dir={kwSort.dir} />
                      <SortableTh label="New Position" onClick={() => toggleKwSort("newPos")} active={kwSort.key === "newPos"} dir={kwSort.dir} />
                      <SortableTh label="Change" onClick={() => toggleKwSort("newPos")} active={kwSort.key === "newPos"} dir={kwSort.dir} />
                      <SortableTh label="Search Volume" onClick={() => toggleKwSort("volume")} active={kwSort.key === "volume"} dir={kwSort.dir} />
                      <SortableTh label="Est. Traffic Gain" onClick={() => toggleKwSort("estTraffic")} active={kwSort.key === "estTraffic"} dir={kwSort.dir} />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywordRows.map((r) => {
                      const change = r.oldPos - r.newPos;
                      return (
                        <TableRow key={r.keyword}>
                          <TableCell>{r.keyword}</TableCell>
                          <TableCell>{r.oldPos}</TableCell>
                          <TableCell>{r.newPos}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center gap-1 ${change > 0 ? "text-primary" : "text-destructive"}`}>
                              {change > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              {change > 0 ? `+${change}` : `${change}`}
                            </span>
                          </TableCell>
                          <TableCell>{r.volume.toLocaleString()}</TableCell>
                          <TableCell>+{r.estTraffic.toLocaleString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pages Performance Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Pages Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableTh label="Page URL" onClick={() => togglePgSort("url")} active={pgSort.key === "url"} dir={pgSort.dir} />
                      <SortableTh label="Before Score" onClick={() => togglePgSort("before")} active={pgSort.key === "before"} dir={pgSort.dir} />
                      <SortableTh label="After Score" onClick={() => togglePgSort("after")} active={pgSort.key === "after"} dir={pgSort.dir} />
                      <SortableTh label="Improvement %" onClick={() => togglePgSort("after")} active={pgSort.key === "after"} dir={pgSort.dir} />
                      <SortableTh label="Visits Before" onClick={() => togglePgSort("visitsBefore")} active={pgSort.key === "visitsBefore"} dir={pgSort.dir} />
                      <SortableTh label="Visits After" onClick={() => togglePgSort("visitsAfter")} active={pgSort.key === "visitsAfter"} dir={pgSort.dir} />
                      <SortableTh label="Conversion Impact" onClick={() => togglePgSort("conversionImpact")} active={pgSort.key === "conversionImpact"} dir={pgSort.dir} />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((r) => {
                      const imp = Math.max(0, r.after - r.before);
                      return (
                        <TableRow key={r.url}>
                          <TableCell className="font-medium">{r.url}</TableCell>
                          <TableCell>{r.before}</TableCell>
                          <TableCell>{r.after}</TableCell>
                          <TableCell>
                            <div className="w-40">
                              <div className="h-2 rounded-full bg-secondary">
                                <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, (imp / 100) * 100)}%` }} />
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">+{imp}%</div>
                            </div>
                          </TableCell>
                          <TableCell>{r.visitsBefore.toLocaleString()}</TableCell>
                          <TableCell>{r.visitsAfter.toLocaleString()}</TableCell>
                          <TableCell>{r.conversionImpact}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ROI Projection */}
        <section>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>What This Means for Your Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Estimated added monthly revenue based on current conversion rates and AOV: <span className="font-semibold">+$6,320</span>.</p>
              <p className="text-muted-foreground">These results are based on your store’s real performance data and could grow further as Google indexes all changes.</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );

  function toggleKwSort(key: keyof KeywordRow) {
    setKwSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
  }
  function togglePgSort(key: keyof PageRow) {
    setPgSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
  }
};

export default ImpactDashboard;

// Reusable components
const SummaryCard = ({ title, value, sub, trend = "up" as "up" | "down" }) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-1 flex items-center gap-2 text-2xl font-semibold tracking-tight">
          {value}
          {trend === "up" ? (
            <ArrowUpRight className="h-5 w-5 text-primary" />
          ) : (
            <ArrowDownRight className="h-5 w-5 text-destructive" />
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{sub}</div>
      </CardContent>
    </Card>
  );
};

const SortableTh = ({ label, onClick, active, dir }: { label: string; onClick: () => void; active?: boolean; dir?: "asc" | "desc" }) => (
  <TableHead>
    <button onClick={onClick} className={`inline-flex items-center gap-1 ${active ? "text-foreground" : "text-muted-foreground"}`}>
      {label}
      {active && <span className="text-xs">{dir === "asc" ? "▲" : "▼"}</span>}
    </button>
  </TableHead>
);
