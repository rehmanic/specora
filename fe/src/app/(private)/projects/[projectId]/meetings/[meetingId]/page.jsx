"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { 
    getMeeting, 
    transcribeMeeting, 
    extractMeetingRequirements 
} from "@/api/meetings";
import { 
    importRequirements 
} from "@/api/requirements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Video, FileText, Settings, Play, 
    ChevronLeft, Calendar, Clock, 
    Loader2, ThumbsUp, AlertCircle 
} from "lucide-react";
import PageBanner from "@/components/layout/PageBanner";
import { ExtractedRequirementsModal } from "@/components/requirements/ExtractedRequirementsModal";
import notify from "@/components/common/Notification";
import useProjectsStore from "@/store/projectsStore";

export default function MeetingReviewPage() {
    const { projectId, meetingId } = useParams();
    const router = useRouter();
    
    const { data: meeting, error, mutate, isLoading } = useSWR(
        meetingId ? `/meetings/${meetingId}` : null,
        async () => {
            const res = await getMeeting(meetingId);
            if (res?.title) {
                useProjectsStore.getState().setEntityTitle(meetingId, res.title);
            }
            return res;
        }
    );

    const [isGeneratingTranscript, setIsGeneratingTranscript] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractedModalOpen, setExtractedModalOpen] = useState(false);
    const [extractedReqs, setExtractedReqs] = useState([]);
    const [isImporting, setIsImporting] = useState(false);

    const handleGenerateTranscript = async () => {
        const toastId = "transcribe-meeting";
        setIsGeneratingTranscript(true);
        notify.loading("Generating transcript...", { id: toastId });
        try {
            await transcribeMeeting(meetingId);
            notify.success("Transcription started. It will appear here shortly.", { id: toastId });
            mutate();
        } catch (err) {
            notify.error("Failed to start transcription", { id: toastId });
        } finally {
            setIsGeneratingTranscript(false);
        }
    };

    const handleExtractRequirements = async () => {
        const toastId = "extract-reqs";
        setIsExtracting(true);
        notify.loading("Analyzing transcript...", { id: toastId });
        try {
            const response = await extractMeetingRequirements(meetingId);
            setExtractedReqs(response.data || []);
            setExtractedModalOpen(true);
            notify.success("Analysis complete!", { id: toastId });
        } catch (err) {
            notify.error("Failed to extract requirements", { id: toastId });
        } finally {
            setIsExtracting(false);
        }
    };

    const handleImportRequirements = async (requirementsToImport) => {
        const toastId = "import-reqs";
        setIsImporting(true);
        notify.loading("Importing requirements...", { id: toastId });
        try {
            await importRequirements(projectId, { requirements: requirementsToImport });
            setExtractedModalOpen(false);
            notify.success(`Imported ${requirementsToImport.length} requirements`, { id: toastId });
        } catch (err) {
            notify.error("Failed to import requirements", { id: toastId });
        } finally {
            setIsImporting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTranscript = () => {
        if (!meeting) return null;
        if (meeting.transcript) return meeting.transcript;
        if (meeting.transcripts?.length > 0) return meeting.transcripts[0].content;
        return null;
    };

    const hasTranscript = () => !!getTranscript();

    if (error) return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 mx-auto text-destructive opacity-50" />
                <p className="text-muted-foreground">Failed to load meeting details.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
    );
    
    if (isLoading || !meeting) return (
        <div className="flex items-center justify-center h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
        </div>
    );

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-2">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.back()}
                    className="rounded-full"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{meeting.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(meeting.start_time)}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {formatTime(meeting.start_time)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Media and Transcript */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="video" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="video" className="gap-2">
                                <Video className="w-4 h-4" />
                                Recording
                            </TabsTrigger>
                            <TabsTrigger value="transcript" className="gap-2">
                                <FileText className="w-4 h-4" />
                                Transcript
                            </TabsTrigger>
                        </TabsList>

                        <Card className="border-border/50 shadow-sm overflow-hidden">
                            <CardContent className="p-0">
                                <TabsContent value="video" className="m-0">
                                    {meeting.recording_url ? (
                                        <div className="bg-black aspect-video flex items-center justify-center">
                                            <video
                                                src={meeting.recording_url}
                                                controls
                                                className="w-full h-full max-h-[60vh]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/10">
                                            <Video className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="font-medium">No recording available</p>
                                            <p className="text-sm">Recording data is processed after the session concludes.</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="transcript" className="m-0">
                                    {hasTranscript() ? (
                                        <ScrollArea className="h-[500px] p-6">
                                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                                                {getTranscript().split('\n').map((line, i) => (
                                                    <p key={i} className="mb-4">{line}</p>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-muted/10">
                                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="font-medium">No transcript available</p>
                                            {meeting.recording_url && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-6 gap-2"
                                                    onClick={handleGenerateTranscript}
                                                    disabled={isGeneratingTranscript}
                                                >
                                                    {isGeneratingTranscript ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Play className="w-4 h-4" />
                                                    )}
                                                    Generate Transcript
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </TabsContent>
                            </CardContent>
                        </Card>
                    </Tabs>
                </div>

                {/* Right Column: Details and Extraction */}
                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Meeting Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
                                <p className="text-sm leading-relaxed">
                                    {meeting.description || "No description provided for this session."}
                                </p>
                            </div>
                            <div className="pt-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Status</h4>
                                <div className="flex flex-wrap gap-2">
                                    {meeting.recording_url && (
                                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20 gap-1 px-2 py-1">
                                            <Video className="w-3 h-3" />
                                            Recorded
                                        </Badge>
                                    )}
                                    {hasTranscript() && (
                                        <Badge variant="secondary" className="bg-info/10 text-info border-info/20 gap-1 px-2 py-1">
                                            <FileText className="w-3 h-3" />
                                            Transcribed
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                Requirements Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Automatically identify and extract actionable product requirements from this meeting's transcript using Specora AI.
                            </p>
                            <Button 
                                onClick={handleExtractRequirements} 
                                disabled={isExtracting || !hasTranscript()}
                                className="w-full gap-2 shadow-sm"
                            >
                                {isExtracting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Settings className="w-4 h-4" />
                                        Extract Requirements
                                    </>
                                )}
                            </Button>
                            {!hasTranscript() && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Transcript required for analysis.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ExtractedRequirementsModal
                isOpen={extractedModalOpen}
                onClose={() => setExtractedModalOpen(false)}
                requirements={extractedReqs}
                onImport={handleImportRequirements}
                isImporting={isImporting}
            />
        </div>
    );
}
