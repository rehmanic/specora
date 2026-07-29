"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import permissionList from "@/utils/permissions";
import { createUserRequest, updateUserRequest, getSingleUserDataRequest } from "@/api/users";
import { uploadFileRequest } from "@/api/upload";

import { CreateUserBasicFields } from "./CreateUserBasicFields";
import { CreateUserPermissions } from "./CreateUserPermissions";
import { CreateUserFormActions } from "./CreateUserFormActions";

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

  // Prefill data in update mode
  useEffect(() => {
    if (!isCreateUser && username) {
      const fetchUser = async () => {
        try {
          setError(null);
          const data = await getSingleUserDataRequest(username);

          setFormData({
            username: data.username || "",
            email: data.email || "",
            fullName: data.display_name || "",
            password: "",
            role: data.role || "",
            profilePic: null,
          });

          setPreview(data.profile_pic_url || null);

          const updatedPermissions = { ...permissionList };
          if (data.permissions && Array.isArray(data.permissions)) {
            Object.keys(updatedPermissions).forEach((category) => {
              updatedPermissions[category] = updatedPermissions[category].map((perm) => ({
                ...perm,
                enabled: data.permissions.includes(perm.id),
              }));
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

  const handlePermissionToggle = (category, id) => {
    setPermissions((prevState) => ({
      ...prevState,
      [category]: prevState[category].map((perm) => (perm.id === id ? { ...perm, enabled: !perm.enabled } : perm)),
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

  const clearValidationError = (field) => {
    if (validationErrors[field]) {
      const { [field]: _, ...rest } = validationErrors;
      setValidationErrors(rest);
    }
  };

  const validateForm = () => {
    const errors = {};

    const usernameRegex = /^(?=.*[A-Za-z]{3,})[A-Za-z\d]{5,20}$/;
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!usernameRegex.test(formData.username)) {
      errors.username = "Username must be 5-20 characters, contain at least 3 letters, and use only letters/numbers";
    }

    const displayNameRegex = /^[A-Za-z\d\s'.-]{3,50}$/;
    if (!formData.fullName.trim()) {
      errors.fullName = "Display name is required";
    } else if (!displayNameRegex.test(formData.fullName)) {
      errors.fullName =
        "Display name must be 3-50 characters and may include letters, numbers, spaces, and punctuation";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (isCreateUser) {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 6 || formData.password.length > 32) {
        errors.password = "Password must be 6-32 characters long";
      }
    } else {
      if (formData.password && (formData.password.length < 6 || formData.password.length > 32)) {
        errors.password = "Password must be 6-32 characters long";
      }
    }

    const validRoles = ["manager", "client", "requirements_engineer"];
    if (!formData.role) {
      errors.role = "Role is required";
    } else if (!validRoles.includes(formData.role)) {
      errors.role = `Invalid role. Must be one of: ${validRoles.join(", ")}`;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const enabledPermissions = Object.entries(permissions).flatMap(([category, perms]) =>
        perms.filter((p) => p.enabled).map((p) => p.id)
      );

      let profileUrl = "https://cdn-icons-png.flaticon.com/128/1077/1077012.png";
      if (formData.profilePic) {
        const uploadedUrl = await uploadFileRequest(formData.profilePic);
        if (uploadedUrl) {
          profileUrl = uploadedUrl;
        }
      } else if (preview !== null) {
        profileUrl = preview;
      }

      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        display_name: formData.fullName.trim(),
        profile_pic_url: profileUrl,
        permissions: enabledPermissions,
      };

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
      setError(err?.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CreateUserBasicFields
        formData={formData}
        setFormData={setFormData}
        validationErrors={validationErrors}
        clearValidationError={clearValidationError}
        isCreateUser={isCreateUser}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleImageChange={handleImageChange}
        preview={preview}
      />

      <CreateUserPermissions
        permissions={permissions}
        handlePermissionToggle={handlePermissionToggle}
      />

      <CreateUserFormActions
        error={error}
        handleCancel={handleCancel}
        isSubmitting={isSubmitting}
        isCreateUser={isCreateUser}
      />
    </form>
  );
}
