"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
    DollarSign,
    Loader2,
    Play,
    Save,
    Users,
    Clock,
    BarChart3,
    TrendingUp,
    AlertTriangle,
    FileText,
    Settings,
    Calculator,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import PageBanner from "@/components/layout/PageBanner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const CURRENCIES = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
];

function getCurrencySymbol(code) {
    return CURRENCIES.find((c) => c.code === code)?.symbol || "$";
}

// ─── Chart Components (lazy-loaded) ──────────────────────

function HistogramChart({ data, currencySymbol }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        async function render() {
            const { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title } =
                await import("chart.js");
            Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title);

            if (cancelled || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();

            chartRef.current = new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: data.map(
                        (b) => `${currencySymbol}${b.binStart.toLocaleString()}`
                    ),
                    datasets: [
                        {
                            label: "Frequency",
                            data: data.map((b) => b.count),
                            backgroundColor: "rgba(99, 102, 241, 0.6)",
                            borderColor: "rgba(99, 102, 241, 1)",
                            borderWidth: 1,
                            borderRadius: 3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Cost Distribution (Histogram)",
                            color: "hsl(var(--foreground))",
                            font: { size: 14, weight: "600" },
                        },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const idx = items[0].dataIndex;
                                    const bin = data[idx];
                                    return `${currencySymbol}${bin.binStart.toLocaleString()} – ${currencySymbol}${bin.binEnd.toLocaleString()}`;
                                },
                                label: (item) =>
                                    `Count: ${item.raw} (${(data[item.dataIndex].frequency * 100).toFixed(1)}%)`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            display: true,
                            ticks: {
                                maxTicksLimit: 8,
                                color: "hsl(var(--muted-foreground))",
                                font: { size: 10 },
                            },
                            grid: { display: false },
                        },
                        y: {
                            display: true,
                            ticks: { color: "hsl(var(--muted-foreground))" },
                            grid: { color: "hsl(var(--border) / 0.3)" },
                        },
                    },
                },
            });
        }
        render();
        return () => {
            cancelled = true;
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [data, currencySymbol]);

    return <canvas ref={canvasRef} />;
}

function SCurveChart({ data, currencySymbol }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        async function render() {
            const {
                Chart,
                LineController,
                LineElement,
                PointElement,
                CategoryScale,
                LinearScale,
                Tooltip,
                Title,
                Filler,
            } = await import("chart.js");
            Chart.register(
                LineController,
                LineElement,
                PointElement,
                CategoryScale,
                LinearScale,
                Tooltip,
                Title,
                Filler
            );

            if (cancelled || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();

            chartRef.current = new Chart(canvasRef.current, {
                type: "line",
                data: {
                    labels: data.map((p) => `${currencySymbol}${p.value.toLocaleString()}`),
                    datasets: [
                        {
                            label: "Cumulative Probability",
                            data: data.map((p) => (p.probability * 100).toFixed(1)),
                            borderColor: "rgba(16, 185, 129, 1)",
                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                            fill: true,
                            tension: 0.4,
                            pointRadius: 0,
                            borderWidth: 2.5,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Cumulative Probability (S-Curve)",
                            color: "hsl(var(--foreground))",
                            font: { size: 14, weight: "600" },
                        },
                        tooltip: {
                            callbacks: {
                                label: (item) => `Probability: ${item.raw}%`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                maxTicksLimit: 8,
                                color: "hsl(var(--muted-foreground))",
                                font: { size: 10 },
                            },
                            grid: { display: false },
                        },
                        y: {
                            min: 0,
                            max: 100,
                            ticks: {
                                callback: (v) => `${v}%`,
                                color: "hsl(var(--muted-foreground))",
                            },
                            grid: { color: "hsl(var(--border) / 0.3)" },
                        },
                    },
                },
            });
        }
        render();
        return () => {
            cancelled = true;
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [data, currencySymbol]);

    return <canvas ref={canvasRef} />;
}

function DurationHistogramChart({ data }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        async function render() {
            const { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title } =
                await import("chart.js");
            Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title);

            if (cancelled || !canvasRef.current) return;
            if (chartRef.current) chartRef.current.destroy();

            chartRef.current = new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: data.map((b) => `${b.binStart.toLocaleString()}h`),
                    datasets: [
                        {
                            label: "Frequency",
                            data: data.map((b) => b.count),
                            backgroundColor: "rgba(245, 158, 11, 0.6)",
                            borderColor: "rgba(245, 158, 11, 1)",
                            borderWidth: 1,
                            borderRadius: 3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: "Duration Distribution (Hours)",
                            color: "hsl(var(--foreground))",
                            font: { size: 14, weight: "600" },
                        },
                        tooltip: {
                            callbacks: {
                                title: (items) => {
                                    const idx = items[0].dataIndex;
                                    const bin = data[idx];
                                    return `${bin.binStart.toLocaleString()}h – ${bin.binEnd.toLocaleString()}h`;
                                },
                                label: (item) =>
                                    `Count: ${item.raw} (${(data[item.dataIndex].frequency * 100).toFixed(1)}%)`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                maxTicksLimit: 8,
                                color: "hsl(var(--muted-foreground))",
                                font: { size: 10 },
                            },
                            grid: { display: false },
                        },
                        y: {
                            ticks: { color: "hsl(var(--muted-foreground))" },
                            grid: { color: "hsl(var(--border) / 0.3)" },
                        },
                    },
                },
            });
        }
        render();
        return () => {
            cancelled = true;
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [data]);

    return <canvas ref={canvasRef} />;
}

