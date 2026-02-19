# Specora Frontend

The frontend dashboard for **Specora**, a modern platform for communication, project management, and AI-driven collaboration. Built with Next.js 15 and powered by real-time technologies.

## 🚀 Features

- **Real-time Meetings**: Integrated video and audio conferencing powered by LiveKit.
- **Interactive Chat**: Real-time messaging with Socket.io, featuring emoji support and message history.
- **AI SpecBot**: Intelligent AI assistant integrated directly into the dashboard for workflow automation.
- **Project Management**: Tools for tracking projects, tasks, and team feedback.
- **Responsive Dashboard**: A premium, responsive UI featuring dark mode support and sleek animations.
- **Dynamic Surveys**: Built-in survey creation and management tools.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Real-time**: [Socket.io Client](https://socket.io/) & [LiveKit Client](https://livekit.io/)
- **Forms**: React Hook Form
- **Themes**: Next Themes

## 📁 Project Structure

```text
fe/
├── src/
│   ├── app/            # Next.js App Router (pages and layouts)
│   ├── components/     # Reusable UI components (shadcn/radix based)
│   ├── store/          # Zustand store for global state management
│   ├── hooks/          # Custom React hooks
│   ├── api/            # API client configurations
│   ├── utils/          # Helper functions and formatting utilities
│   └── lib/            # External library configurations
├── public/             # Static assets (images, icons)
└── components.json     # Radix/UI configuration
```

## 🚥 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ recommended for Next.js 15)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Navigate to the `fe` directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env` file based on the example:
```bash
cp .env.example .env
```
Key variables to configure:
- `NEXT_PUBLIC_API_URL`: The URL of your backend service.
- `NEXT_PUBLIC_LIVEKIT_URL`: Your LiveKit server WebSocket URL.

## 📜 Available Scripts

- `npm run dev`: Start the development server with Turbopack.
- `npm run build`: Create an optimized production build.
- `npm run prod`: Start the production server on port 4000.
- `npm run lint`: Run ESLint to check for code quality issues.

## 📄 License

MIT
