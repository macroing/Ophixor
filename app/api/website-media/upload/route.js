// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { createHash, randomUUID } from "crypto";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import sharp from "sharp";
//import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import Website from "@/models/Website";
import WebsiteMedia from "@/models/WebsiteMedia";
import { getToken } from "next-auth/jwt";

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

export const runtime = "nodejs";

/*
const s3 = new S3Client({
  region: "auto", // Krävs för Cloudflare R2, eller din AWS region (t.ex. 'eu-north-1')
  endpoint: process.env.S3_ENDPOINT, // Din unika moln-URL
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
*/

export async function POST(req) {
  try {
    await connect();

    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file");
    const websiteId = formData.get("websiteId");

    if (!file || file === "null") {
      return NextResponse.json({ message: "A file is required." }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(websiteId)) {
      return NextResponse.json({ message: "A website ID is required." }, { status: 400 });
    }

    const website = await Website.findById(websiteId).select("collaborators owner").lean(true).exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that ID could not be found." }, { status: 404 });
    }

    const permissions = getPermissions(currentPlatformUser, website);

    const canCreate = can(permissions, "media", "create");

    if (!canCreate) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    if (buffer.length > MAX_UPLOAD_SIZE) {
      return NextResponse.json({ message: "File too large" }, { status: 400 });
    }

    let type = "other";
    let mimeType = file.type || "application/octet-stream";
    let width = 0;
    let height = 0;
    let outputBuffer = buffer;
    let extension = "";

    try {
      const metadata = await sharp(buffer).metadata();

      type = "image";
      width = metadata.width || 0;
      height = metadata.height || 0;

      outputBuffer = await sharp(buffer).rotate().webp({ quality: 90 }).toBuffer();

      mimeType = "image/webp";
      extension = "webp";
    } catch {
      if (mimeType.startsWith("video/")) {
        type = "video";
        extension = mimeType.split("/")[1];
      } else if (mimeType.startsWith("audio/")) {
        type = "audio";
        extension = mimeType.split("/")[1];
      } else {
        extension = file.name.split(".").pop();
      }
    }

    const storageKey = `${randomUUID()}.${extension}`;

    //const storageKey = `${websiteId}/original/${randomUUID()}.${extension}`;

    /*
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: storageKey,
        Body: outputBuffer,
        ContentType: mimeType,
      })
    );
    */

    const uploadsRoot = path.resolve("uploads");
    const originalDir = path.join(uploadsRoot, websiteId.toString(), "original");

    await mkdir(originalDir, { recursive: true });

    const filePath = path.join(originalDir, storageKey);

    await writeFile(filePath, outputBuffer);

    const sanitizedFileName = sanitizeFileName(file.name);

    const websiteMedia = await WebsiteMedia.create({
      alt: sanitizedFileName,
      createdBy: currentPlatformUser._id,
      deletedAt: null,
      hash: generateHash(outputBuffer),
      height,
      mimeType,
      name: sanitizedFileName,
      size: outputBuffer.length,
      storageKey,
      type,
      variants: [],
      website: website._id,
      width,
    });

    return NextResponse.json({ id: websiteMedia._id, height, message: "The file has been successfully uploaded!", type, url: `/api/website-media/${websiteMedia._id}`, width }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function generateHash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function sanitizeFileName(name) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_ ]/g, "")
    .trim();
}
