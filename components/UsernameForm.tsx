"use client";
import { useUser } from "@clerk/clerk-react";
import React, { use, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  ExternalLink,
  Link,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { toast } from "sonner";

const formSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contains letters, numbers, underscores and hyphens",
    ),
});
function UsernameForm() {
  const { user } = useUser();
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const watchUsername = form.watch("username");

  useEffect(() => {
    const delayInputTimeout = setTimeout(() => {
      setDebouncedUsername(watchUsername);
    }, 500);
    return () => clearTimeout(delayInputTimeout); // cleanup function
  }, [watchUsername]);

  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip",
  );

  const availabilityCheck = useQuery(
    api.lib.usernames.checkUsernameAvailability,
    debouncedUsername.length >= 3 ? { username: debouncedUsername } : "skip",
  );

  const setUsername = useMutation(api.lib.usernames.setUsername);

  // Determine the status of the username
  // - Returns null if the username is too short or is empty
  // - Returns "checking" if the username is being debounced or availability is being checked
  // - Returns "current" if the username is the same as the current username
  // - Returns "available" or "unavailable"  based on the availability check result
  const getStatus = () => {
    if (!debouncedUsername || debouncedUsername.length < 3) return null;
    if (debouncedUsername !== watchUsername) return "checking";
    if (!availabilityCheck) return "checking";
    if (debouncedUsername === currentSlug) return "current";
    return availabilityCheck?.available ? "available" : "unavailable";
  };
  const status = getStatus();

  const hasCustomUsername = currentSlug && currentSlug !== user?.id;

  const isSubmitDisabled =
    status !== "available" || form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id) return;
    try {
      const result = await setUsername({ username: values.username });
      if (result.success) {
        form.reset();
      } else {
        form.setError("username", {
          message: result.error,
        });
      }
    } catch {
      form.setError("username", {
        message: "Failed to update username, Please try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customize your link-in-bio page
        </h3>
        <p className="text-gray-600 text-sm">
          Choose a custom username for your link-in-bio page. This will be your
          public URL.
        </p>
      </div>
      {/* Current Username Status*/}
      {hasCustomUsername && (
        <div className="bg-green-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Current Username
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-green-800 bg-white px-2 py-1 rounded text-sm ">
                {currentSlug}
              </span>
              <a
                href={`u/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className=" text-green-600 hover:text-gray-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
      {/* URL Perview*/}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">
            Your Link Perview
          </span>
        </div>
        <div className="flex items-center">
          <a
            href={`u/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-gray-800 bg-white px-3 py-2 rounded-l border-l border-y hover:bg-gray-50
           transition-colors truncate"
          >
            {getBaseUrl()}/u/{currentSlug}
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${getBaseUrl()}/u/${currentSlug}`);
              toast.success("Link copied to clipboard");
            }}
            className="flex items-center justify-center w-10 h-10 bg-white border rounded-r hover:bg-gray-50 transition-all"
            title="Copy Link to Clipboard"
          >
            <Copy className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Form*/}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="enter your desired username"
                      {...field}
                      className="pr-10"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {status === "checking" && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400 " />
                      )}
                      {status === "available" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {status === "current" && (
                        <User className="h-4 w-4 text-green-500" />
                      )}
                      {status === "unavailable" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Your username can contain letters, numbers, underscores and
                  hyphens.
                </FormDescription>
                {status === "unavailable" && (
                  <p className="text-sm text-red-500">
                    {availabilityCheck?.error ||
                      "This username is already taken."}
                  </p>
                )}
                {status === "available" && (
                  <p className="text-sm text-green-500">
                    This username is available.
                  </p>
                )}
                {status === "checking" && (
                  <p className="text-sm text-gray-400">Checking...</p>
                )}
                {status === "current" && (
                  <p className="text-sm text-blue-600">
                    This is your current username.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            disabled={isSubmitDisabled}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Username"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UsernameForm;
