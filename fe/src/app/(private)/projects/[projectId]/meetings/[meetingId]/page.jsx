"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getMeeting, transcribeMeeting, extractMeetingRequirements } from "@/api/meetings";
import { importRequirements } from "@/api/requirements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Video,
  FileText,
  Settings,
  Play,
  Calendar,
  Clock,
  Loader2,
  ThumbsUp,
  AlertCircle,
  ListChecks,
  RotateCcw,
  Edit2,
  Check,
  X,
  Tag,
  Info,
} from "lucide-react";
import PageBanner from "@/components/layout/PageBanner";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import notify from "@/components/common/Notification";
import useProjectsStore from "@/store/projectsStore";
import { usePermission } from "@/hooks/usePermission";

export default function MeetingReviewPage() {
  const { projectId, meetingId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: meeting,
    error,
    mutate,
    isLoading,
  } = useSWR(meetingId ? `/meetings/${meetingId}` : null, async () => {
    const res = await getMeeting(meetingId);
    if (res?.title) {
      useProjectsStore.getState().setEntityTitle(meetingId, res.title);
    }
    return res;
  });

  // Permissions
  const canViewMeetingDetails = usePermission("view_meeting_details");
  const canViewRecording = usePermission("view_meeting_recording");
  const canTranscribe = usePermission("generate_meeting_transcript");
  const canExtract = usePermission("extract_requirements_from_meeting");
  const canImport = usePermission("import_requirement");

  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      // Validate tab permission
      if (tab === "recording" && !canViewRecording) return;
      if (tab === "requirements" && !canExtract) return;
      setActiveTab(tab);
    }
  }, [searchParams, canViewRecording, canExtract]);
  const [isGeneratingTranscript, setIsGeneratingTranscript] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Requirements Extraction State (Inline)
  const [extractedReqs, setExtractedReqs] = useState([]);
  const [selectedReqIds, setSelectedReqIds] = useState(new Set());
  const [editingReqId, setEditingReqId] = useState(null);
  const [editReqForm, setEditReqForm] = useState(null);
  const [confirmImportOpen, setConfirmImportOpen] = useState(false);

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
      const reqs = (response.data || []).map((req, i) => ({
        ...req,
        _tempId: `req-${i}-${Date.now()}`,
      }));
      setExtractedReqs(reqs);
      setSelectedReqIds(new Set(reqs.map((r) => r._tempId)));
      notify.success("Analysis complete!", { id: toastId });
      if (response?.cycle_time) {
        setTimeout(() => notify.success(`Requirements extracted in ${(response.cycle_time / 1000).toFixed(2)}s`), 1000);
      }
      setActiveTab("requirements");
    } catch (err) {
      notify.error("Failed to extract requirements", { id: toastId });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImportRequirements = async () => {
    if (!projectId || selectedReqIds.size === 0) return;

    const requirementsToImport = extractedReqs
      .filter((r) => selectedReqIds.has(r._tempId))
      .map(({ _tempId, ...rest }) => ({
        ...rest,
        status: "draft",
      }));

    const toastId = "import-reqs";
    setIsImporting(true);
    setConfirmImportOpen(false);
    notify.loading("Importing requirements...", { id: toastId });

    try {
      await importRequirements(projectId, { requirements: requirementsToImport });
      notify.success(`${requirementsToImport.length} requirements successfully imported!`, { id: toastId });
      // Optionally clear selection or show a result dialog
    } catch (err) {
      console.error("Failed to import requirements:", err);
      notify.error("Failed to import requirements: " + (err.message || "Unknown error"), { id: toastId });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSelectAllReqs = (checked) => {
    if (checked) {
      setSelectedReqIds(new Set(extractedReqs.map((r) => r._tempId)));
    } else {
      setSelectedReqIds(new Set());
    }
  };

  const handleToggleSelectReq = (id) => {
    const next = new Set(selectedReqIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedReqIds(next);
  };

  const startEditReq = (req) => {
    setEditingReqId(req._tempId);
    setEditReqForm({
      title: req.title,
      description: req.description,
      priority: req.priority || "mid",
      tags: req.tags ? req.tags.join(", ") : "",
    });
  };

  const saveEditReq = (id) => {
    setExtractedReqs((prev) =>
      prev.map((req) => {
        if (req._tempId === id) {
          return {
            ...req,
            title: editReqForm.title,
            description: editReqForm.description,
            priority: editReqForm.priority,
            tags: editReqForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          };
        }
        return req;
      })
    );
    setEditingReqId(null);
  };

  const cancelEditReq = () => {
    setEditingReqId(null);
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

  const getTranscriptObj = () => {
    if (!meeting) return null;
    if (meeting.transcript) return meeting.transcript;
    if (meeting.transcripts?.length > 0) return meeting.transcripts[0];
    return null;
  };

  const getTranscript = () => {
    const obj = getTranscriptObj();
    return obj ? obj.content : null;
  };

  const hasTranscript = () => !!getTranscript();

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mid":
      case "medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (error)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <AlertCircle className="text-destructive mx-auto h-12 w-12 opacity-50" />
          <p className="text-muted-foreground">Failed to load meeting details.</p>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );

  if (isLoading || !meeting)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin opacity-50" />
      </div>
    );

  if (!canViewMeetingDetails) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="max-w-md space-y-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to view meeting details. Please contact your project administrator.
          </p>
          <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/dashboard`)}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0 mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
      <PageBanner
        title={meeting.title}
        description={`Review session recording and extract structured requirements.`}
        icon={Video}
      />

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        orientation="vertical"
        className="flex w-full flex-col gap-6 md:flex-row"
      >
        {/* Sidebar Navigation */}
        <div className="flex min-w-[240px] flex-col gap-4 md:sticky md:top-24">
          <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 rounded-xl border p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <Info className="size-4" />
              Overview
            </TabsTrigger>
            {canViewRecording && (
              <TabsTrigger
                value="recording"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              >
                <Video className="size-4" />
                Recording
              </TabsTrigger>
            )}
            <TabsTrigger
              value="transcript"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <FileText className="size-4" />
              Transcript
            </TabsTrigger>
            {canExtract && (
              <TabsTrigger
                value="requirements"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              >
                <ListChecks className="size-4" />
                Extract Requirements
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Main Content Area */}
        <div className="flex w-full min-w-0 flex-1 flex-col">
          <TabsContent value="overview" className="animate-fade-in mt-0 outline-none focus-visible:ring-0">
            <Card className="h-full">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Info className="text-primary size-4" />
                  <CardTitle className="text-lg">Meeting Overview</CardTitle>
                </div>
                <CardDescription>Key details and context for this session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">Description</h4>
                  <p className="text-foreground/90 bg-muted/30 border-border/50 rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {meeting.description || "No description provided for this session."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">Session Timing</h4>
                    <div className="bg-muted/30 border-border/50 flex flex-col gap-3 rounded-xl border p-4">
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <div className="bg-background rounded-lg border p-2 shadow-sm">
                          <Calendar className="text-primary size-4" />
                        </div>
                        {formatDate(meeting.start_time)}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <div className="bg-background rounded-lg border p-2 shadow-sm">
                          <Clock className="text-primary size-4" />
                        </div>
                        {formatTime(meeting.start_time)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                      Status Indicators
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      <Badge
                        variant="outline"
                        className={`${meeting.recording_url ? "bg-success/5 text-success border-success/20" : "bg-muted/50 text-muted-foreground"} flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold`}
                      >
                        <Video className="h-3.5 w-3.5" />
                        {meeting.recording_url ? "Recording Available" : "No Recording"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${hasTranscript() ? "bg-info/5 text-info border-info/20" : "bg-muted/50 text-muted-foreground"} flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold`}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {hasTranscript() ? "Transcribed" : "Awaiting Transcription"}
                      </Badge>
                      {extractedReqs.length > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary border-primary/20 flex items-center gap-2 rounded-lg px-3 py-1.5 font-semibold"
                        >
                          <ListChecks className="h-3.5 w-3.5" />
                          Analyzed ({extractedReqs.length} Reqs)
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recording" className="animate-fade-in mt-0 outline-none focus-visible:ring-0">
            <Card className="h-full overflow-hidden">
              <CardHeader className="bg-muted/20 border-b pb-4">
                <div className="flex items-center gap-2">
                  <Video className="text-primary size-4" />
                  <CardTitle className="text-lg">Video Playback</CardTitle>
                </div>
                <CardDescription>Review the full session recording.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {meeting.recording_url ? (
                  <div className="flex aspect-video items-center justify-center bg-black">
                    <video src={meeting.recording_url} controls className="h-full max-h-[60vh] w-full shadow-2xl" />
                  </div>
                ) : (
                  <div className="text-muted-foreground bg-muted/10 flex flex-col items-center justify-center py-24 italic">
                    <Video className="mb-4 h-16 w-16 opacity-10" />
                    <p>No recording available for this session.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript" className="animate-fade-in mt-0 outline-none focus-visible:ring-0">
            <Card className="h-full">
              <CardHeader className="bg-muted/20 flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="text-primary size-4" />
                    <CardTitle className="text-lg">Transcript</CardTitle>
                    {getTranscriptObj()?.cycle_time && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 ml-2 text-[10px]">
                        Generated in {(getTranscriptObj().cycle_time / 1000).toFixed(2)}s
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Full text conversion of the meeting audio.</CardDescription>
                </div>
                {meeting.recording_url && !hasTranscript() && canTranscribe && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 font-bold"
                    onClick={handleGenerateTranscript}
                    disabled={isGeneratingTranscript}
                  >
                    {isGeneratingTranscript ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    Generate
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {hasTranscript() ? (
                  <ScrollArea className="-mx-2 h-[500px] px-2">
                    <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed text-foreground/90 max-w-none">
                      {getTranscript()
                        .split("\n")
                        .map((line, i) => (
                          <p key={i} className="mb-4">
                            {line}
                          </p>
                        ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-muted-foreground bg-muted/5 flex flex-col items-center justify-center rounded-xl border border-dashed py-24">
                    <FileText className="mb-4 h-16 w-16 opacity-10" />
                    <p className="font-medium">No transcript available.</p>
                    {!meeting.recording_url && <p className="text-xs">Provide a recording to generate a transcript.</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="animate-fade-in mt-0 outline-none focus-visible:ring-0">
            <Card className="flex min-h-[600px] flex-col overflow-hidden">
              <CardHeader className="bg-muted/20 flex flex-row items-center justify-between space-y-0 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ListChecks className="text-primary size-4" />
                    <CardTitle className="text-lg">AI Requirements Analysis</CardTitle>
                  </div>
                  <CardDescription>
                    {extractedReqs.length > 0
                      ? `AI identified ${extractedReqs.length} potential requirements. Review and import them.`
                      : "Analyze the transcript to extract structured requirements."}
                  </CardDescription>
                </div>
                <Button
                  variant={extractedReqs.length > 0 ? "outline" : "default"}
                  size="sm"
                  className="h-8 gap-2 font-bold"
                  onClick={handleExtractRequirements}
                  disabled={isExtracting || !hasTranscript()}
                >
                  {isExtracting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" />
                  )}
                  {extractedReqs.length > 0 ? "Regenerate" : "Run Analysis"}
                </Button>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col overflow-y-auto p-0">
                {extractedReqs.length > 0 ? (
                  <>
                    <div className="bg-muted/5 sticky top-0 z-10 flex items-center justify-between border-b p-4 backdrop-blur-sm">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={extractedReqs.length > 0 && selectedReqIds.size === extractedReqs.length}
                          onCheckedChange={handleSelectAllReqs}
                        />
                        <label htmlFor="select-all" className="cursor-pointer text-sm font-semibold">
                          Select All ({selectedReqIds.size} / {extractedReqs.length})
                        </label>
                      </div>
                      {canImport && (
                        <Button
                          size="sm"
                          onClick={() => setConfirmImportOpen(true)}
                          disabled={isImporting || selectedReqIds.size === 0}
                          className="font-bold shadow-sm"
                        >
                          {isImporting ? "Importing..." : "Import Selected"}
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4 p-6">
                      {extractedReqs.map((req) => {
                        const isEditing = editingReqId === req._tempId;
                        const isSelected = selectedReqIds.has(req._tempId);

                        return (
                          <div
                            key={req._tempId}
                            className={`flex items-start gap-4 rounded-xl border p-5 transition-all ${isSelected ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card hover:bg-muted/5"}`}
                          >
                            <div className="pt-1">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggleSelectReq(req._tempId)}
                              />
                            </div>

                            <div className="flex-1 space-y-2 overflow-hidden">
                              {isEditing ? (
                                <div className="bg-background space-y-4 rounded-lg border p-4">
                                  <div className="space-y-2">
                                    <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                      Title
                                    </label>
                                    <Input
                                      value={editReqForm.title}
                                      onChange={(e) => setEditReqForm((f) => ({ ...f, title: e.target.value }))}
                                      placeholder="Requirement Title"
                                      className="font-semibold"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                      Description
                                    </label>
                                    <Textarea
                                      value={editReqForm.description}
                                      onChange={(e) => setEditReqForm((f) => ({ ...f, description: e.target.value }))}
                                      placeholder="Detailed description..."
                                      rows={3}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                        Tags
                                      </label>
                                      <Input
                                        value={editReqForm.tags}
                                        onChange={(e) => setEditReqForm((f) => ({ ...f, tags: e.target.value }))}
                                        placeholder="e.g. Auth, Performance..."
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                                        Priority
                                      </label>
                                      <Select
                                        value={editReqForm.priority}
                                        onValueChange={(val) => setEditReqForm((f) => ({ ...f, priority: val }))}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="high">High</SelectItem>
                                          <SelectItem value="mid">Medium</SelectItem>
                                          <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2 pt-2">
                                    <Button size="sm" variant="ghost" onClick={cancelEditReq}>
                                      Cancel
                                    </Button>
                                    <Button size="sm" onClick={() => saveEditReq(req._tempId)}>
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <h4 className="flex items-center gap-3 text-base font-bold">
                                        {req.title}
                                        <Badge
                                          variant="outline"
                                          className={`${getPriorityColor(req.priority)} px-2 text-[10px] font-bold uppercase`}
                                        >
                                          {req.priority}
                                        </Badge>
                                      </h4>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-muted-foreground hover:bg-primary/10 hover:text-primary h-8 w-8 transition-colors"
                                      onClick={() => startEditReq(req)}
                                    >
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                                    {req.description}
                                  </p>
                                  {req.tags && req.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                      {req.tags.map((tag, i) => (
                                        <Badge
                                          key={i}
                                          variant="secondary"
                                          className="bg-muted text-muted-foreground flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium"
                                        >
                                          <Tag className="h-3 w-3" /> {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center space-y-6 py-20 text-center">
                    <div className="bg-primary/5 text-primary/30 flex h-20 w-20 items-center justify-center rounded-full">
                      <Settings className="h-10 w-10 animate-pulse" />
                    </div>
                    <div className="max-w-xs space-y-2">
                      <p className="text-lg font-bold">Analysis Ready</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {hasTranscript()
                          ? "Run the AI analysis to identify feature requirements and business logic from the transcript."
                          : "A transcript is required before running requirements extraction."}
                      </p>
                    </div>
                    {hasTranscript() && (
                      <Button
                        size="lg"
                        onClick={handleExtractRequirements}
                        disabled={isExtracting}
                        className="px-8 font-bold shadow-lg"
                      >
                        {isExtracting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Settings className="mr-2 h-4 w-4" />
                        )}
                        Start Analysis
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <ConfirmationDialog
        open={confirmImportOpen}
        onOpenChange={setConfirmImportOpen}
        onConfirm={handleImportRequirements}
        title="Confirm Import"
        description={`You are about to import ${selectedReqIds.size} requirements as drafts into this project. Do you want to proceed?`}
        confirmText="Yes, Import"
      />
    </div>
  );
}
