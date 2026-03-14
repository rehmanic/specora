"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Settings,
  Shield,
  Trash2,
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createUserRequest,
  updateUserRequest,
  getSingleUserDataRequest,
  deleteUserRequest,
} from "@/api/users";
import { uploadFileRequest } from "@/api/upload";
import notify from "@/components/common/Notification";
import { cn } from "@/lib/utils";

export default function UserInfo({ variant = "create-user", username }) {
  const isCreate = variant === "create-user";
  const router = useRouter();

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "client",
    profilePicUrl: "https://cdn-icons-png.flaticon.com/128/1077/1077012.png",
  });

  const [profilePicUrl, setProfilePicUrl] = useState("https://cdn-icons-png.flaticon.com/128/1077/1077012.png");

  // Prefill for update mode
  useEffect(() => {
    if (!isCreate && username) {
      const fetchUser = async () => {
        try {
          const data = await getSingleUserDataRequest(username);
          setUserData({
            username: data.username || "",
            email: data.email || "",
            fullName: data.display_name || "",
            password: "",
            role: data.role || "client",
            profilePicUrl: data.profile_pic_url || "https://cdn-icons-png.flaticon.com/128/1077/1077012.png",
          });
          setProfilePreview(data.profile_pic_url || null);

        } catch (err) {
          notify.error(err.message || "Failed to fetch user data");
        }
      };
      fetchUser();
    }
  }, [isCreate, username]);

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!userData.fullName.trim()) return "Display name is required";
    if (!userData.username.trim()) return "Username is required";
    if (!userData.email.trim()) return "Email is required";
    if (isCreate && !userData.password) return "Password is required";
    if (!userData.role) return "Role is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) return "Invalid email format";
    if (isCreate && userData.password.length < 6) return "Password must be at least 6 characters";

    return null;
  };

  const handleSaveChanges = async () => {
    const error = validateForm();
    if (error) {
      notify.error(error);
      return;
    }

    setIsSaving(true);
    const toastId = notify.loading(isCreate ? "Creating user..." : "Updating user...");

    try {
      let profileUrl = userData.profilePicUrl;
      if (profileFile) {
        profileUrl = await uploadFileRequest(profileFile);
      }


      const payload = {
        username: userData.username.trim(),
        email: userData.email.trim(),
        role: userData.role,
        display_name: userData.fullName.trim(),
        profile_pic_url: profileUrl,
      };

      if (userData.password) {
        payload.password = userData.password;
      }

      if (isCreate) {
        await createUserRequest(payload);
        notify.success("User created successfully", { id: toastId });
        router.push("/users");
      } else {
        await updateUserRequest(payload);
        notify.success("User updated successfully", { id: toastId });
      }
    } catch (err) {
      notify.error(err.message || "Failed to save user", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      await deleteUserRequest(userData.username);
      notify.success("User deleted successfully");
      router.push("/users");
    } catch (err) {
      notify.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {isCreate ? "Create New User" : "User Profile & Settings"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isCreate
              ? "Register a new collaborator and assign initial permissions."
              : "Manage user identity, system roles, and detailed access rights."}
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" orientation="vertical" className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col gap-4 min-w-[240px] md:sticky md:top-24">
          <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 p-1 border rounded-xl">
            <TabsTrigger value="general" className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="size-4" />
              General Info
            </TabsTrigger>
            {!isCreate && (
              <TabsTrigger value="danger" className="justify-start gap-3 px-4 py-2.5 text-sm font-medium transition-all rounded-lg text-destructive data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                <Trash2 className="size-4" />
                Danger Zone
              </TabsTrigger>
            )}
          </TabsList>

          <div className="px-1 space-y-3">
            <Button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full text-xs font-bold"
            >
              {isSaving ? "Processing..." : isCreate ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="flex-1">
          {/* General Tab */}
          <TabsContent value="general" className="mt-0 space-y-6 outline-none animate-fade-in">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="size-4 text-primary" />
                  <CardTitle className="text-lg">Account Details</CardTitle>
                </div>
                <CardDescription>Basic identification and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6 pb-4 border-b">
                  <div className="relative group">
                    <Avatar className="size-24 border-4 border-muted/50 ring-offset-2 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={profilePreview || userData.profilePicUrl} className="object-cover" />
                      <AvatarFallback className="bg-muted text-xl">{(userData.fullName || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <label className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-lg border-2 border-background">
                      <Camera className="size-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold tracking-tight">{userData.fullName || "New User"}</h3>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 justify-center sm:justify-start">
                        @{userData.username ? userData.username.toLowerCase() : "username"}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-3">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize font-bold text-[10px]">
                        {userData.role}
                      </Badge>
                      <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border text-[10px] font-medium">
                        <Mail className="size-3 mr-1" />
                        {userData.email ? userData.email.toLowerCase() : "email@example.com"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. Hamza Rehman"
                        value={userData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="h-10 pl-9"
                      />
                      <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">
                      System Username <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. hrehman"
                        value={userData.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="h-10 pl-9"
                      />
                      <CheckCircle2 className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="hamza@example.com"
                        value={userData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="h-10 pl-9"
                      />
                      <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Account Role <span className="text-destructive">*</span></Label>
                    <Select value={userData.role} onValueChange={(v) => handleInputChange("role", v)}>
                      <SelectTrigger className="h-10 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="requirements_engineer">Requirements Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-bold">
                    {isCreate ? "Initial Password" : "Reset Password"} {isCreate && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative max-w-sm">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={isCreate ? "Minimum 6 characters" : "Leave blank to keep current"}
                      value={userData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-10 pl-9 pr-10"
                    />
                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Danger Tab */}
          <TabsContent value="danger" className="mt-0 space-y-6 outline-none animate-fade-in">
            <Card className="border-destructive/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-destructive">
                  <Trash2 className="size-4" />
                  <CardTitle className="text-lg">Destructive Actions</CardTitle>
                </div>
                <CardDescription>Irreversible operations that destroy user data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col justify-between gap-4 p-4 border rounded-lg border-destructive/10 bg-destructive/5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm font-bold text-destructive">Delete Account</p>
                    <p className="text-xs text-muted-foreground">This user and all their personal records will be wiped.</p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="font-bold">Erase Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                          Deleting <strong>{userData.fullName} (@{userData.username})</strong> is final. 
                          The user will lose access immediately and all associated metadata will be purged.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 gap-2">
                        <AlertDialogCancel disabled={isDeleting} className="rounded-lg h-10 border-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteUser}
                          disabled={isDeleting}
                          className="h-10 bg-destructive text-white hover:bg-destructive/90 rounded-lg font-bold"
                        >
                          {isDeleting ? "Wiping..." : "Yes, Purge Account"}
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
