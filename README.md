# Estate-Management-API

## Overview

This project is a full-stack web application designed as a tenant portal for apartment complexes. It enables tenants to:
- Report issues and maintenance problems
- Monitor the status of their requests and events
- Communicate with property management
- View important updates and notifications

The backend is built with Django and Django REST Framework, while the frontend is a Next.js application. The system is containerized using Docker for easy local development and deployment.

## Features
- User authentication and profile management
- Issue and maintenance request tracking
- Event and announcement monitoring
- Ratings, reports, and feedback
- Admin and staff dashboards
- Email notifications

## Requirements
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Python 3.12](https://www.python.org/downloads/release/python-3120/) (for direct backend development)
- [Node.js 18+](https://nodejs.org/) and [npm](https://www.npmjs.com/) (for direct frontend development)

## Quick Start (with Docker)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Real-estate/estate-mngt/api
   ```

2. **Copy and configure environment variables:**
   - Copy `.env.example` to `.envs/.env.local` and fill in required values (DB credentials, secret keys, etc).

3. **Start all services:**
   ```bash
   make build
   # or
   make up
   ```
   This will start the backend API, frontend client, PostgreSQL, Redis, Mailpit, Celery workers, and Nginx (reverse proxy).

4. **Access the application:**
   - Frontend: [http://localhost:8080](http://localhost:8080) (proxied by Nginx)
   - API: [http://localhost:8000](http://localhost:8000)
   - Mailpit (test email): [http://localhost:8025](http://localhost:8025)
   - Flower (Celery monitoring): [http://localhost:5555](http://localhost:5555)

## Development (without Docker)

### Backend (Django)
1. Install Python 3.12 and PostgreSQL.
2. Create and activate a virtual environment:
   ```bash
   python3.12 -m venv venv
   source venv/bin/activate
   pip install -r requirements/base.txt
   ```
3. Configure environment variables (see `.env.example`).
4. Run migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend (Next.js)
1. Go to the client directory:
   ```bash
   cd client
   npm install
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Useful Makefile Commands
- `make build` - Build and start all containers
- `make up` - Start all containers
- `make down` - Stop all containers
- `make makemigrations` - Run Django makemigrations
- `make migrate` - Run Django migrations
- `make superuser` - Create Django superuser
- `make show-logs` - Show all logs

## Project Structure
- `core_apps/` - Django apps (users, apartments, issues, posts, profiles, ratings, reports, etc.)
- `client/` - Next.js frontend
- `docker/` - Docker and service configuration
- `config/` - Django project settings

## About
This portal is designed to streamline communication and management for apartment complexes, making it easy for tenants to report problems, track progress, and stay informed about community events and updates.

---

For more details, see the documentation in each subdirectory or contact the project maintainer.
