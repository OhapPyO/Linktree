import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getUserCustomization = query({
  args: { userId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userCustomizations"),
      _creationTime: v.number(),
      userId: v.string(),
      profilePictureStorageId: v.optional(v.id("_storage")),
      profilePictureUrl: v.optional(v.string()),
      description: v.optional(v.string()),
      accentColor: v.optional(v.string()),
    }),
  ),
  handler: async ({ db, storage }, args) => {
    const customizations = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();
    if (!customizations) {
      return null;
    }
    // get the profile picture URL if storage ID exits
    let profilePictureUrl: string | undefined;
    if (customizations.profilePictureStorageId) {
      const url = await storage.getUrl(customizations.profilePictureStorageId);
      profilePictureUrl = url || undefined;
    }
    return {
      ...customizations,
      profilePictureUrl,
    };
  },
});

export const getCustomizationsBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("userCustomizations"),
      _creationTime: v.number(),
      userId: v.string(),
      profilePictureStorageId: v.optional(v.id("_storage")),
      profilePictureUrl: v.optional(v.string()),
      description: v.optional(v.string()),
      accentColor: v.optional(v.string()),
    }),
  ),
  handler: async ({ db, storage }, args) => {
    // first try to find a custom username
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();
    let userId: string;
    if (usernameRecord) {
      userId = usernameRecord.userId;
    } else {
      // treat slug as potenitioal clrek ID
      userId = args.slug;
    }
    const customizations = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (!customizations) {
      return null;
    }
    // get the profile picture URL if storage ID exits
    let profilePictureUrl: string | undefined;
    if (customizations.profilePictureStorageId) {
      const url = await storage.getUrl(customizations.profilePictureStorageId);
      profilePictureUrl = url || undefined;
    }
    return {
      ...customizations,
      profilePictureUrl,
    };
  },
});

// update user customization
export const updateCustomizations = mutation({
  args: {
    profilePictureStorageId: v.optional(v.id("_storage")),
    description: v.optional(v.string()),
    accentColor: v.optional(v.string()),
  },
  returns: v.id("userCustomizations"),
  handler: async ({ db, auth, storage }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const userId = identity.subject;
    const existing = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing) {
      // if we are updating with a new profile picture, delete the old one
      if (args.profilePictureStorageId && existing.profilePictureStorageId) {
        await storage.delete(existing.profilePictureStorageId);
      }
      // update existing customization
      await db.patch(existing._id, {
        ...(args.profilePictureStorageId !== undefined && {
          profilePictureStorageId: args.profilePictureStorageId,
        }),
        ...(args.description !== undefined && {
          description: args.description,
        }),
        ...(args.accentColor !== undefined && {
          accentColor: args.accentColor,
        }),
      });
      return existing._id;
    } else {
      // create new customization
      return await db.insert("userCustomizations", {
        userId: identity.subject,
        ...(args.profilePictureStorageId !== undefined && {
          profilePictureStorageId: args.profilePictureStorageId,
        }),
        ...(args.description !== undefined && {
          description: args.description,
        }),
        ...(args.accentColor !== undefined && {
          accentColor: args.accentColor,
        }),
      });
    }
  },
});

// generate upload URL for profile picture
export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async ({ storage, auth }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    return await storage.generateUploadUrl();
  },
});

export const removeProfilePicture = mutation({
  args: {},
  returns: v.null(),
  handler: async ({ storage, auth, db }, args) => {
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }
    const existing = await db
      .query("userCustomizations")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .unique();
    if (existing && existing.profilePictureStorageId) {
      // delete the profile picture from storage
      await storage.delete(existing.profilePictureStorageId);
      // update the customization to remove the profile picture storage ID
      await db.patch(existing._id, {
        profilePictureStorageId: undefined,
      });
      return null;
    }
    return null;
  },
});
