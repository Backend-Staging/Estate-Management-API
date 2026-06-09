# CyberSys Deployment Strategy

## Overview

CyberSys is designed to support local development, MVP cloud deployment, and future production scaling.

The recommended deployment path is:

```
Local Docker Compose
  |
  v
Vercel Frontend + Cloud Backend
  |
  v
Managed Database + Managed Redis
  |
  v
Production SaaS Infrastructure
```

---

## Local Development

The local environment uses Docker Compose.

### Services

- Django REST Framework API
- Next.js frontend
- PostgreSQL
- Redis
- Celery worker
- NGINX reverse proxy
- Mailpit
- Flower

### Start Local Stack

```bash
make build
```

or:

```bash
docker compose -f local.yml up --build
```

---

## MVP Deployment Recommendation

### Frontend

Deploy the Next.js client to **Vercel**.

```
client/ → Vercel
```

Recommended frontend domain:

`app.cybersys.example.com`

### Backend

Deploy Django API to either:

- GCP Cloud Run
- AWS EC2
- AWS ECS (later)

Recommended backend domain:

`api.cybersys.example.com`

### Database

Use managed PostgreSQL:

- GCP Cloud SQL
- AWS RDS

### Redis

Use managed Redis when moving past MVP:

- GCP Memorystore
- AWS ElastiCache

### Storage

Use object storage:

- GCP Cloud Storage
- Amazon S3

---

## Recommended MVP Architecture

```
User
  |
  v
Vercel Frontend
  |
  v
Cloud Backend API
  |
  +--> Managed PostgreSQL
  +--> Redis
  +--> Celery Worker
  +--> AI Provider API
```

---

## Environment Variables

### Backend

The backend should define:

```env
DJANGO_SECRET_KEY=
DJANGO_SETTINGS_MODULE=
DATABASE_URL=
REDIS_URL=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
CSRF_TRUSTED_ORIGINS=
AI_PROVIDER=
OPENAI_API_KEY=
GEMINI_API_KEY=
AI_MODEL=
```

### Frontend

The frontend should define:

```env
NEXT_PUBLIC_API_BASE_URL=
```

---

## Deployment Options

### Option 1 — GCP Cloud Run

Best for fast containerized deployment and autoscaling.

**Recommended for:**

- AI portfolio demo
- MVP
- Modern cloud-native deployment
- Low maintenance

### Option 2 — AWS EC2

Best for demonstrating infrastructure and server control.

**Recommended for:**

- DevOps portfolio
- Docker Compose deployment
- Manual NGINX/SSL setup
- Ansible automation later

### Option 3 — AWS Lightsail

Best for simple low-cost demos.

**Recommended for:**

- Small demos
- Simple deployments
- Budget-conscious testing

Not recommended for heavy production traffic.

---

## Future Production Architecture

```
Cloud Load Balancer
  |
  +--> API Container 1
  +--> API Container 2
  +--> Worker Container
  |
  +--> Managed PostgreSQL
  +--> Managed Redis
  +--> Object Storage
  +--> Monitoring
```

---

## Deployment Goals

CyberSys deployment should demonstrate:

- Frontend/backend separation
- Cloud-ready Docker architecture
- Managed database usage
- Environment-based configuration
- Secure secret handling
- Scalable AI workflow planning
