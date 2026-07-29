"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, User, Mail, Lock, Eye, EyeOff, Camera, CheckCircle2 } from "lucide-react";

export default function UserGeneralTab({
  userData,
  handleInputChange,
  isCreate,
  profilePreview,
  handleImageChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Settings className="text-primary size-4" />
          <CardTitle className="text-lg">Account Details</CardTitle>
        </div>
        <CardDescription>Basic identification and security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4 border-b pb-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="group relative">
            <Avatar className="border-muted/50 group-hover:ring-primary/20 size-24 border-4 ring-2 ring-transparent ring-offset-2 transition-all">
              <AvatarImage src={profilePreview || userData.profilePicUrl} className="object-cover" />
              <AvatarFallback className="bg-muted text-xl">{(userData.fullName || "U")[0]}</AvatarFallback>
            </Avatar>
            <label className="bg-primary text-primary-foreground border-background absolute right-0 bottom-0 cursor-pointer rounded-full border-2 p-1.5 shadow-lg transition-all hover:scale-110 active:scale-95">
              <Camera className="size-4" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <div className="space-y-0.5">
              <h3 className="text-xl font-bold tracking-tight">{userData.fullName || "New User"}</h3>
              <p className="text-muted-foreground flex items-center justify-center gap-1 text-xs font-medium sm:justify-start">
                @{userData.username ? userData.username.toLowerCase() : "username"}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-3 sm:justify-start">
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold capitalize"
              >
                {userData.role?.replace("_", " ")}
              </Badge>
              <Badge
                variant="outline"
                className="bg-muted/30 text-muted-foreground border-border text-[10px] font-medium"
              >
                <Mail className="mr-1 size-3" />
                {userData.email ? userData.email.toLowerCase() : "email@example.com"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Name and Username */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="e.g. Hamza Rehman"
                value={userData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="h-10 pl-9"
              />
              <User className="text-muted-foreground absolute top-3 left-3 size-4" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold">
              System Username <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="e.g. hrehman"
                value={userData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="h-10 pl-9"
                disabled={!isCreate}
              />
              <CheckCircle2 className="text-muted-foreground absolute top-3 left-3 size-4" />
            </div>
          </div>
        </div>

        {/* Email and Role */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-bold">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="hamza@example.com"
                value={userData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-10 pl-9"
              />
              <Mail className="text-muted-foreground absolute top-3 left-3 size-4" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold">
              Account Role <span className="text-destructive">*</span>
            </Label>
            <Select value={userData.role} onValueChange={(v) => handleInputChange("role", v)}>
              <SelectTrigger className="h-10 capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="requirements_engineer">Requirements Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs font-bold">
            {isCreate ? "Initial Password" : "Reset Password"}{" "}
            {isCreate && <span className="text-destructive">*</span>}
          </Label>
          <div className="relative max-w-sm">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={isCreate ? "Minimum 6 characters" : "Leave blank to keep current"}
              value={userData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="h-10 pr-10 pl-9"
            />
            <Lock className="text-muted-foreground absolute top-3 left-3 size-4" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground absolute top-3 right-3 transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
