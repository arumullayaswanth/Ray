# Build context is the repo root: docker build -f app/docker/Dockerfile .
# ---------- Stage 1: build the React (Vite + TS) frontend ----------
FROM node:20-slim AS frontend
WORKDIR /ui
COPY app/frontend/package.json ./
# Use npm install (no lockfile committed); produces node_modules for the build.
RUN npm install
COPY app/frontend/ ./
# Vite outDir is "../backend/static"; from /ui that resolves to /backend/static.
RUN npm run build

# ---------- Stage 2: Ray Serve runtime ----------
FROM rayproject/ray:2.40.0-py311

WORKDIR /home/ray/app
COPY app/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/backend/app.py ./
# Bring in the built UI (index.html + assets/) from the frontend stage.
COPY --from=frontend /backend/static ./static

# Lets Ray Serve resolve import_path "app:app" on head and worker pods
ENV PYTHONPATH=/home/ray/app
