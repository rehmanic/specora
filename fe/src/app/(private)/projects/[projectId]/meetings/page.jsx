"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import {
  getProjectMeetings,
  createMeeting,
  updateMeeting,
  transcribeMeeting,
  deleteMeeting,
  extractMeetingRequirements,
} from "@/api/meetings";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, Trash2, Pencil, Calendar, Clock, Play, FileText, CalendarDays } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import PageBanner from "@/components/layout/PageBanner";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import TablePagination from "@/components/common/TablePagination";
import StatsCard from "@/components/requirements/StatsCard";
import { Loader2 } from "lucide-react";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Label } from "@/components/ui/label";

export default function MeetingsPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const {
    data: meetings,
    error,
    mutate,
  } = useSWR(projectId ? `/meetings/project/${projectId}` : null, () => getProjectMeetings(projectId));

  const [isCreating, setIsCreating] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduled_date: new Date().toISOString().split("T")[0],
    scheduled_time: "10:00",
  });
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const stats = {
    total: meetings?.length || 0,
    recorded: meetings?.filter((m) => !!m.recording_url).length || 0,
    transcribed: meetings?.filter((m) => m.transcript || m.transcripts?.length > 0).length || 0,
  };

  // Filtered meetings
  const filteredMeetings = (meetings || []).filter(
    (m) =>
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMeetings.length / pageSize);
  const paginatedMeetings = filteredMeetings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const handleCreate = async () => {
    try {
      const startTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      await createMeeting({
        title: formData.title,
        description: formData.description,
        start_time: startTime,
        project_id: projectId,
      });
      mutate();
      setIsCreating(false);
      setFormData({
        title: "",
        description: "",
        scheduled_date: new Date().toISOString().split("T")[0],
        scheduled_time: "10:00",
      });
    } catch (err) {
      alert("Failed to create meeting");
    }
  };

  const handleEdit = (meeting) => {
    const d = new Date(meeting.start_time);
    // Pad local components
    const pad = (n) => n.toString().padStart(2, "0");
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description || "",
      scheduled_date: dateStr,
      scheduled_time: timeStr,
    });
  };

  const handleUpdate = async () => {
    try {
      const startTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`).toISOString();
      await updateMeeting(editingMeeting.id, {
        title: formData.title,
        description: formData.description,
        start_time: startTime,
      });
      mutate();
      setEditingMeeting(null);
      setFormData({
        title: "",
        description: "",
        scheduled_date: new Date().toISOString().split("T")[0],
        scheduled_time: "10:00",
      });
    } catch (err) {
      alert("Failed to update meeting");
    }
  };

  const handleJoin = (meetingId) => {
    router.push(`/projects/${projectId}/meetings/room/${meetingId}`);
  };

  const handleDelete = (meetingId) => {
    setMeetingToDelete(meetingId);
  };

  const confirmDelete = async () => {
    if (!meetingToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMeeting(meetingToDelete);
      mutate();
      setMeetingToDelete(null);
    } catch (err) {
      console.error("Failed to delete meeting:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const z = d.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(d - z);
    return localDate.toISOString().slice(0, 16);
  };

  const handleViewDetails = (meetingId) => {
    router.push(`/projects/${projectId}/meetings/${meetingId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const hasTranscript = (meeting) => {
    if (!meeting) return false;
    return !!(meeting.transcript || (meeting.transcripts && meeting.transcripts.length > 0));
  };

  if (error) return <div className="text-destructive p-6">Failed to load meetings</div>;
  if (!meetings) return <div className="text-muted-foreground p-6">Loading...</div>;

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
        <PageBanner title="Meetings" description="Schedule, manage, and review project meetings." icon={CalendarDays} />

        <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-3" style={{ animationDelay: "0.1s" }}>
          <StatsCard icon={Video} label="Total Meetings" value={stats.total} color="primary" />
          <StatsCard icon={Play} label="Recorded" value={stats.recorded} color="success" />
          <StatsCard icon={FileText} label="Transcribed" value={stats.transcribed} color="info" />
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
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Meeting Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekly Sync"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Scheduled Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.scheduled_date || ""}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    Scheduled Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.scheduled_time || ""}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this meeting about?"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={!formData.title || !formData.start_time}>
                Create Meeting
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingMeeting} onOpenChange={(open) => !open && setEditingMeeting(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="edit-title">
                  Meeting Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-title"
                  placeholder="Meeting title"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">
                    Scheduled Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={formData.scheduled_date || ""}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">
                    Scheduled Time <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={formData.scheduled_time || ""}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Description (optional)"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <Button
                onClick={handleUpdate}
                className="w-full"
                disabled={!formData.title || !formData.scheduled_date || !formData.scheduled_time}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {meetings.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>No meetings scheduled yet.</p>
            <p className="mt-1 text-sm">Click "Schedule Meeting" to create one.</p>
          </div>
        ) : (
          <div className="rounded-lg border">
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
                        <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                        {formatDate(meeting.start_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Clock className="text-muted-foreground h-3.5 w-3.5" />
                        {formatTime(meeting.start_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {meeting.recording_url && (
                          <Badge variant="outline" className="text-xs">
                            <Video className="mr-1 h-3 w-3" />
                            Recorded
                          </Badge>
                        )}
                        {hasTranscript(meeting) && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="mr-1 h-3 w-3" />
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
                              <Video className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Join Meeting</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${meeting.recording_url ? "text-green-600 hover:text-green-600" : ""}`}
                              onClick={() => handleViewDetails(meeting.id)}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{meeting.recording_url ? "View Recording" : "View Details"}</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(meeting)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-8 w-8"
                              onClick={() => handleDelete(meeting.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

      <ConfirmationDialog
        open={!!meetingToDelete}
        onOpenChange={(open) => !open && setMeetingToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Meeting"
        description="Are you sure you want to delete this meeting? This action is permanent and will remove all recordings and transcripts associated with it."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        loading={isDeleting}
      />
    </TooltipProvider>
  );
}
