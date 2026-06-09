# CyberSys Architecture

## Overview

CyberSys is an AI-powered estate management platform designed to demonstrate full-stack engineering, backend system design, AI workflow integration, and cloud deployment readiness.

The platform is built around a monorepo structure that separates the frontend, backend, AI services, infrastructure, and documentation while keeping the project easy to run, review, and deploy.

---

## High-Level System Design

```
User
  |
  v
Next.js Client Application
  |
  v
Django REST Framework API
  |
  +--> PostgreSQL
  +--> Redis
  +--> Celery Workers
  +--> AI Assistant Services
```

---

## Application Layers

### Frontend Layer

The frontend is built with Next.js and React. It provides:

- Tenant profile pages
- Issue creation and tracking
- Staff issue management
- AI triage interface
- Reports and posts
- Role-based user experience

### Backend Layer

The backend is built with Django and Django REST Framework. It handles:

- Authentication
- User profiles
- Apartment management
- Issue workflows
- Reports
- Ratings
- Notifications
- AI workflow orchestration

### AI Services Layer

The AI services layer is responsible for:

- Maintenance issue triage
- AI-generated summaries
- Staff recommendations
- Emergency detection
- Future RAG-powered property assistance

### Data Layer

CyberSys uses PostgreSQL as the primary relational database for:

- Users
- Profiles
- Apartments
- Issues
- Reports
- Ratings
- AI triage records

### Queue and Cache Layer

**Redis** supports:

- Celery task queue
- Caching
- Short-lived workflow state
- Background processing

**Celery** supports:

- Email notifications
- Future AI background processing
- Report workflows
- Scheduled tasks

---

## Monorepo Strategy

CyberSys currently uses a monorepo structure:

```
Estate-Management-API/
├── client/
├── config/
├── core_apps/
├── docker/
├── docs/
├── infrastructure/
├── requirements/
├── README.md
└── local.yml
```

This keeps the project easy to review as a complete AI engineering system while still separating frontend, backend, documentation, and infrastructure concerns.

---

## Current Core Domains

### Users and Profiles

Manages authentication, user roles, profile data, occupations, reputation, and user identity.

### Apartments

Manages apartment units, buildings, tenants, and property relationships.

### Issues

Supports maintenance issue creation, tracking, assignment, updates, deletion, and staff workflows.

### Reports

Allows users to submit reports and view their report history.

### AI Assistant

Adds intelligent workflows on top of maintenance requests, starting with issue triage.

---

## AI Maintenance Triage Flow

```
Tenant creates issue
  |
  v
Issue is stored in PostgreSQL
  |
  v
AI triage endpoint receives issue ID
  |
  v
Backend retrieves Issue model
  |
  v
AI service analyzes title, description, priority, status, and apartment context
  |
  v
AI result is stored as an AITriageRequest
  |
  v
Frontend displays category, urgency, department, summary, and recommendation
```

---

## Scalability Path

### Stage 1 — Local Development

- Docker Compose
- Django API
- Next.js client
- PostgreSQL
- Redis
- Celery
- Mailpit
- Flower

### Stage 2 — MVP Deployment

- Vercel for frontend
- GCP Cloud Run or AWS EC2 for backend
- Managed PostgreSQL
- Managed Redis
- Object storage for uploads

### Stage 3 — Production SaaS

- Load-balanced API services
- Managed database replicas
- Dedicated worker services
- AI background jobs
- Observability stack
- Role-based multi-tenant architecture

---

## Engineering Value

CyberSys demonstrates:

- Full-stack SaaS architecture
- Django REST API design
- Next.js frontend architecture
- Redux Toolkit and RTK Query state management
- AI workflow integration
- Dockerized local development
- Redis and Celery background processing
- Cloud deployment planning
