"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator />

            <div className="space-y-8">
                <div className="grid gap-4">
                    <h4 className="text-sm font-medium">Profile</h4>
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue="johndoe" />
                        <p className="text-[0.8rem] text-muted-foreground">
                            This is your public display name.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="john@example.com" disabled />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
