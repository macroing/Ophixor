// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getToken } from "next-auth/jwt";
import isEmail from "validator/lib/isEmail";
import jwt from "jsonwebtoken";

import connect from "@/lib/database";
import { generateHtmlActivateAccount, generateSubjectActivateAccount, sendEmail } from "@/lib/email";
import Platform from "@/models/Platform";
import PlatformUser from "@/models/PlatformUser";
import { PLAN_FREE } from "@/definitions/plan-definitions";

export const runtime = "nodejs";

const IS_ACTIVATION_REQUIRED = true;

export async function GET(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    if (currentPlatformUser && !currentPlatformUser.isPlatformAdmin) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    const url = new URL(req.url);

    const skip = Number.parseInt(url.searchParams.get("skip")) || 0;
    const sort = url.searchParams.get("sort") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const select = "-passwordHash";

    const params = {};

    await connect();

    const platformUserCount = await PlatformUser.countDocuments(params);

    const pageResults = doGetPageResults(req);
    const page = doGetPage(req, platformUserCount);
    const pages = doGetPages(req, platformUserCount);

    const platformUsers = await PlatformUser.find(params)
      .sort([[sort, sortOrder]])
      .limit(pageResults)
      .skip(skip + pageResults * page)
      .select(select)
      .lean(true)
      .exec();

    return NextResponse.json({ message: "Users could be found.", page: page + 1, pages, platformUsers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req });

    const currentPlatformUser = token?.platformUser;

    const data = await req.json();

    const { email, password } = data;

    if (currentPlatformUser && !currentPlatformUser.isPlatformAdmin) {
      return NextResponse.json({ message: "You do not have permission to perform this operation." }, { status: 400 });
    }

    if (typeof email !== "string") {
      return NextResponse.json({ message: "An e-mail is required." }, { status: 400 });
    }

    const emailTrimmed = email.trim();

    if (!isEmail(emailTrimmed)) {
      return NextResponse.json({ message: "A valid e-mail address is required." }, { status: 400 });
    }

    if (typeof password !== "string") {
      return NextResponse.json({ message: "A password is required." }, { status: 400 });
    }

    const passwordTrimmed = password.trim();

    if (passwordTrimmed.length < 6) {
      return NextResponse.json({ message: "Your password must have at least 6 characters." }, { status: 400 });
    }

    const emailNormalized = emailTrimmed.toLowerCase();

    await connect();

    const existingPlatformUserByEmail = await PlatformUser.findOne({ emailNormalized }).select("_id").lean(true).exec();

    if (existingPlatformUserByEmail) {
      return NextResponse.json({ message: "A user with that e-mail address already exists." }, { status: 400 });
    }

    const platform = await Platform.findOne({}).select("defaultPlan").lean(true).exec();

    const plan = platform?.defaultPlan || PLAN_FREE;

    const platformUserCount = await PlatformUser.countDocuments({}).exec();

    const isPlatformAdmin = platformUserCount === 0 ? true : false;

    const passwordHash = await hash(passwordTrimmed, 12);

    const platformUser = await PlatformUser.create({ email: emailTrimmed, emailNormalized, isPlatformAdmin, passwordHash, plan });

    if (platformUser) {
      if (IS_ACTIVATION_REQUIRED) {
        const activationToken = jwt.sign({ _id: platformUser._id }, process.env.NEXTAUTH_SECRET, {
          expiresIn: "24h",
        });

        platformUser.activationToken = activationToken;

        await platformUser.save();

        if (!currentPlatformUser) {
          const attachments = [];

          let subject = generateSubjectActivateAccount();
          let html = generateHtmlActivateAccount(platformUser, activationToken, attachments);

          if (html && subject) {
            await sendEmail(emailTrimmed, subject, html, attachments);
          }
        }
      } else {
        platformUser.activatedAt = new Date();

        await platformUser.save();
      }

      delete platformUser.activationToken;
      delete platformUser.passwordHash;
      delete platformUser.passwordResetToken;

      return NextResponse.json({ message: !currentPlatformUser ? "Your user account was successfully created! An activation link has been sent to your e-mail address." : "The user account was successfully created.", platformUser }, { status: 200 });
    } else {
      return NextResponse.json({ message: !currentPlatformUser ? "Your user account could not be created!" : "The user account could not be created." }, { status: 400 });
    }
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
