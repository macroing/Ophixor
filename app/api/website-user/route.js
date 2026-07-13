// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getToken } from "next-auth/jwt";
import isEmail from "validator/lib/isEmail";
import jwt from "jsonwebtoken";

import connect from "@/lib/database";
import { generateHtmlActivateAccount, generateSubjectActivateAccount, sendEmail } from "@/lib/email";
import { getWebsiteUser } from "@/lib/auth/getWebsiteUser";
import Website from "@/models/Website";
import WebsiteUser from "@/models/WebsiteUser";

export const runtime = "nodejs";

const IS_ACTIVATION_REQUIRED = false;

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;
    const currentWebsiteUser = await getWebsiteUser(req);

    const url = new URL(req.url);

    const websiteCode = url.searchParams.get("websiteCode");

    if (!websiteCode) {
      return NextResponse.json({ message: "A website code is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findOne({
      code: websiteCode.toLowerCase(),
    })
      .select("_id owner collaborators")
      .lean()
      .exec();

    if (!website) {
      return NextResponse.json({ message: "Website could not be found." }, { status: 404 });
    }

    const isPlatformAdmin = !!currentPlatformUser?.isPlatformAdmin;

    const isOwner = currentPlatformUser && String(website.owner) === String(currentPlatformUser._id);

    const isCollaborator = currentPlatformUser && website.collaborators?.some((c) => String(c.platformUser) === String(currentPlatformUser._id));

    const isWebsiteUser = currentWebsiteUser && String(currentWebsiteUser.website) === String(website._id);

    if (!(isPlatformAdmin || isOwner || isCollaborator || isWebsiteUser)) {
      return NextResponse.json(
        {
          message: "You do not have permission to perform this operation.",
        },
        { status: 403 },
      );
    }

    const skip = Number.parseInt(url.searchParams.get("skip")) || 0;

    const sort = url.searchParams.get("sort") || "createdAt";

    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const params = {
      website: website._id,
    };

    const select = "-passwordHash";

    const count = await WebsiteUser.countDocuments(params);

    const pageResults = doGetPageResults(req);
    const page = doGetPage(req, count);
    const pages = doGetPages(req, count);

    const websiteUsers = await WebsiteUser.find(params)
      .sort([[sort, sortOrder]])
      .limit(pageResults)
      .skip(skip + pageResults * page)
      .select(select)
      .lean()
      .exec();

    return NextResponse.json(
      {
        message: "Users could be found.",
        page: page + 1,
        pages,
        websiteUsers,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;
    const currentWebsiteUser = await getWebsiteUser(req);

    const data = await req.json();

    const { websiteCode, name, email, password, code } = data;

    if (typeof websiteCode !== "string") {
      return NextResponse.json({ message: "A website code is required." }, { status: 400 });
    }

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ message: "A name is required." }, { status: 400 });
    }

    if (typeof email !== "string") {
      return NextResponse.json({ message: "An e-mail is required." }, { status: 400 });
    }

    if (typeof password !== "string") {
      return NextResponse.json({ message: "A password is required." }, { status: 400 });
    }

    const emailTrimmed = email.trim();

    if (!isEmail(emailTrimmed)) {
      return NextResponse.json(
        {
          message: "A valid e-mail address is required.",
        },
        { status: 400 },
      );
    }

    const passwordTrimmed = password.trim();

    if (passwordTrimmed.length < 6) {
      return NextResponse.json(
        {
          message: "Your password must have at least 6 characters.",
        },
        { status: 400 },
      );
    }

    await connect();

    const website = await Website.findOne({
      code: websiteCode.toLowerCase(),
    }).exec();

    if (!website) {
      return NextResponse.json({ message: "Website could not be found." }, { status: 404 });
    }

    const isPlatformAdmin = !!currentPlatformUser?.isPlatformAdmin;

    const isOwner = currentPlatformUser && String(website.owner) === String(currentPlatformUser._id);

    const isCollaborator = currentPlatformUser && website.collaborators?.some((c) => String(c.platformUser) === String(currentPlatformUser._id));

    const isWebsiteSelf = currentWebsiteUser && String(currentWebsiteUser.website) === String(website._id);

    const isSelfRegistration = !currentPlatformUser && !currentWebsiteUser;

    if (!(isPlatformAdmin || isOwner || isCollaborator || isWebsiteSelf || isSelfRegistration)) {
      return NextResponse.json(
        {
          message: "You do not have permission to perform this operation.",
        },
        { status: 403 },
      );
    }

    const emailNormalized = emailTrimmed.toLowerCase();

    const existingWebsiteUser = await WebsiteUser.findOne({
      website: website._id,
      emailNormalized,
    })
      .select("_id")
      .lean()
      .exec();

    if (existingWebsiteUser) {
      return NextResponse.json(
        {
          message: "A user with that e-mail address already exists.",
        },
        { status: 400 },
      );
    }

    const codeTrimmed = typeof code === "string" ? (code.trim() === "" ? null : code.trim()) : null;

    if (typeof codeTrimmed === "string") {
      const existingWebsiteUserByCode = await WebsiteUser.findOne({
        website: website._id,
        code: codeTrimmed,
      })
        .select("_id")
        .lean()
        .exec();

      if (existingWebsiteUserByCode) {
        return NextResponse.json(
          {
            message: "A user with that code already exists.",
          },
          { status: 400 },
        );
      }
    }

    const passwordHash = await hash(passwordTrimmed, 12);

    const websiteUser = await WebsiteUser.create({
      website: website._id,
      code: codeTrimmed,
      name: name.trim(),
      email: emailTrimmed,
      emailNormalized,
      passwordHash,
    });

    if (IS_ACTIVATION_REQUIRED) {
      const activationToken = jwt.sign(
        {
          _id: websiteUser._id,
          website: website._id,
        },
        process.env.NEXTAUTH_SECRET,
        {
          expiresIn: "24h",
        },
      );

      websiteUser.activationToken = activationToken;

      await websiteUser.save();

      if (isSelfRegistration) {
        const attachments = [];

        const subject = generateSubjectActivateAccount();

        const html = generateHtmlActivateAccount(websiteUser, activationToken, attachments);

        if (subject && html) {
          await sendEmail(emailTrimmed, subject, html, attachments);
        }
      }
    } else {
      websiteUser.activatedAt = new Date();

      await websiteUser.save();
    }

    const output = websiteUser.toObject();

    delete output.passwordHash;
    delete output.activationToken;
    delete output.passwordResetToken;

    return NextResponse.json(
      {
        message: isSelfRegistration ? "Your user account was successfully created! An activation link has been sent to your e-mail address." : "The user account was successfully created.",
        websiteUser: output,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

function doGetPage(req, count) {
  /*
   * The external form of page is in the interval [1, N].
   * The internal form of page is in the interval [0, N).
   */

  const pageExternalDefault = 1;
  const pageExternalMaximum = doGetPages(req, count);
  const pageExternalMinimum = 1;

  let pageExternal = pageExternalDefault;

  const url = new URL(req.url);

  if (url.searchParams.get("page")) {
    pageExternal = parseInt(url.searchParams.get("page"), 10) || pageExternalDefault;
  }

  pageExternal = Math.max(pageExternal, pageExternalMinimum);
  pageExternal = Math.min(pageExternal, pageExternalMaximum);

  const pageInternal = pageExternal - 1;

  return pageInternal;
}

function doGetPages(req, count) {
  return Math.max(Math.ceil(count / doGetPageResults(req)), 1);
}

function doGetPageResults(req) {
  /*
   * The results for each page is in the interval [1, 250].
   */

  const pageResultsDefault = 50;
  const pageResultsMaximum = 250;
  const pageResultsMinimum = 1;

  let pageResults = pageResultsDefault;

  const url = new URL(req.url);

  if (url.searchParams.get("pageResults")) {
    pageResults = parseInt(url.searchParams.get("pageResults"), 10) || pageResultsDefault;
  }

  pageResults = Math.max(pageResults, pageResultsMinimum);
  pageResults = Math.min(pageResults, pageResultsMaximum);

  return pageResults;
}
