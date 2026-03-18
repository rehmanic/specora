"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createUserRequest, updateUserRequest, getSingleUserDataRequest, deleteUserRequest } from "@/api/users";
import { uploadFileRequest } from "@/api/upload";
import notify from "@/components/common/Notification";
import { cn } from "@/lib/utils";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import useRbacStore from "@/store/rbacStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UserInfo({ variant = "create-user", username }) {
  const isCreate = variant === "create-user";
  const router = useRouter();

  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({
    open: false,
    title: "",
    message: "",
  });

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "client",
    profilePicUrl: "https://cdn-icons-png.flaticon.com/128/1077/1077012.png",
  });

  const { roles, fetchRoles } = useRbacStore();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

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
        setSuccessModal({
          open: true,
          title: "User Created",
          message: `The user ${userData.fullName} has been created successfully.`,
        });
      } else {
        await updateUserRequest(payload);
        notify.success("User updated successfully", { id: toastId });
        setSuccessModal({
          open: true,
          title: "User Updated",
          message: "User profile information has been saved.",
        });
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
      <div className="border-border flex flex-col gap-2 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {isCreate ? "Create New User" : "User Profile & Settings"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isCreate
              ? "Register a new collaborator and assign initial permissions."
              : "Manage user identity, system roles, and detailed access rights."}
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" orientation="vertical" className="flex w-full flex-col gap-6 md:flex-row">
        <div className="flex min-w-[240px] flex-col gap-4 md:sticky md:top-24">
          <TabsList className="bg-muted/50 h-fit w-full flex-col gap-1 rounded-xl border p-1">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <User className="size-4" />
              General Info
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground justify-start gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
            >
              <Shield className="size-4" />
              Permissions
            </TabsTrigger>
            {!isCreate && (
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
              {isSaving ? "Processing..." : isCreate ? "Create User" : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col">
          {/* General Tab */}
          <TabsContent value="general" className="animate-fade-in mt-0 space-y-6 outline-none">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="text-primary size-4" />
                  <CardTitle className="text-lg">Account Details</CardTitle>
                </div>
                <CardDescription>Basic identification and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col items-center gap-4 border-b pb-4 sm:flex-row sm:items-start sm:gap-6">
                  <div className="group relative">
                    <Avatar className="border-muted/50 group-hover:ring-primary/20 size-24 border-4 ring-2 ring-transparent ring-offset-2 transition-all">
                      <AvatarImage src={profilePreview || userData.profilePicUrl} className="object-cover" />
                      <AvatarFallback className="bg-muted text-xl">{(userData.fullName || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <label className="bg-primary text-primary-foreground border-background absolute right-0 bottom-0 cursor-pointer rounded-full border-2 p-1.5 shadow-lg transition-all hover:scale-110 active:scale-95">
                      <Camera className="size-4" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <div className="space-y-0.5">
                      <h3 className="text-xl font-bold tracking-tight">{userData.fullName || "New User"}</h3>
                      <p className="text-muted-foreground flex items-center justify-center gap-1 text-xs font-medium sm:justify-start">
                        @{userData.username ? userData.username.toLowerCase() : "username"}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 pt-3 sm:justify-start">
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold capitalize"
                      >
                        {userData.role?.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-muted/30 text-muted-foreground border-border text-[10px] font-medium"
                      >
                        <Mail className="mr-1 size-3" />
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
                      <User className="text-muted-foreground absolute top-3 left-3 size-4" />
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
                        disabled={!isCreate}
                      />
                      <CheckCircle2 className="text-muted-foreground absolute top-3 left-3 size-4" />
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
                      <Mail className="text-muted-foreground absolute top-3 left-3 size-4" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">
                      Account Role <span className="text-destructive">*</span>
                    </Label>
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
                    {isCreate ? "Initial Password" : "Reset Password"}{" "}
                    {isCreate && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="relative max-w-sm">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={isCreate ? "Minimum 6 characters" : "Leave blank to keep current"}
                      value={userData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="h-10 pr-10 pl-9"
                    />
                    <Lock className="text-muted-foreground absolute top-3 left-3 size-4" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground absolute top-3 right-3 transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="animate-fade-in mt-0 space-y-6 outline-none">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="text-primary size-4" />
                  <CardTitle className="text-lg">Role Capabilities</CardTitle>
                </div>
                <CardDescription>
                  This user has the following permissions based on their{" "}
                  <strong>{userData.role?.replace("_", " ")}</strong> role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] rounded-lg border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-xs font-bold uppercase">Module</TableHead>
                        <TableHead className="text-xs font-bold uppercase">Permission</TableHead>
                        <TableHead className="text-xs font-bold uppercase">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles
                        .find((r) => r.name === userData.role)
                        ?.permissions?.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="text-xs font-medium capitalize">{p.module || "General"}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary border-primary/20 text-[10px]"
                              >
                                {p.label || p.name}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">
                              {p.description || "Access to this module's features."}
                            </TableCell>
                          </TableRow>
                        )) || (
                        <TableRow>
                          <TableCell colSpan={3} className="text-muted-foreground py-20 text-center italic">
                            No granular permissions assigned to this role yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                <div className="bg-primary/5 border-primary/10 mt-4 flex items-start gap-3 rounded-lg border p-4">
                  <AlertCircle className="text-primary mt-0.5 size-5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-primary text-xs font-bold">Admin Managed Access</p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Permissions are managed globally through the RBAC settings. Changing a user's role will update
                      their permissions automatically.
                    </p>
                  </div>
                </div>
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
                <CardDescription>Irreversible operations that destroy user data.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-destructive/10 bg-destructive/5 flex flex-col justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-destructive text-sm font-bold">Delete Account</p>
                    <p className="text-muted-foreground text-xs">
                      This user and all their personal records will be wiped.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="font-bold"
                    onClick={() => setDeleteModalOpen(true)}
                  >
                    Erase Account
                  </Button>
                </div>

                <ConfirmationDialog
                  open={deleteModalOpen}
                  onOpenChange={setDeleteModalOpen}
                  onConfirm={handleDeleteUser}
                  title="Delete Account"
                  description={
                    <span>
                      Deleting{" "}
                      <strong>
                        {userData.fullName} (@{userData.username})
                      </strong>{" "}
                      is final. The user will lose access immediately and all associated metadata will be purged.
                    </span>
                  }
                  confirmText={isDeleting ? "Wiping..." : "Yes, Purge Account"}
                  variant="destructive"
                  loading={isDeleting}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      {/* Success Modal */}
      <Dialog open={successModal.open} onOpenChange={(open) => setSuccessModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="text-center sm:max-w-md">
          <DialogHeader>
            <div className="bg-success/10 text-success mx-auto my-4 flex h-12 w-12 items-center justify-center rounded-full">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl">{successModal.title}</DialogTitle>
            <DialogDescription className="pt-2 text-center">{successModal.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-row gap-2 sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSuccessModal((prev) => ({ ...prev, open: false }))}
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSuccessModal((prev) => ({ ...prev, open: false }));
                router.push("/users");
              }}
            >
              Go to User List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
