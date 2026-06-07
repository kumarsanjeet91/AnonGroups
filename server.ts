import 'dotenv/config';
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { parse } from "cookie";
import mongoose from "mongoose";
import { connectToDatabase } from "./src/lib/db";
import { verifyJwt } from "./src/lib/jwt";
import { Group } from "./src/models/Group";
import { Message } from "./src/models/Message";
import { seedDefaultGroups } from "./src/server/seed";
import { isValidMessage, sanitizeMessage } from "./src/utils/validation";
import { createRateLimiter } from "./src/lib/rateLimit";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const messageLimiter = createRateLimiter({ windowMs: 60_000, max: 20 });

app.prepare().then(async () => {
  await connectToDatabase();
  await seedDefaultGroups();

  const httpServer = createServer(handler);
  const io = new Server(httpServer, {
    cors: { origin: false },
    path: "/socket.io"
  });

  io.use(async (socket, nextMiddleware) => {
    try {
      const rawCookie = socket.handshake.headers.cookie || "";
      const token = parse(rawCookie).anon_token;
      if (!token) {
        return nextMiddleware(new Error("Authentication required"));
      }
      const user = verifyJwt(token);
      socket.data.user = user;
      return nextMiddleware();
    } catch {
      return nextMiddleware(new Error("Invalid authentication"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-group", async (groupId: string) => {
      if (!mongoose.Types.ObjectId.isValid(groupId)) return;
      const group = await Group.exists({ _id: groupId });
      if (!group) return;
      socket.join(groupId);
      socket.data.groupId = groupId;
    });

    socket.on("leave-group", (groupId: string) => {
      if (!mongoose.Types.ObjectId.isValid(groupId)) return;
      socket.leave(groupId);
      if (socket.data.groupId === groupId) socket.data.groupId = undefined;
    });

    socket.on("send-message", async (payload: { groupId?: string; text?: string }, ack?: (response: unknown) => void) => {
      try {
        const user = socket.data.user as { userId: string; username: string };
        const groupId = payload?.groupId;
        const text = sanitizeMessage(payload?.text || "");

        if (!messageLimiter.check(user.userId)) {
          ack?.({ ok: false, error: "Message rate limit exceeded. Try again shortly." });
          return;
        }

        if (!groupId || !mongoose.Types.ObjectId.isValid(groupId) || !isValidMessage(text)) {
          ack?.({ ok: false, error: "Message must be 1-500 characters." });
          return;
        }

        const group = await Group.exists({ _id: groupId });
        if (!group) {
          ack?.({ ok: false, error: "Group not found." });
          return;
        }

        const message = await Message.create({
          groupId,
          userId: user.userId,
          username: user.username,
          text
        });

        const serialized = {
          _id: message._id.toString(),
          groupId: message.groupId.toString(),
          userId: message.userId.toString(),
          username: message.username,
          text: message.text,
          createdAt: message.createdAt.toISOString()
        };

        io.to(groupId).emit("new-message", serialized);
        ack?.({ ok: true });
      } catch {
        ack?.({ ok: false, error: "Unable to send message." });
      }
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`AnonGroups ready on http://localhost:${port}`);
  });
});
