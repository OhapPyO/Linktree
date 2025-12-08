import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  usernames: defineTable({
    userId: v.string(), // Clerk user ID
    username: v.string(), // The desired username (must be unique)
  })
    .index("by_user_id", ["userId"])
    .index("by_username", ["username"]),

  links: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(), // The title of the link
    url: v.string(), // The URL of the link
    order: v.number(), // sort order
  })
    .index("by_user_id", ["userId"])
    .index("by_user_and_order", ["userId", "order"]),

  userCustomizations: defineTable({
    userId: v.string(), // Clerk user ID
    profilePictureStorageId: v.optional(v.id("_storage")), // Optional storage ID for profile picture
    description: v.optional(v.string()), // Optional description
    accentColor: v.optional(v.string()), // Optional accent color
  }).index("by_user_id", ["userId"]),
});
