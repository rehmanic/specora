"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function AuthForm({ className, variant = "login", ...props }) {
  const isLogin = variant === "login";
  // We still import the store, but we will bypass 'login' to fix the URL issue locally
  const { loading: storeLoading, error: storeError } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState(null);
  // Add local loading state since we are handling login manually
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // FIX: Manually fetch login to ensure we hit port 5000 (Backend)
        // This bypasses the broken URL in the store's login() function
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        // Check response status BEFORE parsing JSON to avoid parsing HTML error pages
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Login failed" }));
          throw new Error(errorData.message || "Login failed");
        }

        const data = await res.json();

        // Save token to localStorage
        localStorage.setItem("token", data.token);

        // CRITICAL FIX: Update Zustand store with user data so ProtectedRoute can access it
        useAuthStore.setState({
          user: data.user,
          token: data.token,
        });

        // Use router.push instead of window.location to avoid full page reload
        router.push("/dashboard");
      } else {
        // signup (This was already working correctly)
        const res = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        // Check response status BEFORE parsing JSON to avoid parsing HTML error pages
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Signup failed" }));
          throw new Error(errorData.message || "Signup failed");
        }

        const data = await res.json();

        alert("Signup successful! Please login.");
        router.push("/login");
      }
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = storeLoading || isSubmitting;
  const errorMessage = localError || storeError;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isLogin ? "Login to your account" : "Create an account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to login to your account"
              : "Enter your details below to create your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* Username */}
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email only for signup */}
              {!isLogin && (
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Password */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Error display */}
              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading
                    ? isLogin
                      ? "Logging in..."
                      : "Signing up..."
                    : isLogin
                      ? "Login"
                      : "Sign up"}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <a href="/signup" className="underline underline-offset-4">
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Login
                  </a>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}