"use client";

import React, { useState, useEffect } from "react";
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
import ErrorBox from "@/components/common/ErrorBox";
import { notify } from "@/components/common/Notification";

export default function AuthForm({ className, variant = "login", ...props }) {
  const isLogin = variant === "login";
  const { login, signup, loading, error } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [localError, setLocalError] = useState(null);

  // Clear errors when variant changes
  useEffect(() => {
    setLocalError(null);
    useAuthStore.setState({ error: null });
  }, [variant]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear errors when user starts typing
    if (localError || error) {
      setLocalError(null);
      useAuthStore.setState({ error: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    useAuthStore.setState({ error: null });

    try {
      if (isLogin) {
        await login({
          username: formData.username,
          password: formData.password,
        });

        notify.success("Welcome back!", {
          description: `Logged in as ${formData.username}`,
        });
        router.push("/dashboard");
      } else {
        await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        notify.success("Account created successfully!", {
          description: "Welcome to Specora",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err?.message || "An unexpected error occurred. Please try again.";
      setLocalError(errorMessage);
      notify.error(isLogin ? "Login failed" : "Signup failed", {
        description: errorMessage,
      });
    }
  };

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
                  minLength={5}
                  maxLength={20}
                  pattern="(?=.*[A-Za-z]{3,})[A-Za-z\d]+"
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
                    required
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
                  minLength={6}
                  maxLength={32}
                />
              </div>

              {/* Error display */}
              {(localError || error) && (
                <ErrorBox message={localError || error} />
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading
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
