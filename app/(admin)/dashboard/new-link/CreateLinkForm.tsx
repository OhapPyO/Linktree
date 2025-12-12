"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z, { set } from "zod";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
});

function CreateLinkForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const createLink = useMutation(api.lib.links.createLink);

  // 1. Define the form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  // 2. Handle form submission.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);

    startTransition(async () => {
      try {
        await createLink({
          title: values.title,
          url: values.url,
        });
        router.push(`/dashboard`);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to create link",
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Link Title" {...field} />
              </FormControl>
              <FormDescription>
                This will be displayed as the button text for your link.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>
                The destination URL where users will be redirected.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Creating..." : "Create Link"}
        </Button>
      </form>
    </Form>
  );
}

export default CreateLinkForm;
