// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";

import connect from "@/lib/database";
import { can, getPermissions } from "@/lib/services/permissions";
import WebsiteComponentTemplate from "@/models/WebsiteComponentTemplate";

export const runtime = "nodejs";

export async function DELETE(req, { params }) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (!currentPlatformUser) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    const awaitedParams = await params;

    const websiteComponentTemplateId = awaitedParams.websiteComponentTemplateId;

    if (!mongoose.Types.ObjectId.isValid(websiteComponentTemplateId)) {
      return NextResponse.json({ message: "A valid component template ID is required." }, { status: 400 });
    }

    await connect();

    const websiteComponentTemplate = await WebsiteComponentTemplate.findById(websiteComponentTemplateId).select("createdBy website").populate("website", "collaborators owner").exec();

    if (!websiteComponentTemplate) {
      return NextResponse.json({ message: "A component template for that ID could not be found." }, { status: 404 });
    }

    if (!websiteComponentTemplate.website) {
      return NextResponse.json({ message: "The website associated with that component template could not be found." }, { status: 404 });
    }

    const website = websiteComponentTemplate.website;

    const permissions = getPermissions(currentPlatformUser, website);

    const canDelete = can(permissions, "componentTemplate", "delete");

    if (!canDelete) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 403 });
    }

    await WebsiteComponentTemplate.deleteOne({ _id: websiteComponentTemplate._id }).exec();

    return NextResponse.json({ message: "The component template has been successfully deleted.", websiteComponentTemplate }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
