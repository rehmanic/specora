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
   This will start the PostgreSQL database, Backend, Frontend, and Norma services.

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
