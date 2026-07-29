"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export function CreateUserBasicFields({
  formData,
  setFormData,
  validationErrors,
  clearValidationError,
  isCreateUser,
  showPassword,
  setShowPassword,
  handleImageChange,
  preview,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">User Information</CardTitle>
        <CardDescription>
          {isCreateUser ? "Enter the basic information for the new user" : "Update user information"}
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
                clearValidationError("fullName");
              }}
              required
              minLength={3}
              maxLength={50}
            />
            {validationErrors.fullName && <p className="text-sm text-red-500">{validationErrors.fullName}</p>}
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
                clearValidationError("username");
              }}
              required
              minLength={5}
              maxLength={20}
              disabled={!isCreateUser} // Username cannot be changed on update
            />
            {validationErrors.username && <p className="text-sm text-red-500">{validationErrors.username}</p>}
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
              clearValidationError("email");
            }}
            required
          />
          {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
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
              clearValidationError("role");
            }}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="requirements_engineer">Requirements Engineer</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.role && <p className="text-sm text-red-500">{validationErrors.role}</p>}
        </div>

        {/* Password */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Password {isCreateUser && <span className="text-red-500">*</span>}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isCreateUser ? "••••••••" : "Leave blank to keep current"}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  clearValidationError("password");
                }}
                required={isCreateUser}
                minLength={isCreateUser ? 6 : undefined}
                maxLength={32}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
            {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
          </div>
        </div>

        {/* Profile picture */}
        <div className="mt-6 space-y-2">
          <Label htmlFor="profilePic">Profile Picture (Optional)</Label>
          <Input id="profilePic" type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="mt-2 h-16 w-16 rounded-full border object-cover" />}
        </div>
      </CardContent>
    </Card>
  );
}
