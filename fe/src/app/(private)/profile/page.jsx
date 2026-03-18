"use client";

import { useRef, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import useAuthStore from "@/store/authStore";
import { updateUserRequest } from "@/api/users";
import { uploadFileRequest } from "@/api/upload";
import { notify } from "@/components/common/Notification";
import { User, Mail, Shield, KeyRound, Camera, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user?.profile_pic_url) {
      setPreview(user.profile_pic_url);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = (e) => {
    e.stopPropagation();
    setProfilePic(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    let userData = {
      display_name: data.get("displayname"),
      email: data.get("email"),
    };

    const updatePromise = async () => {
      if (profilePic) {
        // Upload the image first
        const uploadedUrl = await uploadFileRequest(profilePic);
        if (uploadedUrl) {
          userData.profile_pic_url = uploadedUrl;
        }
      } else if (preview === null) {
        userData.profile_pic_url = "https://cdn-icons-png.flaticon.com/128/1077/1077012.png"; // Reset to default if explicitly removed
      }

      // Then update the user profile
      const response = await updateUserRequest(userData);

      // Sync with global store so UI updates immediately without refreshing
      if (response && response.user) {
        updateUser(response.user);
      }

      return response;
    };

    notify.promise(updatePromise(), {
      loading: "Updating profile...",
      success: (data) => data?.message || "Profile updated successfully",
      error: (err) => err?.message || "Failed to update profile",
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-5xl space-y-6 duration-500">
      {/* Header Section */}
      <div>
        <h3 className="text-2xl font-semibold tracking-tight">Profile Settings</h3>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account details and security preferences.</p>
      </div>

      <Separator />

      {/* Hero Profile Banner */}
      <div className="bg-card relative overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-primary/10 hero-grid absolute inset-x-0 top-0 h-full"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pt-8 pb-4 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="group relative inline-block cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="border-card ring-primary/20 bg-card h-20 w-20 border-4 shadow-lg ring-2 transition-transform duration-300 group-hover:scale-105">
              <AvatarImage src={preview} alt={user?.display_name || user?.username} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                {user?.display_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Camera className="mb-1 h-5 w-5 text-white" />
            </div>
            {preview && preview !== user?.profile_pic_url && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 z-20 rounded-full p-1 shadow-md transition-transform hover:scale-110"
                title="Remove image"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              name="profilePic"
            />
          </div>

          <div className="mb-[2px] flex-1">
            <h2 className="text-2xl font-bold tracking-tight">
              {user?.display_name || user?.username || "Loading..."}
            </h2>
            <div className="text-muted-foreground flex items-center justify-center gap-2 sm:justify-start">
              <Shield className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">{user?.role || "User"}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* Personal Information Card */}
        <Card className="border-border/50 hover:border-border flex h-full flex-col shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayname">Display Name</Label>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    name="displayname"
                    id="displayname"
                    defaultValue={user?.display_name}
                    placeholder="John Doe"
                    className="focus-visible:ring-primary pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-sm font-semibold">@</span>
                  </div>
                  <Input
                    name="username"
                    id="username"
                    defaultValue={user?.username}
                    disabled
                    className="bg-muted cursor-not-allowed pl-10 opacity-80 select-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <p className="text-muted-foreground text-xs">Username cannot be changed.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  name="email"
                  id="email"
                  type="email"
                  defaultValue={user?.email}
                  placeholder="john@example.com"
                  className="focus-visible:ring-primary pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-border/50 hover:border-border flex h-full flex-col shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">Security</CardTitle>
            <CardDescription>Manage your password and assigned role.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Account Role</Label>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Shield className="h-4 w-4" />
                  </div>
                  <Input
                    name="role"
                    id="role"
                    defaultValue={user?.role}
                    disabled
                    className="bg-muted cursor-not-allowed pl-10 opacity-80 select-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <p className="text-muted-foreground text-xs">Roles are managed by administrators.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <Input
                    name="password"
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="focus-visible:ring-primary pl-10 shadow-sm"
                  />
                </div>
                <p className="text-muted-foreground text-xs">Leave blank to keep your current password.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button Row */}
        <div className="mt-2 flex justify-end md:col-span-2">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground focus-visible:ring-primary px-8 font-medium shadow-md transition-all hover:shadow-lg"
          >
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
