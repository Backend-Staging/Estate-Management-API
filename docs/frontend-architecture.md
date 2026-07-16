# CyberSys Frontend Architecture

## Overview

The CyberSys frontend is built with Next.js and React. It is designed as a role-based SaaS interface for tenants, agents, repair staff, and future administrators.

The frontend communicates with the Django REST Framework backend through Redux Toolkit Query.

---

## Frontend Stack

- Next.js
- React
- TypeScript
- Redux Toolkit
- RTK Query
- Tailwind CSS / utility classes
- Component-based UI architecture

---

## State Management Strategy

CyberSys uses:

```
Redux Toolkit → client/application state
RTK Query     → API data fetching, caching, loading, and error states
```

### Redux Toolkit Handles

- Auth state
- UI state
- Filters
- Local dashboard state

### RTK Query Handles

- User profile data
- Issues
- Assigned issues
- Reports
- Posts
- AI triage requests

---

## Role-Based UI Rules

### Tenant

Tenants can:

- View their profile
- Create maintenance issues
- View their own issues
- Edit/delete their own issues when allowed
- View their reports
- Use AI issue triage on their own issues

Tenants should not call the assigned issues endpoint.

### Agent

Agents can:

- View managed apartment issues
- View assigned issues when applicable
- Update issue status
- Manage apartment workflows

### Repair Staff

Repair staff can:

- View issues assigned to them
- Update assigned issue progress
- Use AI staff recommendations

---

## Profile Page Tab Rules

The profile page should render tabs based on user role.

**All users:**

- About
- Posts
- My Issues
- My Reports

**Agent / Repair only:**

- Assigned Issues

**Important rule:**

Do not mount `AssignedIssues` for tenants.

This prevents unauthorized `/issues/assigned/` API calls and avoids repeated 403 errors.

---

## AI Frontend Integration

The AI triage UI is displayed on the issue detail page.

| Layer | Location |
|-------|----------|
| Component | `client/src/components/ai/MaintenanceTriagePanel.tsx` |
| RTK Query slice | `client/src/lib/redux/features/ai/aiApiSlice.ts` |

### User Flow

```
User opens issue detail
  |
  v
User clicks Run AI Triage
  |
  v
Frontend calls AI triage endpoint
  |
  v
Backend analyzes issue
  |
  v
Frontend displays AI result
```

---

## Recommended Frontend Structure

```
client/src/
├── app/
├── components/
│   ├── ai/
│   ├── cards/
│   ├── forms/
│   ├── profile/
│   ├── shared/
│   └── ui/
├── lib/
│   └── redux/
│       ├── features/
│       ├── hooks/
│       ├── provider.tsx
│       └── store.ts
├── types/
└── utils/
```

---

## Frontend Engineering Value

This frontend demonstrates:

- Role-based rendering
- API cache management
- Protected routes
- Component-driven UI
- Frontend/backend separation
- AI workflow integration
- Production-style state management

---


