# 🛡️ FRAUDOPS — Real-Time Fraud Operations & Cyber-Intelligence Simulator

<div align="center">

![FraudOps Banner](public/favicon.ico)

**Detect. Explain. Respond. Measure.**

*A high-stakes, real-time cyber fraud operations simulator with interactive graph forensics, dynamic themes, multiplayer co-op, and authoritative telemetry.*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19+-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python)](https://www.python.org)

</div>

---

## ⚡ Overview

**FraudOps** puts you in the hot seat of an elite financial crime investigation unit. Analyze velocity spikes, inspect spoofed device fingerprints, uncover clandestine node clusters in an interactive network graph, and make split-second operational decisions (`APPROVE`, `DECLINE`, `FREEZE`) to prevent capital loss and protect the network.

---

## ✨ Key Features

### 🔍 1. Real-Time Case Investigation
- **Live Threat Telemetry**: Evaluate risk scores, signal anomalies, spoofed User-Agents, and anomalous IPs.
- **Authoritative Backend Engine**: Server-driven ground truth validation with realistic response time penalties and streak multipliers.
- **Cryo-Freeze Protocol**: Secondary confirmation layer for freezing suspect accounts.

### 🕸️ 2. Interactive Network Graph Forensics
- **Topological Visualizer**: Interactive SVG node graph mapping transaction conduits, IP links, and target hubs.
- **Node Inspection**: Deep-dive telemetry inspection with classification badges, active conduit counts, and risk weighting.
- **Viewport Controls**: Pan, zoom, and reset graph viewport for complex entity structures.

### 👥 3. Real-Time Multiplayer Room Synchronizer
- **Lobby & Room System**: Create or join 4-letter operational rooms via WebSockets.
- **Live Scoreboards**: Synchronized live player standings, active streak tracking, and collaborative case resolutions.

### 🏆 4. Global Ranking & Leaderboard (Archive)
- **Authoritative Leaderboard**: Real player persistence tracking highest scores, detection accuracy, average response latency, and total fraud capital prevented.

### 🎨 5. Dynamic Cyberpunk Interface & Theme Engine
- **Global Theme Matrix**: Seamlessly switch between **Miles** (Red / Neon Cyan), **Prowler** (Electric Violet / Acid Green), and **System** themes across all views.
- **Immersive Feedback**: Audio-visual animations triggered upon decision evaluation (`MILES_SUCCESS` / `PROWLER_FAILURE`).
- **Accessibility & Customization**: Adjustable UI brightness filter, Reduce Motion toggle, and configurable notification alerts.

### 🎵 6. Advanced Audio Architecture
- **Continuous Ambient Soundtrack**: Ambient background music during active investigation.
- **Dynamic Decision Ducking**: Background music ducks cleanly during decision feedback and seamlessly resumes on the next case.
- **Independent Audio Controls**: Separate toggles for *Background Music* and *Audio Protocols / Sound Effects*.

### 🔒 7. Secure Authentication & Password Recovery
- **PBKDF2-HMAC-SHA256**: Cryptographically salted and hashed user authentication.
- **Direct Password Reset**: Simplified, secure password reset without third-party email bottlenecks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS, React Router 7, Canvas / SVG Forensics |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, SQLAlchemy ORM, Pydantic V2 |
| **Real-Time** | WebSockets (Native ASGI WebSocket Manager) |
| **Database** | SQLite (Default) / PostgreSQL Compatible |
| **Audio Engine** | HTML5 Web Audio Singleton with smooth linear gain-fading |

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/Abhinandan-03/FraudOps.git
cd FraudOps
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Start FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API docs available at: `http://127.0.0.1:8000/docs`*

### 3. Frontend Setup
In a separate terminal:
```bash
# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend interface available at: `http://localhost:5173`*

---

## 🌐 Production Deployment Guide

### Deploying Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) → **New Web Service**.
2. Connect your GitHub repository: `Abhinandan-03/FraudOps`.
3. Configure settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL` = `sqlite:///./fraudops.db`
5. Deploy and copy your backend URL (e.g., `https://fraudops-backend.onrender.com`).

---

### Deploying Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project**.
2. Import `FraudOps`.
3. Configure settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://fraudops-backend.onrender.com` *(your Render backend URL)*
5. Click **Deploy**.

---

## 📂 Project Structure

```text
FraudOps/
├── backend/                  # FastAPI Application
│   ├── api/                  # REST & WebSocket Routers (auth, cases, alerts, leaderboard, multiplayer)
│   ├── database/             # SQLAlchemy Engine & Models
│   ├── schemas/              # Pydantic Schemas
│   ├── services/             # Case generation & scoring logic
│   ├── websocket/            # Multiplayer room management
│   ├── requirements.txt      # Python dependencies
│   └── main.py               # Application entry point
├── public/                   # Static assets & audio files
│   └── audio/                # Audio tracks (background & decision themes)
├── src/                      # React Frontend
│   ├── components/           # UI components, modals, toasts & animations
│   ├── contexts/             # Game, Theme, Settings & Notification Providers
│   ├── hooks/                # Multiplayer & custom hooks
│   ├── pages/                # Dashboard, Investigation, Network, Leaderboard, Login, Profile
│   ├── services/             # API client integration (fraudOpsApi.js)
│   ├── utils/                # Audio manager, auth helpers, network graph scoring
│   ├── App.jsx               # Route definitions
│   └── index.css             # Cyberpunk design system & custom CSS properties
├── vercel.json               # SPA routing rewrite rules for Vercel
└── package.json              # Node.js dependencies & scripts
```

---

## 📄 License

This project is open-source and available under the **MIT License**.
