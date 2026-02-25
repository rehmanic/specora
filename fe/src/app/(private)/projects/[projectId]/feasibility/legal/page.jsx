"use client";

import { useState } from "react";
import { Gavel, Loader2, CheckCircle2, XCircle, Search, AlertTriangle, FileText } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function Page() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState(null);

    const handleCheck = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error("Please provide both a title and description");
            return;
        }

        setIsChecking(true);
        setResult(null);

        try {
            // Adjust port to match standard Dev setups or environment variables if needed
            const API_URL = "http://localhost:8000/api/v1/feasibility/legal/single";

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: "temp-" + Date.now(),
                    title: title,
                    description: description
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to connect to Norma backend");
            }

            const data = await response.json();
            setResult(data);

            if (data.is_feasible) {
                toast.success("Legal check completed. Found relevant context.");
            } else {
                toast.warning("Legal check completed. No highly relevant context found.");
            }
        } catch (error) {
            console.error("Error checking feasibility:", error);
            toast.error("Could not run legal check. Please ensure the Norma service is running.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["manager", "requirements_engineer", "developer"]}>
            <main className="w-full p-6 lg:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-xl">
                                    <Gavel className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold font-display tracking-tight">Legal Feasibility</h1>
                            </div>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Assess project requirements against legal constraints and compliance regulations.
                            </p>
                        </div>
                    </div>

                    <Tabs defaultValue="single" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="single">Single Requirement</TabsTrigger>
                            <TabsTrigger value="batch" disabled>Batch Analysis (Coming Soon)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="single" className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Input Form */}
                                <div className="lg:col-span-5 space-y-6">
                                    <Card className="border-border/50 shadow-sm">
                                        <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-primary" />
                                                Requirement Details
                                            </CardTitle>
                                            <CardDescription>
                                                Enter the details of the requirement you want to analyze.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6 space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Requirement Title
                                                </label>
                                                <Input
                                                    placeholder="e.g. User Data Export Feature"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    Detailed Description
                                                </label>
                                                <Textarea
                                                    placeholder="Describe the technical implementation and data handled..."
                                                    className="min-h-[150px] resize-none"
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </div>
                                        </CardContent>
                                        <CardFooter className="bg-muted/10 border-t border-border/50 pt-6">
                                            <Button
                                                className="w-full gap-2 transition-all duration-200"
                                                onClick={handleCheck}
                                                disabled={isChecking || !title || !description}
                                                size="lg"
                                            >
                                                {isChecking ? (
                                                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                                                ) : (
                                                    <><Search className="h-4 w-4" /> Check Feasibility</>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>

                                {/* Results View */}
                                <div className="lg:col-span-7 space-y-6">
                                    {!result && !isChecking && (
                                        <div className="h-full min-h-[400px] rounded-xl border border-dashed border-border/60 bg-muted/20 flex flex-col items-center justify-center text-center p-8">
                                            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                                                <Gavel className="h-8 w-8 text-muted-foreground/50" />
                                            </div>
                                            <h3 className="text-lg font-medium text-muted-foreground mb-1">Awaiting Analysis</h3>
                                            <p className="text-sm text-muted-foreground/80 max-w-sm">
                                                Fill in the requirement details and run the check to see matching legal documentation and compliance status.
                                            </p>
                                        </div>
                                    )}

                                    {isChecking && (
                                        <div className="h-full min-h-[400px] rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center animate-pulse">
                                            <Loader2 className="h-10 w-10 text-primary animate-spin mb-6" />
                                            <h3 className="text-xl font-medium mb-2">Analyzing Legal Database</h3>
                                            <p className="text-muted-foreground">Searching through compliance documents, regulations, and historical rulings...</p>
                                        </div>
                                    )}

                                    {result && !isChecking && (
                                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                            <Card className="border-border/50 overflow-hidden">
                                                <div className={`h-2 w-full ${result.is_feasible ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                                                                Verdict
                                                            </CardTitle>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                {result.is_feasible ? (
                                                                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 px-3 py-1 text-sm gap-1.5 border-0">
                                                                        <CheckCircle2 className="h-4 w-4" /> Supporting Precedent Found
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 px-3 py-1 text-sm gap-1.5 border-0">
                                                                        <AlertTriangle className="h-4 w-4" /> Insufficient Legal Match
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-muted-foreground mb-1">Confidence Target</div>
                                                            <div className="text-3xl font-bold font-display text-primary">
                                                                {result.retrieved_context && result.retrieved_context.length > 0 ?
                                                                    Math.round(result.retrieved_context[0].score * 100) + '%' : '0%'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>

                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold tracking-tight">Retrieved Legal Context</h3>
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    {result.retrieved_context?.length || 0} excerpts found
                                                </Badge>
                                            </div>

                                            {result.retrieved_context && result.retrieved_context.length > 0 ? (
                                                <ScrollArea className="h-[450px] pr-4">
                                                    <div className="space-y-4">
                                                        {result.retrieved_context.map((ctx, idx) => (
                                                            <Card key={idx} className="bg-card/50 border-border/40 hover:border-primary/30 transition-colors">
                                                                <CardHeader className="py-3 px-4 bg-muted/20 border-b border-border/30">
                                                                    <div className="flex justify-between items-center text-xs">
                                                                        <div className="font-medium text-muted-foreground flex items-center gap-2">
                                                                            <span className="bg-background px-2 py-0.5 rounded border border-border/50">
                                                                                Page {ctx.page || 'N/A'}
                                                                            </span>
                                                                            {ctx.section && (
                                                                                <span className="text-foreground/70 truncate max-w-[200px]">
                                                                                    {ctx.section}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <Badge variant="secondary" className="text-[10px] font-mono">
                                                                            Score: {ctx.score.toFixed(3)}
                                                                        </Badge>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="py-4 px-5">
                                                                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap font-sans">
                                                                        {ctx.text}
                                                                    </p>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                            ) : (
                                                <Alert variant="default" className="bg-muted/30 border-dashed">
                                                    <AlertTriangle className="h-4 w-4 opacity-70" />
                                                    <AlertTitle>No specific clauses found</AlertTitle>
                                                    <AlertDescription className="text-muted-foreground">
                                                        The legal database does not contain exact matches for these requirements. Consider consulting a legal professional.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </ProtectedRoute>
    );
}
