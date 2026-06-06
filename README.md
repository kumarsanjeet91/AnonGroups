# AnonGroups

AnonGroups is a Phase 1 MVP for privacy-focused public group chat. Users register with only a username and password, join public rooms, and exchange real-time messages through Socket.IO.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- MongoDB Atlas or MongoDB local
- Mongoose
- Socket.IO
- JWT authentication in HttpOnly cookies
- bcryptjs password hashing
- ESLint

## Features

- Username/password registration with no email, phone, social login, analytics, ads, or tracking.
- JWT session cookies marked HttpOnly, SameSite=Lax, and Secure in production.
- Protected `/groups` and `/chat/[groupId]` routes.
- Default public groups: General, Technology, Programming, Gaming, Movies, Sports.
- Real-time room events: `join-group`, `leave-group`, `send-message`, `new-message`.
- Latest 100 messages loaded chronologically when opening a room.
- Message persistence in MongoDB.
- Registration, login, and messaging rate limits.
- Input validation and sanitization with React-rendered escaped message text.
- Responsive desktop, tablet, and mobile layouts.
- Dark mode with localStorage persistence and system preference default.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Set environment variables:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/anongroups
JWT_SECRET=replace-with-a-long-random-secret
NODE_ENV=development
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string.

4. Start MongoDB locally or ensure your Atlas cluster is reachable.

5. Run the app:

```bash
npm run dev
```

6. Open:

```text
http://localhost:3000
```

The app seeds default groups automatically when the groups collection is empty. You can also run:

```bash
npm run seed
```

## Project Structure

```text
src/
  app/                  Next.js App Router pages and API routes
  components/           Reusable UI components
  hooks/                React hooks for auth, socket, and dark mode
  lib/                  Database, JWT, auth cookie, and rate-limit utilities
  middleware/           Middleware export shim
  models/               Mongoose User, Group, and Message models
  server/               Seed logic used by API routes and custom server
  types/                Shared TypeScript DTOs
  utils/                Validation and sanitization helpers
scripts/
  seed.ts               Manual seed command
server.ts               Custom Next.js + Socket.IO server
```

## Commands

```bash
npm run dev      # Start local custom Next.js + Socket.IO server
npm run build    # Build for production
npm run start    # Start production server after build
npm run lint     # Run ESLint
npm run seed     # Seed default groups
```

## Production Deployment Checklist

- Set a strong `JWT_SECRET` using a secrets manager.
- Use MongoDB Atlas with network access restricted to deployment infrastructure.
- Set `NODE_ENV=production`.
- Serve over HTTPS so Secure cookies are enforced.
- Configure deployment platform WebSocket support for Socket.IO.
- Add persistent/shared rate limiting such as Redis before scaling horizontally.
- Add centralized logging without storing message content beyond operational need.
- Review MongoDB indexes and backups.
- Run `npm run build` and `npm run lint` in CI.
- Pin allowed origins if the deployment introduces cross-origin clients.
