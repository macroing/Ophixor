// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { isEmail } from "validator";

import connect from "@/lib/database";
import Website from "@/models/Website";
import WebsiteUser from "@/models/WebsiteUser";

import { signWebsiteToken } from "@/lib/auth/website-token";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const data = await req.json();

    const { email, password, websiteCode } = data;

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ message: "An e-mail address and a password is required." }, { status: 400 });
    }

    const emailTrimmed = email.trim();

    if (!isEmail(emailTrimmed)) {
      return NextResponse.json({ message: "A valid e-mail address is required." }, { status: 400 });
    }

    const passwordTrimmed = password.trim();

    if (passwordTrimmed.length < 6) {
      return NextResponse.json({ message: "Your password must have at least 6 characters." }, { status: 400 });
    }

    if (!websiteCode) {
      return NextResponse.json({ message: "A website code is required." }, { status: 400 });
    }

    await connect();

    const website = await Website.findOne({
      code: websiteCode.toLowerCase(),
    })
      .select("_id")
      .lean()
      .exec();

    if (!website) {
      return NextResponse.json({ message: "A website for that code could not be found." }, { status: 404 });
    }

    const websiteUser = await WebsiteUser.findOne({
      website: website._id,
      emailNormalized: emailTrimmed.toLowerCase(),
    }).exec();

    if (!websiteUser) {
      return NextResponse.json({ message: "Your e-mail address and password are invalid." }, { status: 401 });
    }

    const validPassword = await compare(passwordTrimmed, websiteUser.passwordHash);

    if (!validPassword) {
      return NextResponse.json({ message: "Your e-mail address and password are invalid." }, { status: 401 });
    }

    if (!websiteUser.activatedAt) {
      return NextResponse.json({ message: "You need to activate your account." }, { status: 403 });
    }

    const token = signWebsiteToken({
      websiteId: website._id.toString(),
      websiteUserId: websiteUser._id.toString(),
    });

    const response = NextResponse.json({
      message: "You have been successfully logged in.",
      websiteUser: {
        _id: websiteUser._id,
        email: websiteUser.email,
        name: websiteUser.name,
      },
    });

    response.cookies.set("website_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch {
    return NextResponse.json({ message: "An unexpected error has occurred!" }, { status: 500 });
  }
}
