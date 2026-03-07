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
            username: data.get("username"),
            email: data.get("email"),
            role: data.get("role")
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
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div>
                <h3 className="text-2xl font-semibold tracking-tight">Profile Settings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your account details and security preferences.
                </p>
            </div>

            <Separator />

            {/* Hero Profile Banner */}
            <div className="relative rounded-xl overflow-hidden bg-card border shadow-sm">
                <div className="absolute inset-x-0 top-0 h-20 bg-primary/10 hero-grid"></div>

                <div className="relative z-10 px-6 pt-8 pb-4 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                    <div className="relative group cursor-pointer inline-block" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-20 w-20 border-4 border-card ring-2 ring-primary/20 shadow-lg transition-transform duration-300 group-hover:scale-105 bg-card">
                            <AvatarImage
                                src={preview}
                                alt={user?.display_name || user?.username}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                                {user?.display_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || "?"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Camera className="w-5 h-5 text-white mb-1" />
                        </div>
                        {preview && preview !== user?.profile_pic_url && (
                            <button
                                type="button"
                                onClick={handleImageRemove}
                                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform z-20"
                                title="Remove image"
                            >
                                <Trash2 className="w-3 h-3" />
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

                    <div className="flex-1 mb-[2px]">
                        <h2 className="text-2xl font-bold tracking-tight">{user?.display_name || user?.username || "Loading..."}</h2>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                            <Shield className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">{user?.role || "User"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Personal Information Card */}
                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border h-full flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Update your personal details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayname">Display Name</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        name="displayname"
                                        id="displayname"
                                        defaultValue={user?.display_name}
                                        placeholder="John Doe"
                                        className="pl-10 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        <span className="text-sm font-semibold">@</span>
                                    </div>
                                    <Input
                                        name="username"
                                        id="username"
                                        defaultValue={user?.username}
                                        placeholder="johndoe"
                                        className="pl-10 focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    defaultValue={user?.email}
                                    placeholder="john@example.com"
                                    className="pl-10 focus-visible:ring-primary"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security Card */}
                <Card className="border-border/50 shadow-sm transition-all hover:shadow-md hover:border-border h-full flex flex-col">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                            Security
                        </CardTitle>
                        <CardDescription>
                            Manage your password and assigned role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Account Role</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                    </div>
                                    <Input
                                        name="role"
                                        id="role"
                                        defaultValue={user?.role}
                                        readOnly
                                        className="pl-10 bg-muted/50 cursor-not-allowed select-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Roles are managed by administrators.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Change Password</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        <KeyRound className="h-4 w-4" />
                                    </div>
                                    <Input
                                        name="password"
                                        id="password"
                                        type="password"
                                        autoComplete="new-password"
                                        className="pl-10 shadow-sm focus-visible:ring-primary"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep your current password.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button Row */}
                <div className="md:col-span-2 flex justify-end mt-2">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all shadow-md hover:shadow-lg focus-visible:ring-primary px-8">
                        Save All Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
