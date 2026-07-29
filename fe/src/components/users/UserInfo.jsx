"use client";

// React
import { useState, useEffect } from "react";

// Next.js
import { useRouter } from "next/navigation";

// Third-party
import { User, Shield, Trash2 } from "lucide-react";

// API
import { createUserRequest, updateUserRequest, getSingleUserDataRequest, deleteUserRequest } from "@/api/users";
import { uploadFileRequest } from "@/api/upload";

// UI Components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Shared Components
import notify from "@/components/common/Notification";

// Store
import useRbacStore from "@/store/rbacStore";

// Local Components
import UserGeneralTab from "./UserGeneralTab";
import UserPermissionsTab from "./UserPermissionsTab";
import UserDangerZoneTab from "./UserDangerZoneTab";
import UserSuccessModal from "./UserSuccessModal";


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
        {/* Navigation Sidebar */}
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

        {/* Sub-Components Tab Content */}
        <div className="flex w-full flex-1 flex-col">
          <TabsContent value="general" className="animate-fade-in mt-0 space-y-6 outline-none">
            <UserGeneralTab
              userData={userData}
              handleInputChange={handleInputChange}
              isCreate={isCreate}
              profilePreview={profilePreview}
              handleImageChange={handleImageChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </TabsContent>

          <TabsContent value="permissions" className="animate-fade-in mt-0 space-y-6 outline-none">
            <UserPermissionsTab userRole={userData.role} roles={roles} />
          </TabsContent>

          {!isCreate && (
            <TabsContent value="danger" className="animate-fade-in mt-0 space-y-6 outline-none">
              <UserDangerZoneTab
                userData={userData}
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                handleDeleteUser={handleDeleteUser}
                isDeleting={isDeleting}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Post-save/create Success Modal */}
      <UserSuccessModal
        successModal={successModal}
        setSuccessModal={setSuccessModal}
        onGoToUserList={() => router.push("/users")}
      />
    </div>
  );
}
