"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import useProjectsStore from "@/store/projectsStore";
import useAuthStore from "@/store/authStore";
import { deleteProject, updateProject, createProject } from "@/api/projects";
import { getSingleUserDataRequest, getUsersByIds } from "@/api/users";
import { useRouter } from "next/navigation";
import ErrorBox from "@/components/common/ErrorBox";
import SuccessBox from "@/components/common/SuccessBox";

// ✅ Safe avatar URL generator using DiceBear (trusted, open source)
const getAvatarUrl = (name) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
    name
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export default function ProjectInfo({ variant }) {
  const isSettings = variant === "project-settings";
  const { selectedProject, clearSelectedProject, setSelectedProject } = useProjectsStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [coverPreview, setCoverPreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
  const [memberError, setMemberError] = useState(null);

  // Clear errors when variant changes
  useEffect(() => {
    setSaveError(null);
    setDeleteError(null);
    setMemberError(null);
  }, [variant]);

  // Prefill form from selectedProject when in settings mode
  useEffect(() => {
    const prefillProject = async () => {
      if (isSettings && selectedProject) {
        // Fetch member details if members are just IDs
        let members = [];
        if (
          Array.isArray(selectedProject.members) &&
          selectedProject.members.length > 0
        ) {
          // Check if members are objects or just IDs
          if (typeof selectedProject.members[0] === "string") {
            // Members are IDs, fetch their details
            const memberDetails = await getUsersByIds(selectedProject.members);
            members = memberDetails.map((member) => ({
              id: member.id,
              name: member.name || member.username || "",
              email: member.email || "",
              role: "Member",
            }));
          } else {
            // Members are already objects
            members = selectedProject.members;
          }
        }

        setProject({
          id: selectedProject.id,
          name: selectedProject.name || "",
          description: selectedProject.description || "",
          status: selectedProject.status || "active",
          startDate: selectedProject.start_date
            ? new Date(selectedProject.start_date).toISOString().split("T")[0]
            : "",
          endDate: selectedProject.end_date
            ? new Date(selectedProject.end_date).toISOString().split("T")[0]
            : "",
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
            name: user.name || user.username || "You",
            email: user.email || "",
            role: "Project Owner",
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
      }
    };

    prefillProject();
  }, [isSettings, selectedProject, user]);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleProjectUpdate = (field, value) => {
    setProject((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts editing
    if (saveError) {
      setSaveError(null);
    }
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
      setSaveError("Each tag must be between 3 and 30 characters");
      return;
    }
    
    // Check max tags (10)
    if (project.tags.length >= 10) {
      setSaveError("A maximum of 10 tags is allowed");
      return;
    }
    
    if (trimmedTag && !project.tags.includes(trimmedTag)) {
      setProject((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
      setNewTag("");
      setSaveError(null);
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
      Members: prev.Members.filter((m) => m.id !== id),
    }));

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setMemberError("Please enter a username");
      return;
    }

    // Check if member already exists
    if (project.Members.some((m) => m.email === newMemberEmail.trim())) {
      setMemberError("This user is already a member of the project");
      return;
    }

    setIsAddingMember(true);
    setMemberError(null);

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
        role: "Member",
      };

      setProject((prev) => ({
        ...prev,
        Members: [...prev.Members, newMember],
      }));

      setNewMemberEmail("");
      setMemberError(null);
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = "Failed to add member.";
      
      if (err?.message) {
        // Check for specific error messages and provide clearer feedback
        const errorMsgLower = err.message.toLowerCase();
        if (errorMsgLower.includes("user not found") || 
            errorMsgLower.includes("fetching user details failed") ||
            errorMsgLower.includes("404")) {
          errorMessage = `User "${newMemberEmail.trim()}" not found. Please check the username and try again.`;
        } else {
          errorMessage = err.message;
        }
      }
      
      setMemberError(errorMessage);
      // Suppress console error since we're handling it in the UI
      // The error is already caught and displayed to the user
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!selectedProject?.id) {
      setDeleteError("Project ID not found");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteProject(selectedProject.id);

      // Clear the selected project and refresh the projects list
      clearSelectedProject();

      // Redirect to dashboard page
      router.push("/dashboard");
    } catch (err) {
      const errorMessage =
        err?.message || "Failed to delete project";
      setDeleteError(errorMessage);
      console.error("Error deleting project:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveChanges = async () => {
    if (isSettings && !selectedProject?.id) {
      setSaveError("Project ID not found");
      return;
    }

    // Validate required fields
    if (!project.name.trim()) {
      setSaveError("Project name is required");
      return;
    }

    if (project.name.trim().length < 3 || project.name.trim().length > 100) {
      setSaveError("Project name must be between 3 and 100 characters");
      return;
    }

    if (!/^[A-Za-z0-9 _-]+$/.test(project.name.trim())) {
      setSaveError(
        "Project name can only contain letters, numbers, spaces, hyphens, and underscores"
      );
      return;
    }

    if (!project.startDate) {
      setSaveError("Start date is required");
      return;
    }

    if (!project.endDate) {
      setSaveError("End date is required");
      return;
    }

    // Validate date range
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    if (startDate > endDate) {
      setSaveError("Start date cannot be later than end date");
      return;
    }

    // Validate description if provided
    if (project.description && project.description.trim()) {
      if (project.description.trim().length < 5) {
        setSaveError("Description must be at least 5 characters");
        return;
      }
      if (project.description.trim().length > 1000) {
        setSaveError("Description must not exceed 1000 characters");
        return;
      }
    }

    // Validate status
    const validStatuses = ["active", "on_hold", "completed", "archived"];
    if (project.status && !validStatuses.includes(project.status)) {
      setSaveError("Invalid status value");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Prepare the data with API field names
      const projectData = {
        name: project.name,
        description: project.description,
        status: project.status,
        start_date: project.startDate || null,
        end_date: project.endDate || null,
        tags: project.tags,
        members: project.Members.map((m) => m.id), // Send member IDs
      };

      if (isSettings) {
        // Update existing project
        const response = await updateProject(selectedProject.id, projectData);
        // Update the selected project in store with the latest data
        const updatedProject = response?.project || response;
        if (updatedProject) {
          setSelectedProject(updatedProject);
        }
        setSaveSuccess(true);
      } else {
        // Create new project with created_by
        if (!user?.id) {
          setSaveError("User information not available");
          setIsSaving(false);
          return;
        }

        const createData = {
          ...projectData,
          created_by: user.id,
        };

        const newProject = await createProject(createData);
        setSaveSuccess(true);

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

        // Refresh the projects list and redirect

        // Redirect to dashboard after showing success message
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);

        return;
      }
    } catch (err) {
      const errorMessage =
        err?.message || "Failed to save project";
      setSaveError(errorMessage);
      console.error("Error saving project:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {isSettings ? "Project Settings" : "Create New Project"}
        </h1>
        <p className="text-muted-foreground">
          {isSettings
            ? "Manage your project details, members, and configurations"
            : "Set up a new project by providing the necessary information"}
        </p>
      </div>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your project's basic details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="project-name">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="project-name"
                value={project.name}
                onChange={(e) => handleProjectUpdate("name", e.target.value)}
                required
                minLength={3}
                maxLength={100}
                pattern="^[A-Za-z0-9 _-]{3,100}$"
                title="Project name must be 3-100 characters and contain only letters, numbers, spaces, hyphens, and underscores"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={project.status}
                onValueChange={(value) => handleProjectUpdate("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={project.description}
              onChange={(e) =>
                handleProjectUpdate("description", e.target.value)
              }
              rows={4}
              minLength={5}
              maxLength={1000}
              title="Description must be between 5 and 1000 characters (if provided)"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="start-date">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="start-date"
                type="date"
                value={project.startDate}
                onChange={(e) =>
                  handleProjectUpdate("startDate", e.target.value)
                }
                required
                max={project.endDate || undefined}
                title="Start date is required and must be before or equal to end date"
              />
            </div>
            <div>
              <Label htmlFor="end-date">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="end-date"
                type="date"
                value={project.endDate}
                onChange={(e) => handleProjectUpdate("endDate", e.target.value)}
                required
                min={project.startDate || undefined}
                title="End date is required and must be after or equal to start date"
              />
            </div>
          </div>

          {/* Cover image */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="profilePic">Cover Image</Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Preview"
                className="mt-2 h-40 w-full rounded-md object-cover border"
              />
            )}
          </div>

          {/* Icon */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="profilePic">Icon</Label>
            <Input
              id="icon"
              type="file"
              accept="image/*"
              onChange={handleIconChange}
            />
            {iconPreview && (
              <img
                src={iconPreview}
                alt="Preview"
                className="mt-2 h-16 w-16 rounded-full object-cover border"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members - Only visible to managers */}
      {user?.role === "manager" && (
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>Manage who has access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {memberError && <ErrorBox message={memberError} />}

            {project.Members.map((member, index) => (
              <div
                key={member.id || member.email || index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={getAvatarUrl(member.name || member.email || "user")}
                      alt={member.name || member.email}
                    />
                    <AvatarFallback>
                      {(member.name || member.email || "U")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.name || member.email || "Unknown"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.email || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{member.role}</Badge>
                  {member.role !== "Project Owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter username to add"
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value);
                  setMemberError(null);
                }}
                className="flex-1"
              />
              <Button onClick={handleAddMember} disabled={isAddingMember}>
                {isAddingMember ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags & Categories - Only visible to managers */}
      {user?.role === "manager" && (
        <Card>
          <CardHeader>
            <CardTitle>Tags & Categories</CardTitle>
            <CardDescription>Organize your project with tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Add a tag (3-30 characters)"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setSaveError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="flex-1"
                minLength={3}
                maxLength={30}
                disabled={project.tags.length >= 10}
                title={
                  project.tags.length >= 10
                    ? "Maximum of 10 tags allowed"
                    : "Each tag must be between 3 and 30 characters"
                }
              />
              <Button onClick={addTag} disabled={project.tags.length >= 10}>
                Add Tag
              </Button>
            </div>
            {project.tags.length >= 10 && (
              <p className="text-sm text-muted-foreground">
                Maximum of 10 tags reached
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      {isSettings && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {deleteError && <ErrorBox message={deleteError} />}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Delete Project</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete this project and all its data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Project</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the project "{selectedProject?.name}" and all its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteProject}
                      disabled={isDeleting}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Actions */}
      <div className="space-y-4">
        {saveError && <ErrorBox message={saveError} />}
        {saveSuccess && (
          <SuccessBox
            message={
              isSettings
                ? "Project updated successfully!"
                : "Project created successfully! Redirecting..."
            }
          />
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          {/* {isSettings && <Button variant="outline">Cancel</Button>} */}
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving
              ? isSettings
                ? "Saving..."
                : "Creating..."
              : isSettings
              ? "Save Changes"
              : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
