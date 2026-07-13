// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import io from "socket.io-client";

import { equals } from "@/lib/web-page-builder/transform/core/equals";
import { useWebsitePage } from "./website-page";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { websitePage } = useWebsitePage();

  const mountedRef = useRef(false);
  const socketRef = useRef(null);

  const [data, setData] = useState(null);
  const [dataArray, setDataArray] = useState([]);
  const [status, setStatus] = useState("Disconnected");

  const broadcast = useCallback((data) => {
    try {
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return;
      }

      const socket = socketRef.current;

      if (socket?.connected) {
        socket.emit("broadcast", data);
      }
    } catch (error) {}
  }, []);

  const dataAdd = useCallback(
    (data) => {
      try {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          return;
        }

        const socket = socketRef.current;

        if (socket?.connected) {
          socket.emit("dataAdd", data);

          setDataArray((oldDataArray) => [...oldDataArray, data]);
        }
      } catch (error) {}
    },
    [setDataArray],
  );

  const dataClear = useCallback(() => {
    try {
      const socket = socketRef.current;

      if (socket?.connected) {
        socket.emit("dataClear");

        setDataArray([]);
      }
    } catch (error) {}
  }, [setDataArray]);

  const dataRemove = useCallback(
    (data) => {
      try {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          return;
        }

        const socket = socketRef.current;

        if (socket?.connected) {
          socket.emit("dataRemove", data);

          setDataArray((oldDataArray) => {
            const newDataArray = [...oldDataArray];

            for (let i = newDataArray.length - 1; i >= 0; i--) {
              if (equals(newDataArray[i], data)) {
                newDataArray.splice(i, 1);
              }
            }

            return newDataArray;
          });
        }
      } catch (error) {}
    },
    [setDataArray],
  );

  const disconnect = useCallback(() => {
    const socket = socketRef.current;

    if (socket) {
      socket.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((room, data) => {
    try {
      if (typeof room !== "string") {
        return;
      }

      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return;
      }

      const socket = socketRef.current;

      if (socket?.connected) {
        socket.emit("emit", room, data);
      }
    } catch (error) {}
  }, []);

  const initialize = useCallback((websitePage, websiteUser = null) => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      return;
    }

    socket.emit("initialize", {
      websitePageId: websitePage?._id?.toString() ?? null,
      websiteUserId: websiteUser?._id?.toString() ?? null,
    });
  }, []);

  const connect = useCallback(async () => {
    try {
      if (!websitePage?.isSocketEnabled) {
        disconnect();

        return;
      }

      const existing = socketRef.current;

      if (existing?.connected) {
        return;
      }

      await fetch("/api/socket");

      if (!mountedRef.current) {
        return;
      }

      const socket = io({
        path: "/api/socket",
        autoConnect: true,
      });

      socket.on("connect", () => {
        setStatus("Connected");

        initialize(websitePage);
      });

      socket.on("broadcast", (data) => {
        setData({
          type: "broadcast",
          data,
        });
      });

      socket.on("dataAdd", (data) => {
        setData({
          type: "dataAdd",
          data,
        });
      });

      socket.on("dataClear", () => {
        setData({
          type: "dataClear",
          data,
        });
      });

      socket.on("dataInitialize", (data) => {
        setData({
          type: "dataInitialize",
          data,
        });
      });

      socket.on("dataRemove", (data) => {
        setData({
          type: "dataRemove",
          data,
        });
      });

      socket.on("disconnect", (reason) => {
        setStatus("Disconnected");

        setData({
          type: "disconnect",
          reason,
        });
      });

      socket.on("emit", (data) => {
        setData({
          type: "emit",
          data,
        });
      });

      socket.io.on("reconnect", () => {
        setStatus("Reconnecting");

        initialize(websitePage);

        setData({
          type: "reconnect",
        });
      });

      socket.on("initialized", () => {
        setData({
          type: "initialized",
        });
      });

      socket.on("error", (error) => {
        setData({
          type: "error",
          error,
        });
      });

      socketRef.current = socket;
    } catch (error) {
      setStatus("Disconnected");

      setData({
        type: "error",
        error,
      });
    }
  }, [disconnect, initialize, websitePage]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    if (websitePage?.isSocketEnabled && websitePage?.isSocketConnectingAutomatically) {
      connect();
    } else {
      disconnect();
    }
  }, [connect, disconnect, websitePage?._id]);

  useEffect(() => {
    if (data?.type === "dataAdd") {
      if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
        setDataArray((oldDataArray) => [...oldDataArray, data.data]);
      }
    } else if (data?.type === "dataClear") {
      setDataArray([]);
    } else if (data?.type === "dataInitialize") {
      if (Array.isArray(data?.data)) {
        setDataArray([...data.data]);
      }
    } else if (data?.type === "dataRemove") {
      if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
        setDataArray((oldDataArray) => {
          const newDataArray = [...oldDataArray];

          for (let i = newDataArray.length - 1; i >= 0; i--) {
            if (equals(newDataArray[i], data.data)) {
              newDataArray.splice(i, 1);
            }
          }

          return newDataArray;
        });
      }
    }
  }, [data]);

  const value = useMemo(
    () => ({
      broadcast,
      connect,
      dataAdd,
      dataArray,
      dataClear,
      dataRemove,
      disconnect,
      data,
      emit,
      setData,
      status,
      socket: socketRef.current,
    }),
    [broadcast, connect, dataAdd, dataArray, dataClear, dataRemove, disconnect, data, emit, status],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export function useSocket() {
  return useContext(SocketContext);
}
