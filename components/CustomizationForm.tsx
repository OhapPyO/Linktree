"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { ImageIcon, Palette, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Label } from "./ui/label";
import Image from "next/image";
import { Button } from "./ui/button";
import { toast } from "sonner";

function CustomizationForm() {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCustomizations = useMutation(
    api.lib.customizations.updateCustomizations,
  );

  const generateUploadUrl = useMutation(
    api.lib.customizations.generateUploadUrl,
  );

  const removeProfilePicture = useMutation(
    api.lib.customizations.removeProfilePicture,
  );

  const existingCustomization = useQuery(
    api.lib.customizations.getUserCustomization,
    user ? { userId: user.id } : "skip",
  );
  const [formData, setFormData] = useState({
    description: "",
    accentColor: "#6366f1", // default color
  });

  const [isLoading, startTransition] = useTransition();
  const [isUploading, startUploading] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    startTransition(async () => {
      try {
        await updateCustomizations({
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
        });
        toast.success("Customizations saved successfully");
      } catch (error) {
        console.error("Error updating customizations:", error);
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    //Validate the file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    //Validate the file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    startUploading(async () => {
      try {
        const uploadUrl = await generateUploadUrl();
        console.log("Upload URL:  ", uploadUrl);
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });
        console.log("uploadResult:  ", uploadResult);

        if (!uploadResult.ok) {
          throw new Error("Failed to upload profile picture");
        }
        const { storageId } = await uploadResult.json();
        await updateCustomizations({
          profilePictureStorageId: storageId,
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
        });
        toast.success("Profile picture uploaded successfully");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        toast.error("Error uploading profile picture");
      } finally {
        //reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleRemoveImage = async () => {
    startTransition(async () => {
      try {
        await removeProfilePicture();
        toast.success("Profile picture removed successfully");
      } catch (error) {
        console.error("Error removing profile picture:", error);
        toast.error("Error removing profile picture");
      }
    });
  };

  useEffect(() => {
    if (existingCustomization) {
      setFormData({
        description: existingCustomization.description || "",
        accentColor: existingCustomization.accentColor || "#6366f1",
      });
    }
  }, [existingCustomization]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className="w-full bg-white/80 backdrop-blur-sm border border-white/20
    rounded-2xl p-8 shadow-xl shadow-gray-200/50"
    >
      <div className="mb-6">
        <div className="flex items-ceter gap-3 mb-2 ">
          <div
            className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 
          rounded-lg"
          >
            <Palette className="w-5 h-5 text-white"></Palette>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Customize your Page
            </h2>
            <p className="text-gray-600 text-sm">
              Personalize your public link page with custom profile picture,
              description, and accent color.
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload*/}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 ">
            <ImageIcon className="w-4 h-4 " />
            Profile Picture
          </Label>
          {/* Current Image Display */}
          {existingCustomization?.profilePictureUrl && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 rounded-xl overflow-hidden">
                <Image
                  src={existingCustomization.profilePictureUrl}
                  alt="Profile Picture"
                  className="w-full h-full object-contain"
                  width={64}
                  height={64}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium">
                  Current Image
                </p>
                <p className="text-xs text-gray-500">
                  Click &ldquo;Remove&rdquo; to delete this image
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
          {/* File Upload */}
          <div className=" flex item-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={handleFileUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4 " />
              {isUploading ? "Uploading..." : "Upload New Image"}
            </Button>
            <p className="text-sm text-gray-500">
              Max 5MB, supported formats: JPG, PNG, GIF, WEBP
            </p>
          </div>
        </div>
        {/* Description */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 " htmlFor="description">
            Description
          </Label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell visitors about yourself"
            className="w-full mi-h-{100px} px-3 py-2 border border-gray-300
            rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
            maxLength={200}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
          <p className="text-sm text-gray-500">
            {formData.description.length}/200 characters
          </p>
        </div>
        {/* Accent Color */}
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="accentColor"
                name="accentColor"
                value={formData.accentColor}
                onChange={(e) =>
                  handleInputChange("accentColor", e.target.value)
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Choose your brand color
                </p>
                <p className="text-xs text-gray-500">{formData.accentColor}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            This color will be used as an accent color for your page header
          </p>
        </div>
        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="w-full bg-gradient-to-br from-purple-500 to-pink-500
            text-white hover:from-purple-600 hover:to-pink-600"
          >
            {isLoading || isUploading ? "Saving..." : "Save Customization"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CustomizationForm;
