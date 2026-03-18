"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, Tags, Trash2, Plus, X, Calendar, Layers, ShieldAlert, Layout, UserPlus } from "lucide-react";
import useProjectsStore from "@/store/projectsStore";
import useAuthStore from "@/store/authStore";
import { deleteProject, updateProject, createProject } from "@/api/projects";
import { getSingleUserDataRequest, getUsersByIds } from "@/api/users";
import { uploadFileRequest } from "@/api/upload";
import notify from "@/components/common/Notification";
import PageBanner from "@/components/layout/PageBanner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// ✅ Safe avatar URL generator using DiceBear (trusted, open source)
const getAvatarUrl = (name) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export default function ProjectInfo({ variant }) {
  const isSettings = variant === "project-settings";
  const { selectedProject, clearSelectedProject, setSelectedProject, fetchProjects } = useProjectsStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [coverPreview, setCoverPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [project, setProject] = useState({
    id: "",
    name: "",
    description: "",
    status: "active",
    startDate: "",
    endDate: "",
    tags: [],
    coverImageUrl: null,
    iconUrl: null,
    notifications: {
      email: true,
      slack: true,
      updates: false,
    },
    Members: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Prefill form from selectedProject when in settings mode
  useEffect(() => {
    const prefillProject = async () => {
      if (isSettings && selectedProject) {
        // Fetch member details if members are just IDs
        let members = [];
        if (Array.isArray(selectedProject.members) && selectedProject.members.length > 0) {
          // Check if members are objects or just IDs
          if (typeof selectedProject.members[0] === "string") {
            // Members are IDs, fetch their details
            const memberDetails = await getUsersByIds(selectedProject.members);
            members = memberDetails.map((member) => ({
              id: member.id,
              name: member.display_name || member.name || member.username || "",
              email: member.email || "",
              role: member.role || "Member",
              isOwner: member.id === selectedProject.created_by,
              profile_pic_url: member.profile_pic_url || null,
            }));
          } else {
            // Members are already objects
            members = selectedProject.members.map((m) => ({
              ...m,
              isOwner: m.id === selectedProject.created_by,
            }));
          }
        }

        // Ensure owner is always in members list (fallback)
        const ownerId = selectedProject.created_by;
        const hasOwner = members.some((m) => m.id === ownerId);

        if (!hasOwner && selectedProject.creator) {
          members.unshift({
            id: selectedProject.creator.id,
            name: selectedProject.creator.display_name || selectedProject.creator.username || "Project Owner",
            email: "",
            role: "Manager",
            isOwner: true,
            profile_pic_url: selectedProject.creator.profile_pic_url || null,
          });
        }

        setProject({
          id: selectedProject.id,
          name: selectedProject.name || "",
          description: selectedProject.description || "",
          status: selectedProject.status || "active",
          startDate: selectedProject.start_date ? new Date(selectedProject.start_date).toISOString().split("T")[0] : "",
          endDate: selectedProject.end_date ? new Date(selectedProject.end_date).toISOString().split("T")[0] : "",
          tags: Array.isArray(selectedProject.tags) ? selectedProject.tags : [],
          coverImageUrl: selectedProject.cover_image_url || null,
          iconUrl: selectedProject.icon_url || null,
          notifications: {
            email: true,
            slack: true,
            updates: false,
          },
          Members: members,
        });

        // Set preview images from URLs
        if (selectedProject.cover_image_url) {
          setCoverPreview(selectedProject.cover_image_url);
        }
        if (selectedProject.icon_url) {
          setIconPreview(selectedProject.icon_url);
        }
      } else {
        // For new projects, add current user as a member
        const initialMembers = [];
        if (user?.id) {
          initialMembers.push({
            id: user.id,
            name: user.display_name || user.name || user.username || "You",
            email: user.email || "",
            role: user.role || "Manager",
            isOwner: true,
            profile_pic_url: user.profile_pic_url || null,
          });
        }

        setProject({
          id: "",
          name: "",
          description: "",
          status: "active",
          startDate: "",
          endDate: "",
          tags: [],
          coverImageUrl: null,
          iconUrl: null,
          notifications: {
            email: true,
            slack: true,
            updates: false,
          },
          Members: initialMembers,
        });
        setCoverPreview(null);
        setIconPreview(null);
        setCoverFile(null);
        setIconFile(null);
      }
    };

    prefillProject();
  }, [isSettings, selectedProject, user]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };
  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleProjectUpdate = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (key) => {
    setProject((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }));
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();

    // Validate tag length (3-30 characters)
    if (trimmedTag.length < 3 || trimmedTag.length > 30) {
      notify.error("Each tag must be between 3 and 30 characters");
      return;
    }

    // Check max tags (10)
    if (project.tags.length >= 10) {
      notify.error("A maximum of 10 tags is allowed");
      return;
    }

    if (trimmedTag && !project.tags.includes(trimmedTag)) {
      setProject((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) =>
    setProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));

  const removeMember = (id) =>
    setProject((prev) => ({
      ...prev,
      Members: prev.Members.filter((m) => m.isOwner || m.id !== id),
    }));

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      notify.error("Please enter a username");
      return;
    }

    // Check if member already exists
    if (project.Members.some((m) => m.email === newMemberEmail.trim())) {
      notify.error("This user is already a member of the project");
      return;
    }

    setIsAddingMember(true);

    try {
      // Fetch user details by username
      const response = await getSingleUserDataRequest(newMemberEmail.trim());
      // API returns { user: {...}, message: "..." }
      const userData = response?.user || response?.data || response;

      // Validate user data exists
      if (!userData || !userData.id) {
        throw new Error(`User "${newMemberEmail.trim()}" not found. Please check the username and try again.`);
      }

      // Add the member to the project
      const newMember = {
        id: userData.id,
        name: userData.display_name || userData.name || userData.username || newMemberEmail,
        email: userData.email || newMemberEmail,
        role: userData.role || "Member",
        isOwner: false,
        profile_pic_url: userData.profile_pic_url || null,
      };

      setProject((prev) => ({
        ...prev,
        Members: [...prev.Members, newMember],
      }));

      setNewMemberEmail("");
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = "Failed to add member.";

      if (err?.message) {
        // Check for specific error messages and provide clearer feedback
        const errorMsgLower = err.message.toLowerCase();
        if (
          errorMsgLower.includes("user not found") ||
          errorMsgLower.includes("fetching user details failed") ||
          errorMsgLower.includes("404")
        ) {
          errorMessage = `User "${newMemberEmail.trim()}" not found. Please check the username and try again.`;
        } else {
          errorMessage = err.message;
        }
      }

      notify.error(errorMessage);
      // Suppress console error since we're handling it in the UI
      // The error is already caught and displayed to the user
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject?.id) {
      notify.error("Project ID not found");
      return;
    }

    setIsDeleting(true);

    try {
      await deleteProject(selectedProject.id);

      // Clear the selected project and refresh the projects list
      clearSelectedProject();

      // Redirect to dashboard page
      router.push("/dashboard");
      notify.success("Project deleted successfully");
    } catch (err) {
      const errorMessage = err?.message || "Failed to delete project";
      notify.error(errorMessage);
      console.error("Error deleting project:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveChanges = async () => {
    if (isSettings && !selectedProject?.id) {
      notify.error("Project ID not found");
      return;
    }

    // Validate required fields
    if (!project.name.trim()) {
      notify.error("Project name is required");
      return;
    }

    if (project.name.trim().length < 3 || project.name.trim().length > 100) {
      notify.error("Project name must be between 3 and 100 characters");
      return;
    }

    if (!/^[A-Za-z0-9 _-]+$/.test(project.name.trim())) {
      notify.error("Project name can only contain letters, numbers, spaces, hyphens, and underscores");
      return;
    }

    if (!project.startDate) {
      notify.error("Start date is required");
      return;
    }

    if (!project.endDate) {
      notify.error("End date is required");
      return;
    }

    // Validate date range
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    if (startDate > endDate) {
      notify.error("Start date cannot be later than end date");
      return;
    }

    // Validate description if provided
    if (project.description && project.description.trim()) {
      if (project.description.trim().length < 5) {
        notify.error("Description must be at least 5 characters");
        return;
      }
      if (project.description.trim().length > 1000) {
        notify.error("Description must not exceed 1000 characters");
        return;
      }
    }

    // Validate status
    const validStatuses = ["active", "on_hold", "completed", "archived"];
    if (project.status && !validStatuses.includes(project.status)) {
      notify.error("Invalid status value");
      return;
    }

    setIsSaving(true);
    const toastId = notify.loading(isSettings ? "Saving changes..." : "Creating project...");

    try {
      // Upload files if they exist
      let iconUrl = project.iconUrl;
      let coverImageUrl = project.coverImageUrl;

      if (iconFile) {
        try {
          iconUrl = await uploadFileRequest(iconFile);
        } catch (uploadErr) {
          throw new Error(`Failed to upload icon: ${uploadErr.message}`);
        }
      }

      if (coverFile) {
        try {
          coverImageUrl = await uploadFileRequest(coverFile);
        } catch (uploadErr) {
          throw new Error(`Failed to upload cover image: ${uploadErr.message}`);
        }
      }

      // Prepare the data with API field names
      const projectData = {
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.startDate || null,
        end_date: project.endDate || null,
        tags: project.tags,
        members: project.Members.map((m) => m.id), // Send member IDs
        icon_url: iconUrl,
        cover_image_url: coverImageUrl,
      };

      if (isSettings) {
        // Update existing project
        const response = await updateProject(selectedProject.id, projectData);
        const updatedProject = response?.project || response;
        if (updatedProject) {
          setSelectedProject(updatedProject);
          fetchProjects();
        }
        notify.success("Project updated successfully", { id: toastId });
      } else {
        // Create new project with created_by
        if (!user?.id) {
          notify.error("User information not available", { id: toastId });
          setIsSaving(false);
          return;
        }

        const createData = {
          ...projectData,
          created_by: user.id,
        };

        const newProject = await createProject(createData);
        notify.success("Project created successfully", { id: toastId });

        // Reset form after successful creation
        setProject({
          id: "",
          name: "",
          description: "",
          status: "active",
          startDate: "",
          endDate: "",
          tags: [],
          coverImageUrl: null,
          iconUrl: null,
          notifications: {
            email: true,
            slack: true,
            updates: false,
          },
          Members: [],
        });
        setIconFile(null);
        setCoverFile(null);

        // Refresh the projects list and redirect
        fetchProjects();

        // Redirect to dashboard after showing success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

        return;
      }
    } catch (err) {
      setIsSaving(false);
      const errorMessage = err?.message || "Failed to save project";
      const isDuplicateError = errorMessage.toLowerCase().includes("already exists");

      // Handle known errors elegantly
      if (isDuplicateError) {
        notify.error("A project with this name already exists. Please choose a different title.", { id: toastId });
      } else {
        notify.error(errorMessage, { id: toastId });
        // Only log unexpected errors
        console.error("Critical project save error:", err);
      }

      // Explicitly return to ensure no further local-level execution if there was any
      return;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
      {/* Page Header */}
      <PageBanner
        title={isSettings ? "Project Settings" : "Create New Project"}
        description={
          isSettings
            ? "Configure project parameters, team members, and visibility."
            : "Define the core attributes and goals for your new venture."
        }
        icon={isSettings ? Settings : Plus}
      />

      <Tabs defaultValue="general" orientation="vertical" className="flex w-full flex-col gap-6 md:flex-row">
        <div className="flex min-w-[240px] flex-col gap-4 md:sticky md:top-24">
          <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 rounded-xl border p-1">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <Settings className="size-4" />
              General Info
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <Users className="size-4" />
              Team Members
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <Tags className="size-4" />
              Tags & Categories
            </TabsTrigger>
            {isSettings && (
              <TabsTrigger
                value="danger"
                className="text-destructive data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
              >
                <Trash2 className="size-4" />
                Danger Zone
              </TabsTrigger>
            )}
          </TabsList>

          <div className="space-y-3 px-1">
            <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full text-xs font-bold">
              {isSaving ? "Processing..." : isSettings ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col">
          {/* General Tab */}
          <TabsContent value="general" className="animate-fade-in mt-0 space-y-6 outline-none">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Layout className="text-primary size-4" />
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </div>
                <CardDescription>Core identity and operational parameters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="p-name" className="text-xs font-bold">
                      Project Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="p-name"
                      placeholder="e.g. Apollo Mission"
                      value={project.name}
                      onChange={(e) => handleProjectUpdate("name", e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-status" className="text-xs font-bold">
                      Current Status
                    </Label>
                    <Select value={project.status} onValueChange={(v) => handleProjectUpdate("status", v)}>
                      <SelectTrigger id="p-status" className="h-10 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["active", "on_hold", "completed", "archived"].map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="p-desc" className="text-xs font-bold">
                    Brief Description
                  </Label>
                  <Textarea
                    id="p-desc"
                    placeholder="What is this project about?"
                    value={project.description}
                    onChange={(e) => handleProjectUpdate("description", e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="p-start" className="text-xs font-bold">
                      Start Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="p-start"
                        type="date"
                        value={project.startDate}
                        onChange={(e) => handleProjectUpdate("startDate", e.target.value)}
                        className="h-10 pl-10"
                      />
                      <Calendar className="text-muted-foreground absolute top-3 left-3 size-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="p-end" className="text-xs font-bold">
                      End Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="p-end"
                        type="date"
                        value={project.endDate}
                        onChange={(e) => handleProjectUpdate("endDate", e.target.value)}
                        className="h-10 pl-10"
                      />
                      <Calendar className="text-muted-foreground absolute top-3 left-3 size-4" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold">Branding Icon</Label>
                    <div className="bg-muted/20 flex items-center gap-4 rounded-lg border p-3">
                      <div className="bg-background flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border">
                        {iconPreview ? (
                          <img src={iconPreview} className="size-full object-cover" alt="Icon" />
                        ) : (
                          <Layout className="text-muted-foreground/50 size-6" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 overflow-hidden">
                        <Input
                          type="file"
                          onChange={handleIconChange}
                          className="h-8 w-full cursor-pointer px-2 py-1 text-[11px]"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold">Cover Banner</Label>
                    <label
                      htmlFor="cover-upload"
                      className="group bg-muted/20 hover:bg-muted/30 relative block flex h-24 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors"
                    >
                      {coverPreview ? (
                        <img src={coverPreview} className="size-full object-cover" alt="Cover" />
                      ) : (
                        <p className="text-muted-foreground text-[10px] font-medium">Click to upload cover</p>
                      )}
                      <input
                        id="cover-upload"
                        type="file"
                        onChange={handleCoverImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="animate-fade-in mt-0 space-y-6 outline-none">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Users className="text-primary size-4" />
                  <CardTitle className="text-lg">Collaborators</CardTitle>
                </div>
                <CardDescription>Manage who can access and edit this project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/20 flex items-center gap-2 rounded-lg border p-1.5">
                  <UserPlus className="text-muted-foreground ml-2 size-4" />
                  <Input
                    placeholder="Search by username..."
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                    className="h-9 border-none bg-transparent text-sm shadow-none focus-visible:ring-0"
                  />
                  <Button
                    onClick={handleAddMember}
                    disabled={isAddingMember}
                    size="sm"
                    className="h-8 px-3 text-xs font-bold"
                  >
                    {isAddingMember ? "..." : "Add User"}
                  </Button>
                </div>

                <div className="custom-scrollbar max-h-[400px] space-y-2 overflow-y-auto pr-2">
                  {project.Members.length > 0 ? (
                    project.Members.map((member) => (
                      <div
                        key={member.id}
                        className="bg-background hover:bg-muted/5 flex items-center justify-between rounded-lg border p-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border">
                            <AvatarImage src={member.profile_pic_url || getAvatarUrl(member.name || "user")} />
                            <AvatarFallback>{(member.name || "U")[0]}</AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <p className="mb-1 truncate text-sm leading-none font-semibold">{member.name}</p>
                            <p className="text-muted-foreground truncate text-[11px]">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={cn(
                              "h-5 px-1.5 text-[10px] font-bold tracking-wider uppercase",
                              member.isOwner && "bg-primary/20 text-primary border-primary/30"
                            )}
                          >
                            {member.isOwner
                              ? `Project Owner (${member.role?.replace(/_/g, " ") || "Manager"})`
                              : member.role?.replace(/_/g, " ") || "Member"}
                          </Badge>
                          {!member.isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMember(member.id)}
                              className="text-muted-foreground hover:text-destructive size-7"
                            >
                              <X className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted-foreground/50 py-12 text-center italic">
                      No members assigned to this project.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="animate-fade-in mt-0 space-y-6 outline-none">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Tags className="text-primary size-4" />
                  <CardTitle className="text-lg">Classification</CardTitle>
                </div>
                <CardDescription>Use tags to categorize and organize your project.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/5 flex min-h-[100px] flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4">
                  {project.tags.length > 0 ? (
                    project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="hover-lift gap-2 rounded-lg py-1 pr-1 pl-3 text-xs font-semibold"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:bg-destructive rounded-full p-0.5 transition-all hover:text-white"
                        >
                          <X className="size-3" />
                        </button>
                      </Badge>
                    ))
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-2 opacity-30">
                      <Layers className="size-8" />
                      <p className="text-xs font-bold tracking-widest uppercase">No Tags Defined</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="Add a new keyword..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                    className="h-10 text-sm"
                    disabled={project.tags.length >= 10}
                  />
                  <Button
                    onClick={addTag}
                    disabled={project.tags.length >= 10}
                    size="sm"
                    className="h-10 px-6 font-bold"
                  >
                    Add Tag
                  </Button>
                </div>
                {project.tags.length >= 10 && (
                  <p className="text-muted-foreground text-center text-[11px] italic">Limit of 10 tags reached.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Tab */}
          <TabsContent value="danger" className="animate-fade-in mt-0 space-y-6 outline-none">
            <Card className="border-destructive/20">
              <CardHeader className="pb-4">
                <div className="text-destructive flex items-center gap-2">
                  <Trash2 className="size-4" />
                  <CardTitle className="text-lg">Destructive Actions</CardTitle>
                </div>
                <CardDescription>Irreversible operations that destroy project data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-destructive/10 bg-destructive/5 flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-destructive text-sm font-bold">Delete Project</p>
                    <p className="text-muted-foreground text-xs">All data will be permanently wiped from the server.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="font-bold">
                        Erase Project
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          Deleting <strong>{project.name}</strong> is final and cannot be undone. All requirements,
                          designs, and metadata will be purged.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel disabled={isDeleting} className="h-10 rounded-lg border-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteProject}
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90 h-10 rounded-lg font-bold text-white"
                        >
                          {isDeleting ? "Wiping..." : "Yes, Purge Project"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

const Separator = ({ className }) => <div className={cn("bg-border h-px w-full", className)} />;
