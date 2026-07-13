// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { Server } from "socket.io";
import { getToken } from "next-auth/jwt";

import connect from "@/lib/database";
import PlatformUser from "@/models/PlatformUser";
import WebsitePage from "@/models/WebsitePage";
import WebsiteUser from "@/models/WebsiteUser";
import { equals } from "@/lib/web-page-builder/transform/core/equals";
import { WEBSITE_PAGE_DEMO } from "@/context/website-page-demo";

export default async function handler(req, res) {
  if (res.socket.server.io) {
    return res.status(200).json({
      message: "Socket already running!",
    });
  }

  await connect();

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    cors: {
      origin: "*",
    },
  });

  res.socket.server.io = io;

  const connections = new Map();
  const dataContainer = new Map();

  io.use(async (socket, next) => {
    try {
      const token = await getToken({
        req: socket.request,
        secret: process.env.JWT_SECRET,
      });

      socket.platformUserId = token?.platformUser?._id?.toString() ?? null;

      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    connections.set(socket.id, {
      socketId: socket.id,
      platformUserId: socket.platformUserId,
      websitePageId: null,
      websiteId: null,
      websiteUserId: null,
    });

    socket.on("initialize", async (payload = {}) => {
      try {
        const websitePageId = payload.websitePageId ?? null;

        const websiteUserId = payload.websiteUserId ?? null;

        let websitePage = null;
        let websiteUser = null;

        if (websitePageId) {
          if (websitePageId === WEBSITE_PAGE_DEMO._id) {
            websitePage = WEBSITE_PAGE_DEMO;
          } else {
            websitePage = await WebsitePage.findById(websitePageId).select("_id website").lean(true).exec();
          }
        }

        if (websiteUserId) {
          websiteUser = await WebsiteUser.findById(websiteUserId).select("_id website").lean(true).exec();
        }

        const state = connections.get(socket.id);

        if (!state) {
          return;
        }

        if (state?.websiteId) {
          socket.leave(`website:${state.websiteId}`);

          if (state.websiteUserId) {
            socket.leave(`website:${state.websiteId}:user:${state.websiteUserId}`);
          }
        }

        const websiteId = websitePage?.website?._id?.toString() ?? websitePage?.website?.toString() ?? null;

        if (websiteUser && websiteUser.website?.toString() !== websiteId) {
          return;
        }

        state.websiteId = websiteId;
        state.websitePageId = websitePage?._id?.toString() ?? null;
        state.websiteUserId = websiteUser?._id?.toString() ?? null;

        if (state.websiteId) {
          socket.join(`website:${state.websiteId}`);

          if (state.websiteUserId) {
            socket.join(`website:${state.websiteId}:user:${state.websiteUserId}`);
          }
        }

        socket.emit("initialized", {
          success: true,
        });

        if (state.websiteId) {
          const currentData = dataContainer.get(`website:${state.websiteId}`);

          if (Array.isArray(currentData)) {
            socket.emit("dataInitialize", currentData);
          }
        }
      } catch (error) {
        console.error(error);

        socket.emit("error", {
          message: "Initialization failed!",
        });
      }
    });

    socket.on("broadcast", (data) => {
      try {
        const state = connections.get(socket.id);

        if (!state?.websiteId) {
          return;
        }

        io.to(`website:${state.websiteId}`).emit("broadcast", data);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("dataAdd", (data) => {
      try {
        const state = connections.get(socket.id);

        if (!state?.websiteId) {
          return;
        }

        const room = `website:${state.websiteId}`;

        let currentData = dataContainer.get(room);

        if (Array.isArray(currentData)) {
          currentData.push(data);
        } else {
          currentData = [];
          currentData.push(data);

          dataContainer.set(room, currentData);
        }

        io.to(room).emit("dataAdd", data);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("dataClear", () => {
      try {
        const state = connections.get(socket.id);

        if (!state?.websiteId) {
          return;
        }

        const room = `website:${state.websiteId}`;

        let currentData = dataContainer.get(room);

        if (Array.isArray(currentData)) {
          currentData.length = 0;
        }

        io.to(room).emit("dataClear");
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("dataRemove", (data) => {
      try {
        const state = connections.get(socket.id);

        if (!state?.websiteId) {
          return;
        }

        const room = `website:${state.websiteId}`;

        let currentData = dataContainer.get(room);

        if (Array.isArray(currentData)) {
          for (let i = currentData.length - 1; i >= 0; i--) {
            const currentDataInstance = currentData[i];

            if (equals(currentDataInstance, data)) {
              currentData.splice(i, 1);
            }
          }
        }

        io.to(room).emit("dataRemove", data);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);

      connections.delete(socket.id);
    });

    socket.on("emit", (room, data) => {
      try {
        const state = connections.get(socket.id);

        if (!state?.websiteId) {
          return;
        }

        if (typeof room !== "string" || !room.trim()) {
          return;
        }

        const safeRoom = room.trim();

        if (!/^[a-zA-Z0-9:_-]+$/.test(safeRoom)) {
          return;
        }

        io.to(`website:${state.websiteId}:${safeRoom}`).emit("emit", data);
      } catch (error) {
        console.error(error);
      }
    });
  });

  return res.status(200).json({
    message: "Socket server started!",
  });
}