// ─── Main Page ───────────────────────────────────────────

export default function Page() {
    const { projectId } = useParams();
    const { token } = useAuthStore();

    // Loading states
    const [loading, setLoading] = useState(true);
    const [savingConfig, setSavingConfig] = useState(false);
    const [savingEstimates, setSavingEstimates] = useState(false);
    const [simulating, setSimulating] = useState(false);

    // Config
    const [config, setConfig] = useState({
        hourly_rate: 50,
        currency: "USD",
        num_developers: 1,
    });

    // Requirements & estimates
    const [requirements, setRequirements] = useState([]);
    const [estimates, setEstimates] = useState({}); // keyed by requirement_id

    // Simulation results
    const [results, setResults] = useState(null);

    // ─── Fetch Data ────────────────────────────────────

    useEffect(() => {
        if (!projectId || !token) return;

        async function fetchAll() {
            try {
                // Fetch requirements
                const reqRes = await fetch(`${API_BASE}/requirements/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (reqRes.ok) {
                    const reqData = await reqRes.json();
                    setRequirements(reqData.requirements || []);
                }

                // Fetch config
                const cfgRes = await fetch(`${API_BASE}/economic-feasibility/config/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (cfgRes.ok) {
                    const cfgData = await cfgRes.json();
                    if (cfgData.config) {
                        setConfig({
                            hourly_rate: cfgData.config.hourly_rate,
                            currency: cfgData.config.currency,
                            num_developers: cfgData.config.num_developers,
                        });
                    }
                }

                // Fetch existing estimates
                const estRes = await fetch(`${API_BASE}/economic-feasibility/estimates/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (estRes.ok) {
                    const estData = await estRes.json();
                    const estMap = {};
                    (estData.estimates || []).forEach((e) => {
                        estMap[e.requirement_id] = {
                            optimistic_hours: e.optimistic_hours,
                            most_likely_hours: e.most_likely_hours,
                            pessimistic_hours: e.pessimistic_hours,
                        };
                    });
                    setEstimates(estMap);
                }
            } catch (error) {
                console.error("Error loading data:", error);
                toast.error("Failed to load economic feasibility data.");
            } finally {
                setLoading(false);
            }
        }

        fetchAll();
    }, [projectId, token]);

    // ─── Handlers ──────────────────────────────────────

    const handleSaveConfig = async () => {
        setSavingConfig(true);
        try {
            const res = await fetch(`${API_BASE}/economic-feasibility/config/${projectId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save config");
            }
            toast.success("Configuration saved successfully!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSavingConfig(false);
        }
    };

    const handleEstimateChange = (reqId, field, value) => {
        setEstimates((prev) => ({
            ...prev,
            [reqId]: {
                ...(prev[reqId] || { optimistic_hours: "", most_likely_hours: "", pessimistic_hours: "" }),
                [field]: value,
            },
        }));
    };

    const handleSaveEstimates = async () => {
        // Validate: only save requirements that have all three values filled
        const toSave = Object.entries(estimates)
            .filter(
                ([, est]) =>
                    est.optimistic_hours !== "" &&
                    est.most_likely_hours !== "" &&
                    est.pessimistic_hours !== ""
            )
            .map(([reqId, est]) => ({
                requirement_id: reqId,
                optimistic_hours: parseFloat(est.optimistic_hours),
                most_likely_hours: parseFloat(est.most_likely_hours),
                pessimistic_hours: parseFloat(est.pessimistic_hours),
            }));

        if (toSave.length === 0) {
            toast.error("Please enter estimates for at least one requirement.");
            return;
        }

        // Validate ordering
        for (const est of toSave) {
            if (est.optimistic_hours > est.most_likely_hours || est.most_likely_hours > est.pessimistic_hours) {
                toast.error("Estimates must satisfy: Optimistic ≤ Most Likely ≤ Pessimistic");
                return;
            }
        }

        setSavingEstimates(true);
        try {
            const res = await fetch(`${API_BASE}/economic-feasibility/estimates/${projectId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ estimates: toSave }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to save estimates");
            }
            toast.success(`${toSave.length} estimate(s) saved successfully!`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSavingEstimates(false);
        }
    };

    const handleSimulate = async () => {
        setSimulating(true);
        try {
            const res = await fetch(`${API_BASE}/economic-feasibility/simulate/${projectId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ iterations: 10000 }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Simulation failed");
            }

            const data = await res.json();
            setResults(data.simulation);
            toast.success("Simulation completed successfully!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSimulating(false);
        }
    };

    // ─── Derived values ────────────────────────────────

    const filledEstimatesCount = Object.values(estimates).filter(
        (e) => e.optimistic_hours !== "" && e.most_likely_hours !== "" && e.pessimistic_hours !== ""
    ).length;

    const currencySymbol = getCurrencySymbol(config.currency);

    const formatCost = (val) =>
        `${currencySymbol}${Number(val).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;

    const formatHours = (val) =>
        `${Number(val).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
        })}h`;

    // ─── Render ────────────────────────────────────────

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    {/* Header */}
                    <PageBanner
                        title="Economic Feasibility"
                        description="Monte Carlo simulation for cost and schedule risk analysis."
                        icon={DollarSign}
                    />

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <Tabs defaultValue="setup" orientation="vertical" className="flex flex-col gap-6 md:flex-row">
                            <div className="flex flex-col gap-4 min-w-[240px] md:sticky md:top-24">
                                <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 p-1 border rounded-xl">
                                    <TabsTrigger value="setup" className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                        <Settings className="h-4 w-4" /> Setup
                                    </TabsTrigger>
                                    <TabsTrigger value="estimates" className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                        <Calculator className="h-4 w-4" /> Estimates
                                    </TabsTrigger>
                                    <TabsTrigger value="results" className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                        <BarChart3 className="h-4 w-4" /> Results
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1">
                                {/* ─── Setup Tab ────────────────────────── */}
                                <TabsContent value="setup" className="mt-0 space-y-6 outline-none animate-fade-in">
                                    <Card className="border-border/50 shadow-sm">
                                        <CardHeader className="bg-muted/30 border-b border-border/50">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Settings className="h-5 w-5 text-primary" />
                                                Project Configuration
                                            </CardTitle>
                                            <CardDescription>
                                                Set the base economic parameters for this project.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-6">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {/* Hourly Rate */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="hourlyRate">Hourly Rate</Label>
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                                            {currencySymbol}
                                                        </span>
                                                        <Input
                                                            id="hourlyRate"
                                                            type="number"
                                                            min="1"
                                                            className="pl-8"
                                                            value={config.hourly_rate}
                                                            onChange={(e) =>
                                                                setConfig((prev) => ({
                                                                    ...prev,
                                                                    hourly_rate: parseFloat(e.target.value) || 0,
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {/* Currency */}
                                                <div className="space-y-2">
                                                    <Label>Currency</Label>
                                                    <Select
                                                        value={config.currency}
                                                        onValueChange={(val) =>
                                                            setConfig((prev) => ({ ...prev, currency: val }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CURRENCIES.map((c) => (
                                                                <SelectItem key={c.code} value={c.code}>
                                                                    {c.symbol} {c.code} — {c.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Number of Developers */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="numDevs">Number of Developers</Label>
                                                    <Input
                                                        id="numDevs"
                                                        type="number"
                                                        min="1"
                                                        value={config.num_developers}
                                                        onChange={(e) =>
                                                            setConfig((prev) => ({
                                                                ...prev,
                                                                num_developers: parseInt(e.target.value) || 1,
                                                            }))
                                                        }
                                                    />
                                                </div>
                                            </div>

                                        <div className="flex justify-end">
                                            <Button
                                                onClick={handleSaveConfig}
                                                disabled={savingConfig}
                                                className="gap-2"
                                            >
                                                {savingConfig ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                Save Configuration
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ─── Estimates Tab ────────────────────── */}
                            <TabsContent value="estimates" className="mt-0 space-y-6 outline-none animate-fade-in">
                                <Card className="border-border/50 shadow-sm">
                                    <CardHeader className="bg-muted/30 border-b border-border/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="text-xl flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-primary" />
                                                    Duration Estimates
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    Enter three-point estimates (in hours) for each requirement:
                                                    Optimistic, Most Likely, and Pessimistic.
                                                </CardDescription>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    {filledEstimatesCount} / {requirements.length} estimated
                                                </Badge>
                                                <Button
                                                    onClick={handleSaveEstimates}
                                                    disabled={savingEstimates || filledEstimatesCount === 0}
                                                    className="gap-2"
                                                    size="sm"
                                                >
                                                    {savingEstimates ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Save className="h-3.5 w-3.5" />
                                                    )}
                                                    Save Estimates
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {requirements.length === 0 ? (
                                            <div className="p-12 text-center">
                                                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-4">
                                                    <FileText className="h-8 w-8 text-muted-foreground/50" />
                                                </div>
                                                <h3 className="text-lg font-medium text-muted-foreground mb-1">
                                                    No Requirements Found
                                                </h3>
                                                <p className="text-sm text-muted-foreground/80">
                                                    Add requirements to this project first.
                                                </p>
                                            </div>
                                        ) : (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className="w-[50px]">#</TableHead>
                                                        <TableHead>Requirement</TableHead>
                                                        <TableHead className="w-[120px] text-center">
                                                            <span className="text-emerald-600">Optimistic</span>
                                                        </TableHead>
                                                        <TableHead className="w-[120px] text-center">
                                                            <span className="text-blue-600">Most Likely</span>
                                                        </TableHead>
                                                        <TableHead className="w-[120px] text-center">
                                                            <span className="text-amber-600">Pessimistic</span>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {requirements.map((req, idx) => {
                                                        const est = estimates[req.id] || {};
                                                        return (
                                                            <TableRow key={req.id}>
                                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                                    {idx + 1}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div>
                                                                        <span className="font-medium">{req.title}</span>
                                                                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                                                                            {req.description}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.5"
                                                                        placeholder="hrs"
                                                                        className="h-8 text-center text-sm"
                                                                        value={est.optimistic_hours ?? ""}
                                                                        onChange={(e) =>
                                                                            handleEstimateChange(
                                                                                req.id,
                                                                                "optimistic_hours",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.5"
                                                                        placeholder="hrs"
                                                                        className="h-8 text-center text-sm"
                                                                        value={est.most_likely_hours ?? ""}
                                                                        onChange={(e) =>
                                                                            handleEstimateChange(
                                                                                req.id,
                                                                                "most_likely_hours",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Input
                                                                        type="number"
                                                                        min="0"
                                                                        step="0.5"
                                                                        placeholder="hrs"
                                                                        className="h-8 text-center text-sm"
                                                                        value={est.pessimistic_hours ?? ""}
                                                                        onChange={(e) =>
                                                                            handleEstimateChange(
                                                                                req.id,
                                                                                "pessimistic_hours",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ─── Results Tab ──────────────────────── */}
                            <TabsContent value="results" className="mt-0 space-y-6 outline-none animate-fade-in">
                                {/* Simulate Button */}
                                <Card className="border-border/50 shadow-sm">
                                    <CardContent className="py-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">Run Simulation</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Execute 10,000 Monte Carlo iterations based on your estimates.
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleSimulate}
                                                disabled={simulating}
                                                size="lg"
                                                className="gap-2"
                                            >
                                                {simulating ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" /> Simulating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="h-4 w-4" /> Run Simulation
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {!results ? (
                                    <Card className="border-border/50 shadow-sm">
                                        <CardContent className="py-16 text-center">
                                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                                <BarChart3 className="h-10 w-10 text-primary" />
                                            </div>
                                            <h3 className="text-xl font-semibold font-display mb-2">
                                                No Results Yet
                                            </h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                Configure your project settings, enter estimates, and run the
                                                simulation to see probabilistic cost and schedule forecasts.
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <>
                                        {/* Config used */}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="outline">
                                                {results.config.num_requirements} requirements
                                            </Badge>
                                            <Badge variant="outline">
                                                {results.config.iterations.toLocaleString()} iterations
                                            </Badge>
                                            <Badge variant="outline">
                                                {currencySymbol}{results.config.hourly_rate}/hr
                                            </Badge>
                                            <Badge variant="outline">
                                                {results.config.num_developers} developer(s)
                                            </Badge>
                                        </div>

                                        {/* Cost Stats */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-primary" /> Cost Analysis
                                            </h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                                {[
                                                    { label: "Mean Cost", value: formatCost(results.cost.mean), icon: TrendingUp, color: "text-primary" },
                                                    { label: "Median (P50)", value: formatCost(results.cost.p50), icon: BarChart3, color: "text-blue-500" },
                                                    { label: "P80 Cost", value: formatCost(results.cost.p80), icon: TrendingUp, color: "text-amber-500" },
                                                    { label: "P95 Cost", value: formatCost(results.cost.p95), icon: AlertTriangle, color: "text-red-500" },
                                                    { label: "Std Dev", value: formatCost(results.cost.stdDev), icon: BarChart3, color: "text-muted-foreground" },
                                                ].map((stat) => (
                                                    <Card key={stat.label} className="border-border/50 shadow-sm">
                                                        <CardContent className="p-4 flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                                                                <stat.icon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                                                <p className="text-lg font-bold font-display">{stat.value}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Duration Stats */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-amber-500" /> Schedule Analysis
                                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                                    (effective hours per developer)
                                                </span>
                                            </h3>
                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                                {[
                                                    { label: "Mean Duration", value: formatHours(results.duration.mean), icon: Clock, color: "text-primary" },
                                                    { label: "Median (P50)", value: formatHours(results.duration.p50), icon: BarChart3, color: "text-blue-500" },
                                                    { label: "P80 Duration", value: formatHours(results.duration.p80), icon: TrendingUp, color: "text-amber-500" },
                                                    { label: "P95 Duration", value: formatHours(results.duration.p95), icon: AlertTriangle, color: "text-red-500" },
                                                    { label: "Std Dev", value: formatHours(results.duration.stdDev), icon: BarChart3, color: "text-muted-foreground" },
                                                ].map((stat) => (
                                                    <Card key={stat.label} className="border-border/50 shadow-sm">
                                                        <CardContent className="p-4 flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg bg-muted/50 ${stat.color}`}>
                                                                <stat.icon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                                                <p className="text-lg font-bold font-display">{stat.value}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Charts */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <Card className="border-border/50 shadow-sm">
                                                <CardContent className="pt-6">
                                                    <div className="h-[300px]">
                                                        <HistogramChart
                                                            data={results.cost.histogram}
                                                            currencySymbol={currencySymbol}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-border/50 shadow-sm">
                                                <CardContent className="pt-6">
                                                    <div className="h-[300px]">
                                                        <SCurveChart
                                                            data={results.cost.cumulative}
                                                            currencySymbol={currencySymbol}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card className="border-border/50 shadow-sm lg:col-span-2">
                                                <CardContent className="pt-6">
                                                    <div className="h-[300px]">
                                                        <DurationHistogramChart
                                                            data={results.duration.histogram}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Range Summary */}
                                        <Card className="border-border/50 shadow-sm">
                                            <CardHeader className="bg-muted/30 border-b border-border/50">
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5 text-primary" />
                                                    Confidence Intervals
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-6">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Confidence Level</TableHead>
                                                            <TableHead className="text-right">Cost Range</TableHead>
                                                            <TableHead className="text-right">Duration Range</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {[
                                                            { level: "80%", costLow: results.cost.p10, costHigh: results.cost.p90, durLow: results.duration.p10, durHigh: results.duration.p90 },
                                                            { level: "90%", costLow: results.cost.p10, costHigh: results.cost.p95, durLow: results.duration.p10, durHigh: results.duration.p95 },
                                                            { level: "Most Likely (P50)", costLow: results.cost.p50, costHigh: null, durLow: results.duration.p50, durHigh: null },
                                                        ].map((row) => (
                                                            <TableRow key={row.level}>
                                                                <TableCell className="font-medium">{row.level}</TableCell>
                                                                <TableCell className="text-right font-mono text-sm">
                                                                    {row.costHigh
                                                                        ? `${formatCost(row.costLow)} – ${formatCost(row.costHigh)}`
                                                                        : formatCost(row.costLow)}
                                                                </TableCell>
                                                                <TableCell className="text-right font-mono text-sm">
                                                                    {row.durHigh
                                                                        ? `${formatHours(row.durLow)} – ${formatHours(row.durHigh)}`
                                                                        : formatHours(row.durLow)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </TabsContent>
                            </div>
                        </Tabs>
                    )}
                </div>
            </main>
        </ProtectedRoute>
    );
}
