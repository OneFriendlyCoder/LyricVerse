# Lyricsverse

Lyricsverse is a full-stack songwriting platform for creating, translating, and publishing lyrics across languages. The project combines a React frontend with a Django REST backend and PostgreSQL for persistence. It is designed around three main ideas: multilingual lyric writing, cultural context through lyric wiki annotations, and a verifier workflow for publishing submitted songs.

## Current Features

- User signup, login, logout, and profile management
- Cookie-based JWT authentication between the React app and Django API
- Song creation and author-owned draft management
- Submission flow from draft to pending review to published
- Verifier-only moderation views for pending songs
- Explore, dashboard, profile, contribution, and lyric wiki pages in the frontend
- PostgreSQL database setup through Docker Compose

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Tailwind CSS, Lucide icons
- Backend: Django 6, Django REST Framework, Simple JWT, django-cors-headers
- Database: PostgreSQL 15
- Environment management: `python-dotenv`

## Project Structure

```text
.
├── backend/
│   ├── api/                 # Models, serializers, auth, viewsets, routes
│   ├── config/              # Django settings and project URLs
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                 # Local backend environment variables (not committed)
├── frontend/
│   ├── src/components/      # Shared UI components
│   ├── src/pages/           # App pages
│   ├── src/utils/           # API constants and shared values
│   └── package.json
├── docker-compose.yml       # PostgreSQL service
└── README.md
```

## App Flow

The current app supports two roles:

- `user`: can sign up, log in, create songs, manage their own drafts, and submit songs for review
- `verifier`: can review pending songs and approve them for publication

Song lifecycle:

```text
DRAFT -> PENDING -> PUBLISHED
```

## API Overview

Base URL:

```text
http://localhost:8000/api/
```

Available routes from the current backend:

- `POST /api/user/signup/` - create a new user
- `POST /api/user/login/` - log in and set JWT cookies
- `POST /api/user/logout/` - clear auth cookies
- `GET /api/user/profile/` - fetch logged-in user profile
- `PUT/PATCH /api/user/profile/` - update logged-in user profile
- `GET /api/song/` - list songs available to the current user
- `POST /api/song/` - create a new song draft
- `POST /api/song/{id}/submit/` - submit a draft for verification
- `GET /api/song/pending/` - list pending songs for verifiers
- `POST /api/song/{id}/approve/` - approve a pending song

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Project
```

### 2. Start PostgreSQL with Docker

The root `docker-compose.yml` only starts the database service.

```bash
docker-compose up -d
```

To stop it:

```bash
docker-compose down
```

### 3. Create backend environment variables

Created backend with various environment variables. 

### 4. Set up the Django backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend will run at:

```text
http://localhost:8000
```

### 5. Set up the React frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

## Authentication

- The backend uses JWT tokens stored in HTTP-only cookies
- Frontend requests should use `withCredentials: true` when calling protected endpoints
- CORS is configured for local frontend development on ports `5173` and `3000`

## Database

- Django is configured to use PostgreSQL only
- Database credentials are loaded from `backend/.env`
- Docker Compose creates a persistent volume named `postgres_data`



