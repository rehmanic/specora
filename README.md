# Specora

Specora is a modern, AI-assisted platform for Requirements Engineering, providing a seamless ecosystem for project management, real-time collaboration, and intelligent feedback.

## 🏗️ Architecture

Specora is built using a monorepo architecture, consisting of three main services:

- **[Frontend (fe)](./fe/README.md)**: A responsive Next.js dashboard featuring real-time chat, video conferencing (LiveKit), and AI integration.
- **[Backend (be)](./be/README.md)**: A robust Node.js/Express service managing business logic, authentication, and database interactions via Prisma.
- **[Norma (norma)](./norma/README.md)**: A Python-based RAG (Retrieval-Augmented Generation) engine for intelligent document processing and legal requirement analysis.

## 🚀 Getting Started

The easiest way to run the entire Specora stack is using **Docker Compose**.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18+)

### Setup & Run

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd specora
   ```

2. **Configure Environment Variables**:
   Consolidated configuration is managed within the service directories. Refer to the specific READMEs for details, but primarily:
   - Copy `be/.env.example` to `be/.env` and fill in credentials.
   - Copy `fe/.env.example` to `fe/.env`.
   - Copy `norma/.env.example` to `norma/.env`.

3. **Launch with Docker Compose**:
   ```bash
   docker compose up -d
   ```
   This will start the PostgreSQL database, Backend, Frontend, and Norma services in detached mode.

### Common Docker Commands

Here are some of the most useful Docker and Docker Compose commands for working with the Specora stack:

**Building & Running**
- `docker compose up -d` — Start all services in the background.
- `docker compose up --build -d` — Rebuild images and start all services (useful when you add new dependencies).
- `docker compose down` — Stop and remove all containers, networks, and volumes created by `up`.

**Viewing Logs**
- `docker compose logs -f` — View combined logs from all services in real-time.
- `docker logs -f specora-be` — View logs for the Backend service only.
- `docker logs -f specora-fe` — View logs for the Frontend service.
- `docker logs -f specora-norma` — View logs for the Norma (FastAPI) service.

**Accessing Containers**
- `docker exec -it specora-be sh` — Open an interactive shell inside the Backend container.
- `docker exec -it specora-db psql -U <your_postgres_user> -d <your_postgres_db>` — Access the PostgreSQL database CLI.


## 🛠️ Technology Stack

| Service | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15, Tailwind CSS 4, Radix UI, Zustand, Socket.io, LiveKit |
| **Backend** | Node.js, Express, Prisma (PostgreSQL), JWT, bcrypt |
| **Norma** | Python, Streamlit, FAISS, PyPDF2, Google Gemini |

## 📁 Repository Structure

```text
specora/
├── fe/         # Next.js Frontend
├── be/         # Express Backend
├── norma/      # AI RAG Engine
├── artifacts/  # Project-wide schemas and assets
└── README.md   # This file
```

## 📄 License

MIT
