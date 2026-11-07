# To-Do List

Mobile to-do app: create, edit, delete, and search tasks, grouped into Monday–Sunday weeks with open and completed counts.

- `backend/` — Express + Mongoose API
- `frontend/` — Vite, React, Tailwind, Zustand

## Local

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

`backend/.env`:

```
PORT=3002
MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.7rmlov4.mongodb.net/todoapp?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`frontend/.env`:

```
VITE_API_URL=http://localhost:3002
```

Open http://localhost:5173.

## MongoDB Atlas

Create a database user and network access rule, then set `MONGO_URI` to the Atlas connection string (`todoapp` database on `cluster0.7rmlov4.mongodb.net`).

## Uptime

`GET /health` (also `/ping` and `/api/health`) returns `200` so an uptime monitor can keep a free host awake. Point the bot at `https://<your-api-host>/health`.

## Deploy

`frontend/.env` and `backend/.env` are gitignored, including from the repo root. Only `.env.example` files are committed. Set real values in each host’s dashboard.

1. Push this folder as its own GitHub repo (`main`). Do not commit either `.env`.
2. Render: New Blueprint from that repo (`render.yaml`). Root directory is `backend`. Set `MONGO_URI` to the Atlas string and `CLIENT_ORIGIN` to the Netlify URL (use `*` until that URL exists). Health check is `GET /health`.
3. Atlas Network Access must allow the API host (`0.0.0.0/0` on Render’s free plan).
4. Netlify: import the same repo. Base `frontend`, build `npm run build`, publish `dist` (`netlify.toml`). Set `VITE_API_URL` to the Render origin with no trailing slash, then redeploy so Vite bakes it in.
5. Point the uptime bot at `https://<render-host>/health`.
