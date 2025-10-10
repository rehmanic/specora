"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeedback } from "./UseFeedback";

export default function FeedbackForm({ redirectTo }) {
  const router = useRouter();
  const { add } = useFeedback();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", comments: "", rating: 0 },
  });

  async function onSubmit(values) {
    if (!values.name || !values.comments || !values.rating) {
      alert("Please fill in all fields and select a rating.");
      return;
    }
    await add(values);
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Client Name</Label>
          <Input id="name" placeholder="Jane Doe" {...register("name")} />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">Name is required</p>
          )}
        </div>

        <div>
          <Label htmlFor="rating">Rating the app</Label>
          <Select
            value={watch("rating") ? String(watch("rating")) : ""}
            onValueChange={(v) => setValue("rating", Number(v))}
          >
            <SelectTrigger id="rating" aria-label="Rating">
              <SelectValue placeholder="Choose 1–5" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((r) => (
                <SelectItem key={r} value={String(r)}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.rating && (
            <p className="mt-1 text-xs text-destructive">Rating is required</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            placeholder="Tell us what you think…"
            className="min-h-28"
            {...register("comments")}
          />
          {errors.comments && (
            <p className="mt-1 text-xs text-destructive">
              Please add a comment
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <Button type="submit" className="min-w-32" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </form>
  );
}
