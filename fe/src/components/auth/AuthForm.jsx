"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import ErrorBox from "@/components/common/ErrorBox";
import { notify } from "@/components/common/Notification";
import { Eye, EyeOff, ArrowRight, Loader2, User, Lock } from "lucide-react";
import Link from "next/link";

export default function AuthForm({ className, ...props }) {
  const { login, loading, error } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  // Clear errors on mount
  useEffect(() => {
    setLocalError(null);
    useAuthStore.setState({ error: null });
  }, []);

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
      await login({
        username: formData.username,
        password: formData.password,
      });

      notify.success("Welcome back!", {
        description: `Logged in as ${formData.username}`,
      });
      router.push("/dashboard");
    } catch (err) {
      const errorMessage = err?.message || "An unexpected error occurred. Please try again.";
      setLocalError(errorMessage);
      notify.error("Login failed", {
        description: errorMessage,
      });
    }
  };

  const inputWrapperClass = (fieldName) =>
    cn(
      "relative flex items-center rounded-lg border transition-all duration-200 bg-slate-50",
      focusedField === fieldName ? "border-primary ring-2 ring-primary/10" : "border-slate-200 hover:border-slate-300"
    );

  return (
    <div className={cn("animate-fade-in flex flex-col gap-6", className)} {...props}>
      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Login
          </h2>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your account
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
                  className="border-0 bg-transparent pl-10 text-slate-900 placeholder-slate-400 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
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
                  className="border-0 bg-transparent pr-10 pl-10 text-slate-900 placeholder-slate-400 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 transition-colors hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error display */}
            {(localError || error) && <ErrorBox message={localError || error} />}

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-primary text-primary-foreground group mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Hold on...
                </>
              ) : (
                <>
                  Let's go
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Footer */}
            <p className="mt-2 text-center text-xs text-slate-400">
              Forgot password? Contact <a className="text-black/60 hover:text-black/80 font-semibold transition-colors" href="https://mail.google.com/mail/?view=cm&to=admin@specora.com">admin@specora.com</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}