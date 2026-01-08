"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eye, EyeOff, Save, X } from "lucide-react";
import permissionList from "@/utils/permissions";
import {
  createUserRequest,
  updateUserRequest,
  getSingleUserDataRequest,
} from "@/api/users";
import ErrorBox from "@/components/common/ErrorBox";

export function CreateUserForm({ variant = "create-user", username }) {
  const isCreateUser = variant === "create-user";

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "",
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);
  const [permissions, setPermissions] = useState(permissionList);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // -------------------------
  // Prefill data in update mode
  // -------------------------
  useEffect(() => {
    if (!isCreateUser && username) {
      const fetchUser = async () => {
        try {
          setError(null);
          const data = await getSingleUserDataRequest(username);
          // API now returns user object directly

          setFormData({
            username: data.username || "",
            email: data.email || "",
            fullName: data.display_name || "",
            password: "", // Don't prefill password for security
            role: data.role || "",
            profilePic: null, // file input cannot be prefilled
          });

          setPreview(data.profile_pic_url || null);

          // Pre-fill permissions
          const updatedPermissions = { ...permissionList };
          if (data.permissions && Array.isArray(data.permissions)) {
            Object.keys(updatedPermissions).forEach((category) => {
              updatedPermissions[category] = updatedPermissions[category].map(
                (perm) => ({
                  ...perm,
                  enabled: data.permissions.includes(perm.id),
                })
              );
            });
          }
          setPermissions(updatedPermissions);
        } catch (err) {
          setError(err.message || "Failed to fetch user data");
        }
      };

      fetchUser();
    }
  }, [isCreateUser, username]);

  // -------------------------
  // Permission toggle
  // -------------------------
  const handlePermissionToggle = (category, id) => {
    setPermissions((prevState) => ({
      ...prevState,
      [category]: prevState[category].map((perm) =>
        perm.id === id ? { ...perm, enabled: !perm.enabled } : perm
      ),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    router.push("/users");
  };

  // -------------------------
  // Validation functions
  // -------------------------
  const validateForm = () => {
    const errors = {};
    
    // Username validation: 5-20 chars, at least 3 letters, letters/numbers only
    const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username = "Username must be 5-20 characters, contain at least 3 letters, and use only letters/numbers";
    }

    // Display name validation: 3-50 chars, letters/numbers/spaces/punctuation
    const displayNameRegex = /^[A-Za-z\d\s'.-]{3,50}$/;
    if (!formData.fullName.trim()) {
      errors.fullName = "Display name is required";
    } else if (!displayNameRegex.test(formData.fullName)) {
      errors.fullName = "Display name must be 3-50 characters and may include letters, numbers, spaces, and punctuation";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // Password validation (required for create, optional for update)
    if (isCreateUser) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6 || formData.password.length > 32) {
        errors.password = "Password must be 6-32 characters long";
      }
    } else {
      // For updates, validate only if password is provided
      if (formData.password && (formData.password.length < 6 || formData.password.length > 32)) {
        errors.password = "Password must be 6-32 characters long";
      }
    }

    // Role validation
    const validRoles = ["manager", "client", "requirements_engineer"];
    if (!formData.role) {
      errors.role = "Role is required";
    } else if (!validRoles.includes(formData.role)) {
      errors.role = `Invalid role. Must be one of: ${validRoles.join(", ")}`;
    }

    return errors;
  };

  // -------------------------
  // Form submit handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const enabledPermissions = Object.entries(permissions).flatMap(
        ([category, perms]) => perms.filter((p) => p.enabled).map((p) => p.id)
      );

      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        display_name: formData.fullName.trim(),
        profile_pic_url:
          preview || "https://cdn-icons-png.flaticon.com/128/1077/1077012.png",
        permissions: enabledPermissions,
      };

      // Only include password if provided (required for create, optional for update)
      if (formData.password && formData.password.trim()) {
        userData.password = formData.password;
      }

      if (isCreateUser) {
        await createUserRequest(userData);
      } else {
        await updateUserRequest(userData);
      }

      router.push("/users");
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = "Failed to submit form";
      
      if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            User Information
          </CardTitle>
          <CardDescription>
            {isCreateUser
              ? "Enter the basic information for the new user"
              : "Update user information"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Name & Username */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Display Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="e.g. Hamza"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (validationErrors.fullName) {
                    const { fullName, ...rest } = validationErrors;
                    setValidationErrors(rest);
                  }
                }}
                required
                minLength={3}
                maxLength={50}
              />
              {validationErrors.fullName && (
                <p className="text-sm text-red-500">{validationErrors.fullName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">
                User Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                placeholder="john.doe"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (validationErrors.username) {
                    const { username, ...rest } = validationErrors;
                    setValidationErrors(rest);
                  }
                }}
                required
                minLength={5}
                maxLength={20}
                disabled={!isCreateUser} // Username cannot be changed on update
              />
              {validationErrors.username && (
                <p className="text-sm text-red-500">{validationErrors.username}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (validationErrors.email) {
                  const { email, ...rest } = validationErrors;
                  setValidationErrors(rest);
                }
              }}
              required
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">
              Role <span className="text-red-500">*</span>
            </Label>
            <Select
              required
              value={formData.role}
              onValueChange={(value) => {
                setFormData({ ...formData, role: value });
                // Clear validation error when role is selected
                if (validationErrors.role) {
                  const { role, ...rest } = validationErrors;
                  setValidationErrors(rest);
                }
              }}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="requirements_engineer">
                  Requirements Engineer
                </SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.role && (
              <p className="text-sm text-red-500">{validationErrors.role}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {isCreateUser && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isCreateUser ? "••••••••" : "Leave blank to keep current"
                  }
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (validationErrors.password) {
                      const { password, ...rest } = validationErrors;
                      setValidationErrors(rest);
                    }
                  }}
                  required={isCreateUser}
                  minLength={isCreateUser ? 6 : undefined}
                  maxLength={32}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
              {validationErrors.password && (
                <p className="text-sm text-red-500">{validationErrors.password}</p>
              )}
            </div>
          </div>

          {/* Profile picture */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="profilePic">Profile Picture (Optional)</Label>
            <Input
              id="profilePic"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-16 w-16 rounded-full object-cover border"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Permissions</CardTitle>
          <CardDescription>
            Configure what this user can access and modify
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(permissions).map(
              ([category, categoryPermissions]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="cursor-pointer text-base capitalize hover:no-underline">
                    {category} Permissions
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-4">
                      {categoryPermissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between gap-4 rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex-1 space-y-1">
                            <Label
                              htmlFor={permission.id}
                              className="cursor-pointer font-medium"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                          <Switch
                            id={permission.id}
                            checked={permission.enabled}
                            onCheckedChange={() =>
                              handlePermissionToggle(category, permission.id)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {error && <ErrorBox message={error} />}

        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="gap-2 bg-transparent cursor-pointer"
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>

        <Button 
          type="submit" 
          className="gap-2 cursor-pointer"
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4" />
          {isSubmitting 
            ? (isCreateUser ? "Creating..." : "Updating...") 
            : (isCreateUser ? "Create" : "Update")
          }
        </Button>
      </div>
    </form>
  );
}
