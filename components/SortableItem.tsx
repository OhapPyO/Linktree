"use client";

import { Doc, Id } from "@/convex/_generated/dataModel";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BarChart3,
  Check,
  GripVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Input } from "./ui/input";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "sonner";

function SortableItem({ id, link }: { id: Id<"links">; link: Doc<"links"> }) {
  const { attributes, listeners, setNodeRef, transition, transform } =
    useSortable({ id });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link?.title);
  const [editUrl, setEditUrl] = useState(link?.url);
  const [isUpdating, startTransition] = useTransition();

  const deleteLink = useMutation(api.lib.links.deleteLink);
  const updateLink = useMutation(api.lib.links.updateLink);

  const handleCancel = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setIsEditing(false);
  };
  const handleSave = () => {
    if (!editTitle.trim() || !editUrl.trim()) return;
    startTransition(async () => {
      try {
        let processedUrl = editUrl;
        if (
          !processedUrl.startsWith("https://") &&
          !processedUrl.startsWith("http://")
        ) {
          processedUrl = "https://" + processedUrl;
        }
        await updateLink({
          linkId: id,
          title: editTitle.trim(),
          url: processedUrl,
        });
        setIsEditing(false);
        toast.success("Link updated successfully");
      } catch (error) {
        console.error("Error updating link:", error);
        toast.error("Failed to update link. Please try again.");
      }
    });
  };

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (!link) return null;
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border border-gray-200 rounded-lg
     bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {isEditing ? (
        /* Edit Form*/
        <div className="space-y-3">
          <div className="space-y-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter title"
              className="font-semibold"
            />
            <Input
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="https://example.com"
              className="text-gray-500"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isUpdating || !editTitle.trim() || !editUrl.trim()}
            >
              {isUpdating ? (
                <span
                  className="w-4 h-4 animate-spin border-2 border-white
                  border-t-transparent rounded-full"
                />
              ) : (
                <Check className="w-4 h-4  " />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {/* drag handle*/}

          <div
            {...attributes}
            {...listeners}
            aria-describedby={`link-id-${id}`}
            className="cursor-move p-1 hover:bg-gray-100 shrink-0"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          {/* Content*/}
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-semibold text-lg truncate">{link.title}</h3>
            <p className="text-gray-600 text-sm truncate">{link.url}</p>
          </div>
          {/* Action Buttons*/}
          <div className="flex items-center gap-1 shrink-0">
            {/* Analytics Button*/}
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <Link href={`/dashboard/link/${id}`}>
                <BarChart3 className="w-3.5 h-3.5 text-green-500" />
              </Link>
            </Button>
            {/* Edit Button*/}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 "
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <Pencil className="w-3.5 h-3.5 " />
            </Button>
            {/* Delete Button*/}
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 "
              onClick={(e: { stopPropagation: () => void }) => {
                e.stopPropagation();
                const confirmed = confirm(
                  `Are you sure you want to delete "${link.title}"?\n\n This action cannot be undone.`,
                );
                if (confirmed) {
                  deleteLink({ linkId: id });
                }
              }}
            >
              <Trash2 className="w-3.5 h-3.5 " />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SortableItem;
