// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { mkdir, readdir, stat, unlink } from "fs/promises";
import sharp from "sharp";
//import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import WebsiteMedia from "@/models/WebsiteMedia";

const MAX_WIDTH = 2000;
const MIN_WIDTH = 50;
const MAX_QUALITY = 90;
const MIN_QUALITY = 40;

export const runtime = "nodejs";

/*
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
*/

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    if (!token?.platformUser?._id) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    const currentPlatformUser = token.platformUser;

    const isPlatformAdmin = currentPlatformUser.isPlatformAdmin;

    const awaitedParams = await params;

    const { id } = awaitedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "A valid media ID is required." }, { status: 400 });
    }

    await connect();

    const websiteMedia = await WebsiteMedia.findById(id).populate("website", "collaborators owner").exec();

    if (!websiteMedia || websiteMedia.deletedAt) {
      return NextResponse.json({ message: "Media for that ID could not be found." }, { status: 404 });
    }

    if (!websiteMedia.website) {
      return NextResponse.json({ message: "A website for the media could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, websiteMedia.website);

    const canDelete = can(permissions, "media", "delete");

    if (!canDelete) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const isWebsiteMediaOwner = currentPlatformUser._id.toString() === websiteMedia.createdBy?.toString();

    const isWebsiteOwner = currentPlatformUser._id.toString() === websiteMedia.website.owner?.toString();

    if (!isPlatformAdmin && !isWebsiteMediaOwner && !isWebsiteOwner) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    websiteMedia.deletedAt = new Date();

    await websiteMedia.save();

    /*
    s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: websiteMedia.storageKey
    })).catch(() => {});
    */

    deleteMediaFilesAsync(websiteMedia).catch(() => {});

    return NextResponse.json({ message: "Media marked as deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    const awaitedParams = await params;

    const { id } = awaitedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "A valid media ID is required." }, { status: 400 });
    }

    await connect();

    const websiteMedia = await WebsiteMedia.findById(id).populate("website", "owner status visibility").lean(true).exec();

    if (!websiteMedia || websiteMedia.deletedAt) {
      return NextResponse.json({ message: "Media for that ID could not be found." }, { status: 404 });
    }

    if (!websiteMedia.website) {
      return NextResponse.json({ message: "A website for the media could not be found." }, { status: 404 });
    }

    const isPublic = !["disabled", "draft"].includes(websiteMedia.website.status) && !["private", "unlisted"].includes(websiteMedia.website.visibility);
    const isPrivate = !isPublic;

    if (isPrivate) {
      const token = await getToken({ req });

      if (!token || !token.platformUser?._id) {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
      }

      const currentPlatformUser = token?.platformUser;

      const isPlatformAdmin = currentPlatformUser.isPlatformAdmin;
      const isWebsiteMediaOwner = currentPlatformUser._id.toString() === websiteMedia.createdBy?.toString();
      const isWebsiteOwner = currentPlatformUser._id.toString() === websiteMedia.website.owner?.toString();

      if (!isPlatformAdmin && !isWebsiteMediaOwner && !isWebsiteOwner) {
        return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
      }
    }

    const url = new URL(req.url);

    const w = parseInt(url.searchParams.get("w"));
    const q = parseInt(url.searchParams.get("q"));

    const safeWidth = Number.isInteger(w) ? Math.min(Math.max(w, MIN_WIDTH), MAX_WIDTH) : null;

    const safeQuality = Number.isInteger(q) ? Math.min(Math.max(q, MIN_QUALITY), MAX_QUALITY) : 80;

    /*
    let s3Object;

    try {
      s3Object = await getS3File(websiteMedia.storageKey);
    } catch (error) {
      return NextResponse.json({ message: "The media file could not be found in storage." }, { status: 404 });
    }

    const cacheHeader = isPublic ? "public, max-age=31536000, immutable" : "private, no-store";

    if (websiteMedia.type === "image" && safeWidth) {
      const chunks = [];

      for await (const chunk of s3Object.Body) {
        chunks.push(chunk);
      }

      const originalBuffer = Buffer.concat(chunks);

      const variantBuffer = await sharp(originalBuffer)
        .resize({ width: safeWidth, withoutEnlargement: true })
        .webp({ quality: safeQuality })
        .toBuffer();

      return new NextResponse(variantBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Content-Length": variantBuffer.length.toString(),
          "Cache-Control": cacheHeader,
        },
      });
    }

    if ((websiteMedia.type === "audio" || websiteMedia.type === "video") && req.headers.get("range")) {
      const fileSize = s3Object.ContentLength;
      const range = req.headers.get("range");
      const parts = range.replace(/bytes=/, "").split("-");
      const startRaw = parseInt(parts[0], 10);
      const endRaw = parts[1] ? parseInt(parts[1], 10) : null;

      if (Number.isNaN(startRaw)) {
        return new NextResponse(null, { status: 416 });
      }

      const start = Math.max(0, startRaw);
      const end = endRaw !== null && !Number.isNaN(endRaw) ? Math.min(endRaw, fileSize - 1) : fileSize - 1;

      if (start >= fileSize || end < start) {
        return new NextResponse(null, { status: 416 });
      }

      const rangeResponse = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: websiteMedia.storageKey,
          Range: `bytes=${start}-${end}`,
        })
      );

      return new NextResponse(rangeResponse.Body, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": (end - start + 1).toString(),
          "Content-Type": websiteMedia.mimeType,
          "Cache-Control": cacheHeader,
        },
      });
    }

    return new NextResponse(s3Object.Body, {
      status: 200,
      headers: {
        "Content-Type": websiteMedia.mimeType,
        "Content-Length": s3Object.ContentLength.toString(),
        "Cache-Control": cacheHeader,
      },
    });
    */

    const uploadsRoot = path.resolve("uploads");

    const safeStorageKey = path.basename(websiteMedia.storageKey);

    const originalPath = path.join(uploadsRoot, websiteMedia.website._id.toString(), "original", safeStorageKey);

    if (!fs.existsSync(originalPath)) {
      return NextResponse.json({ message: "The media file could not be found." }, { status: 404 });
    }

    if (websiteMedia.type === "image") {
      if (!safeWidth) {
        return streamFile(originalPath, websiteMedia.mimeType, isPublic);
      }

      const variantsDir = path.join(uploadsRoot, websiteMedia.website._id.toString(), "variants");

      await mkdir(variantsDir, { recursive: true });

      const baseName = path.parse(safeStorageKey).name;
      const variantName = `${baseName}-w-${safeWidth}-q-${safeQuality}.webp`;
      const variantPath = path.join(variantsDir, variantName);

      if (!fs.existsSync(variantPath)) {
        try {
          await sharp(originalPath).resize({ width: safeWidth, withoutEnlargement: true }).webp({ quality: safeQuality }).toFile(variantPath);
        } catch (error) {
          if (!fs.existsSync(variantPath)) {
            throw error;
          }
        }
      }

      return streamFile(variantPath, "image/webp", isPublic);
    }

    if (websiteMedia.type === "audio" || websiteMedia.type === "video") {
      return streamWithRange(req, originalPath, websiteMedia.mimeType, isPublic);
    }

    return streamFile(originalPath, websiteMedia.mimeType, isPublic);
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

async function deleteMediaFilesAsync(websiteMedia) {
  try {
    const uploadsRoot = path.resolve("uploads");

    const websiteId = websiteMedia.website._id.toString();

    const safeStorageKey = path.basename(websiteMedia.storageKey);

    const originalPath = path.join(uploadsRoot, websiteId, "original", safeStorageKey);

    await safeUnlink(originalPath);

    if (websiteMedia.type === "image") {
      const variantsDir = path.join(uploadsRoot, websiteId, "variants");

      const baseName = path.parse(safeStorageKey).name;

      try {
        const files = await readdir(variantsDir);

        for (const file of files) {
          if (file.startsWith(baseName)) {
            await safeUnlink(path.join(variantsDir, file));
          }
        }
      } catch {}
    }
  } catch (error) {}
}

/*
async function getS3File(storageKey) {
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: storageKey,
    })
  );

  return response;
}
*/

async function safeUnlink(filePath) {
  try {
    await unlink(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }

    if (error.code === "EBUSY") {
      await new Promise((res) => setTimeout(res, 300));

      try {
        await unlink(filePath);
      } catch {}

      return;
    }
  }
}

async function streamFile(filePath, contentType, isPublic) {
  const stream = fs.createReadStream(filePath);
  const { size } = await stat(filePath);
  const cacheHeader = isPublic ? "public, max-age=31536000, immutable" : "private, no-store";

  stream.on("end", () => stream.close());
  stream.on("error", () => stream.destroy());

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": size.toString(),
      "Cache-Control": cacheHeader,
    },
  });
}

async function streamWithRange(req, filePath, contentType, isPublic) {
  const fileSize = (await stat(filePath)).size;
  const range = req.headers.get("range");
  const cacheHeader = isPublic ? "public, max-age=31536000, immutable" : "private, no-store";

  if (!range) {
    return streamFile(filePath, contentType, isPublic);
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const startRaw = parseInt(parts[0], 10);
  const endRaw = parts[1] ? parseInt(parts[1], 10) : null;

  if (Number.isNaN(startRaw)) {
    return new NextResponse(null, { status: 416 });
  }

  const start = Math.max(0, startRaw);
  const end = endRaw !== null && !Number.isNaN(endRaw) ? Math.min(endRaw, fileSize - 1) : fileSize - 1;

  if (start >= fileSize || end < start) {
    return new NextResponse(null, { status: 416 });
  }

  const chunkSize = end - start + 1;
  const stream = fs.createReadStream(filePath, { start, end });

  stream.on("end", () => stream.close());
  stream.on("error", () => stream.destroy());

  return new NextResponse(stream, {
    status: 206,
    headers: {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": contentType,
      "Cache-Control": cacheHeader,
    },
  });
}
