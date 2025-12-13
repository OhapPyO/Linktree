# Linkify (Linktree-style SaaS) — Next.js 15 + Convex + Clerk

A Linktree-style SaaS web application built with **Next.js 15 + TypeScript**, using **Clerk** for authentication (and billing UI) and **Convex** as the backend (database + server functions).

**Repository:** https://github.com/OhapPyO/Linktree

---

## Core features (implemented)

- Authentication & user sessions (**Clerk**)
- Public profile page (username-based slug)
- Dashboard CRUD for links (create / edit / delete)
- Drag & drop ordering for links
- Profile customization stored in **Convex** (e.g., profile picture, bio/description, accent color)
- Billing page UI (Clerk `PricingTable` component)

---

## Architecture (high level)

**Client / UI (Next.js 15 + React + TypeScript)**
- App Router pages (public profile + authenticated dashboard)
- Forms + validation (react-hook-form + zod)
- UI components (Tailwind CSS + Radix primitives)

**Auth layer (Clerk)**
- Sign in / sign up
- User identity available to the app for per-user data isolation

**Backend (Convex)**
- Tables (example): `links`, `usernames`, `userCustomizations`
- Server functions: `links/*`, `usernames/*`, `customizations/*`
- Responsible for CRUD operations, ordering, and retrieving data for the UI

---

## Tech stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Auth + Billing UI:** Clerk (`@clerk/nextjs`)
- **Backend:** Convex (database + server functions)
- **UI / DX:** Radix UI, lucide-react, sonner, react-hook-form, zod

---

## Local development

### 1) Install dependencies
```bash
pnpm install
```

### 2) Environment variables
Create `.env.local` (do **not** commit secrets):

```bash
# Convex
CONVEX_DEPLOYMENT=dev:your-convex-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3) Run
```bash
pnpm dev
```

> Tip: Convex runs alongside Next.js during development (via `convex dev`).

---

## Notes for reviewers (Saxion)

- This repository is shared as a **portfolio sample** for Saxion “Home assignments”.
- Full source code + commit history are available via the repository link above.
- Secrets should remain in `.env.local` only (never commit keys).

---
 
