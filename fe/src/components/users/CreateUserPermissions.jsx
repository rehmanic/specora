"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CreateUserPermissions({ permissions, handlePermissionToggle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Permissions</CardTitle>
        <CardDescription>Configure what this user can access and modify</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {Object.entries(permissions).map(([category, categoryPermissions]) => (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="cursor-pointer text-base capitalize hover:no-underline">
                {category} Permissions
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {categoryPermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={permission.id} className="cursor-pointer font-medium">
                          {permission.label}
                        </Label>
                        <p className="text-muted-foreground text-sm">{permission.description}</p>
                      </div>
                      <Switch
                        id={permission.id}
                        checked={permission.enabled}
                        onCheckedChange={() => handlePermissionToggle(category, permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
