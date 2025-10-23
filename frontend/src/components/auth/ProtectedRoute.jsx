"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/authStore";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requiredPermissions = [],
}) {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // If not logged in
    if (!user) {
      router.replace("/dashboard");
      return;
    }

    // If user role is not allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.replace("/unauthorized");
      return;
    }

    // If required permissions are missing
    if (
      requiredPermissions.length > 0 &&
      !requiredPermissions.every((perm) => user.permissions.includes(perm))
    ) {
      router.replace("/unauthorized");
      return;
    }
  }, [user, allowedRoles, requiredPermissions, router]);

  // Only render if user is valid and allowed
  if (
    !user ||
    (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) ||
    (requiredPermissions.length > 0 &&
      !requiredPermissions.every((perm) => user.permissions.includes(perm)))
  ) {
    return null;
  }

  return children;
}
