"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import ErrorBox from "@/components/common/ErrorBox";
import { notify } from "@/components/common/Notification";
import { Eye, EyeOff, ArrowRight, Loader2, Mail, User, Lock } from "lucide-react";
import Link from "next/link";

export default function AuthForm({ className, variant = "login", ...props }) {
  const isLogin = variant === "login";
  const { login, signup, loading, error } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

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

  const inputWrapperClass = (fieldName) =>
    cn(
      "relative flex items-center rounded-lg border transition-all duration-200 bg-slate-50",
      focusedField === fieldName
        ? "border-[oklch(0.15_0.02_285)] ring-2 ring-[oklch(0.15_0.02_285)]/10"
        : "border-slate-200 hover:border-slate-300"
    );

  return (
    <div className={cn("flex flex-col gap-6 animate-fade-in", className)} {...props}>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-slate-500">
            {isLogin
              ? "Enter your credentials to access your account"
              : "Get started with Specora in seconds"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                Username
              </Label>
              <div className={inputWrapperClass("username")}>
                <User className="absolute left-3 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={5}
                  maxLength={20}
                  pattern="(?=.*[A-Za-z]{3,})[A-Za-z\d]+"
                  placeholder="Enter your username"
                  className="border-0 pl-10 focus-visible:ring-0 bg-transparent text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Email only for signup */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </Label>
                <div className={inputWrapperClass("email")}>
                  <Mail className="absolute left-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="you@example.com"
                    className="border-0 pl-10 focus-visible:ring-0 bg-transparent text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                {isLogin && (
                  <Link
                    href="#"
                    className="text-xs text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className={inputWrapperClass("password")}>
                <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength={6}
                  maxLength={32}
                  placeholder="Enter your password"
                  className="border-0 pl-10 pr-10 focus-visible:ring-0 bg-transparent text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error display */}
            {(localError || error) && (
              <ErrorBox message={localError || error} />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-11 mt-2 font-bold text-sm rounded-full bg-[oklch(0.15_0.02_285)] text-white hover:bg-[oklch(0.20_0.02_285)] transition-all group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">
                  or
                </span>
              </div>
            </div>

            {/* Toggle between login/signup */}
            <p className="text-center text-sm text-slate-500">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-[oklch(0.15_0.02_285)] hover:text-slate-600 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[oklch(0.15_0.02_285)] hover:text-slate-600 transition-colors"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
