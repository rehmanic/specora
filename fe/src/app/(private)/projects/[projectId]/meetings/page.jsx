"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { getProjectMeetings, createMeeting, updateMeeting, transcribeMeeting, deleteMeeting, extractMeetingRequirements } from "@/api/meetings";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, Trash2, Pencil, Plus, Calendar, Clock, Play, FileText, X, CalendarDays } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";
import { importRequirements } from "@/api/requirements";
import { ExtractedRequirementsModal } from "@/components/requirements/ExtractedRequirementsModal";
import { Loader2, Settings } from "lucide-react";

export default function MeetingsPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const { data: meetings, error, mutate } = useSWR(
    projectId ? `/meetings/project/${projectId}` : null,
    () => getProjectMeetings(projectId)
  );

  const [isCreating, setIsCreating] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [viewingRecording, setViewingRecording] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [isGeneratingTranscript, setIsGeneratingTranscript] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedModalOpen, setExtractedModalOpen] = useState(false);
  const [extractedReqs, setExtractedReqs] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const pageSize = 5;

  const stats = {
    total: meetings?.length || 0,
    recorded: meetings?.filter(m => !!m.recording_url).length || 0,
    transcribed: meetings?.filter(m => (m.transcript || m.transcripts?.length > 0)).length || 0
  };

  // Filtered meetings
  const filteredMeetings = (meetings || []).filter(m => 
    m.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMeetings.length / pageSize);
  const paginatedMeetings = filteredMeetings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreate = async () => {
    try {
      await createMeeting({ ...formData, project_id: projectId, start_time: new Date() });
      mutate();
      setIsCreating(false);
      setFormData({ title: "", description: "" });
    } catch (err) {
      alert("Failed to create meeting");
    }
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({ title: meeting.title, description: meeting.description || "" });
  };

  const handleUpdate = async () => {
    try {
      await updateMeeting(editingMeeting.id, formData);
      mutate();
      setEditingMeeting(null);
      setFormData({ title: "", description: "" });
    } catch (err) {
      alert("Failed to update meeting");
    }
  };

  const handleJoin = (meetingId) => {
    router.push(`/projects/${projectId}/meetings/room/${meetingId}`);
  };

  const handleDelete = async (meetingId) => {
    if (confirm("Delete meeting?")) {
      await deleteMeeting(meetingId);
      mutate();
    }
  };

  const handleGenerateTranscript = async (meetingId) => {
    setIsGeneratingTranscript(true);
    try {
      const result = await transcribeMeeting(meetingId);
      // Update the viewing recording with new transcript
      if (viewingRecording && viewingRecording.id === meetingId) {
        setViewingRecording({ ...viewingRecording, transcript: result.transcript });
      }
      mutate(); // Refresh list
    } catch (err) {
      console.error("Failed to generate transcript:", err);
    } finally {
      setIsGeneratingTranscript(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
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

  // Helper to get transcript content from meeting
  const getTranscript = (meeting) => {
    if (meeting?.transcript) return meeting.transcript; // Already set from generate action
    if (meeting?.transcripts?.length > 0) return meeting.transcripts[0].content;
    return null;
  };

  const hasTranscript = (meeting) => {
    return meeting?.transcript || (meeting?.transcripts?.length > 0);
  };

  const handleExtractRequirements = async () => {
    if (!viewingRecording?.id) return;
    setIsExtracting(true);
    try {
      const response = await extractMeetingRequirements(viewingRecording.id);
      setExtractedReqs(response.data || []);
      setExtractedModalOpen(true);
    } catch (err) {
      console.error("Failed to extract:", err);
      alert("Failed to extract requirements. Ensure there is a transcript available.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImportRequirements = async (requirementsToImport) => {
    if (!projectId || !viewingRecording) return;
    setIsImporting(true);
    try {
      await importRequirements(projectId, { requirements: requirementsToImport });
      setExtractedModalOpen(false);
      alert(`Successfully imported requirements!`);
    } catch (err) {
      console.error("Failed to import requirements:", err);
      alert("Failed to import requirements: " + (err?.error || err.message || "Unknown error"));
    } finally {
      setIsImporting(false);
    }
  };

  if (error) return <div className="p-6 text-destructive">Failed to load meetings</div>;
  if (!meetings) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
        <PageBanner
          title="Meetings"
          description="Schedule, manage, and review project meetings."
          icon={CalendarDays}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <StatsCard 
            icon={Video} 
            label="Total Meetings" 
            value={stats.total} 
            color="primary" 
          />
          <StatsCard 
            icon={Play} 
            label="Recorded" 
            value={stats.recorded} 
            color="success" 
          />
          <StatsCard 
            icon={FileText} 
            label="Transcribed" 
            value={stats.transcribed} 
            color="info" 
          />
        </div>

        <SearchCreateHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search meetings by title or description..."
          buttonText="Schedule Meeting"
          onAction={() => setIsCreating(true)}
        />

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Meeting title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Button onClick={handleCreate} className="w-full">Create Meeting</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingMeeting} onOpenChange={(open) => !open && setEditingMeeting(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Meeting title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Recording Playback Dialog */}
        <Dialog open={!!viewingRecording} onOpenChange={(open) => !open && setViewingRecording(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                {viewingRecording?.title}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="video" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="video">Recording</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
              </TabsList>

              <TabsContent value="video" className="mt-4">
                {viewingRecording?.recording_url ? (
                  <div className="rounded-lg overflow-hidden bg-black aspect-video">
                    <video
                      src={viewingRecording.recording_url}
                      controls
                      className="w-full h-full"
                      autoPlay={false}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                    <Video className="w-12 h-12 mb-4 opacity-50" />
                    <p>No recording available</p>
                    <p className="text-sm mt-1">Recording becomes available after the meeting ends</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="transcript" className="mt-4">
                {getTranscript(viewingRecording) ? (
                  <ScrollArea className="h-[400px] rounded-lg border p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {getTranscript(viewingRecording).split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                    <FileText className="w-12 h-12 mb-4 opacity-50" />
                    <p>No transcript available</p>
                    {viewingRecording?.recording_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => handleGenerateTranscript(viewingRecording.id)}
                        disabled={isGeneratingTranscript}
                      >
                        {isGeneratingTranscript ? "Generating..." : "Generate Transcript"}
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="requirements" className="mt-4">
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/20 border-dashed border-2 rounded-lg">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Settings className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Extract Requirements</h3>
                  <p className="text-sm max-w-sm text-center mb-6">
                    Use AI to automatically extract product requirements from the meeting transcript. You'll be able to review and edit them before importing.
                  </p>
                  <Button 
                    onClick={handleExtractRequirements} 
                    disabled={isExtracting || !hasTranscript(viewingRecording)}
                    className="gap-2"
                  >
                    {isExtracting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Extracting...
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        Extract Requirements
                      </>
                    )}
                  </Button>
                  {!hasTranscript(viewingRecording) && (
                    <p className="text-xs text-destructive mt-3">A transcript is required to extract requirements. Please generate it first.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <span>{formatDate(viewingRecording?.start_time)} at {formatTime(viewingRecording?.start_time)}</span>
              <div className="flex gap-2">
                {viewingRecording?.recording_url && (
                  <Badge variant="secondary" className="gap-1">
                    <Video className="w-3 h-3" />
                    Recorded
                  </Badge>
                )}
                {hasTranscript(viewingRecording) && (
                  <Badge variant="secondary" className="gap-1">
                    <FileText className="w-3 h-3" />
                    Transcribed
                  </Badge>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <ExtractedRequirementsModal
          isOpen={extractedModalOpen}
          onClose={() => setExtractedModalOpen(false)}
          requirements={extractedReqs}
          onImport={handleImportRequirements}
          isImporting={isImporting}
        />

        {meetings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No meetings scheduled yet.</p>
            <p className="text-sm mt-1">Click "Schedule Meeting" to create one.</p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {meeting.description || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatDate(meeting.start_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        {formatTime(meeting.start_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {meeting.recording_url && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="w-3 h-3 mr-1" />
                            Recorded
                          </Badge>
                        )}
                        {hasTranscript(meeting) && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="w-3 h-3 mr-1" />
                            Transcript
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleJoin(meeting.id)}
                            >
                              <Video className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Join Meeting</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${meeting.recording_url ? 'text-green-600 hover:text-green-600' : ''}`}
                              onClick={() => setViewingRecording(meeting)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{meeting.recording_url ? 'View Recording' : 'View Details'}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(meeting)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(meeting.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredMeetings.length}
              pageSize={pageSize}
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
