import React from "react";
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

export default function AuthForm({ className, variant = "login", ...props }) {
  const isLogin = variant === "login";

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
          <form>
            <div className="flex flex-col gap-6">
              {/* Username: required for both login and signup */}
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={isLogin ? undefined : "e.g. saif"}
                  required
                />
              </div>

              {/* Email: only for signup (optional) */}
              {!isLogin && (
                <div className="grid gap-3">
                  <Label htmlFor="email">
                    Email{" "}
                    <span className="ml-2 text-sm text-muted-foreground">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. saif@gmail.com"
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
                  placeholder={isLogin ? "" : "6–20 characters"}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  {isLogin ? "Login" : "Sign up"}
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
