"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, Link2 } from "lucide-react";

export default function ScheduleMeetingModal({ isOpen, onClose, onSchedule }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stakeholders: "",
    meeting_link: "",
    scheduled_date: "",
    scheduled_time: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Combine date and time into ISO string
    const scheduledDateTime = new Date(
      `${formData.scheduled_date}T${formData.scheduled_time}`
    ).toISOString();

    const meetingData = {
      name: formData.name,
      description: formData.description,
      stakeholders: formData.stakeholders
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email),
      meeting_link: formData.meeting_link,
      scheduled_at: scheduledDateTime,
      is_completed: false,
    };

    await onSchedule(meetingData);
    
    // Reset form
    setFormData({
      name: "",
      description: "",
      stakeholders: "",
      meeting_link: "",
      scheduled_date: "",
      scheduled_time: "",
    });
    
    setIsSubmitting(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">
            Schedule New Meeting
          </AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details below to schedule a meeting and send invitations to stakeholders.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Meeting Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Meeting Name *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Sprint Planning Q1 2025"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the purpose and agenda of this meeting..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          {/* Stakeholders */}
          <div className="space-y-2">
            <Label htmlFor="stakeholders" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Stakeholder Emails *
            </Label>
            <Input
              id="stakeholders"
              name="stakeholders"
              placeholder="email1@example.com, email2@example.com"
              value={formData.stakeholders}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple emails with commas
            </p>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date *
              </Label>
              <Input
                id="scheduled_date"
                name="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time *
              </Label>
              <Input
                id="scheduled_time"
                name="scheduled_time"
                type="time"
                value={formData.scheduled_time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Meeting Link */}
          <div className="space-y-2">
            <Label htmlFor="meeting_link" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Meeting Link *
            </Label>
            <Input
              id="meeting_link"
              name="meeting_link"
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={formData.meeting_link}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Provide the video conference link (Google Meet, Zoom, Teams, etc.)
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Scheduling..." : "Schedule & Send Invites"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
