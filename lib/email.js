// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import nodemailer from "nodemailer";

import EmailGenerator from "./email-generator";

export function generateHtmlActivateAccount(platformUser, activationToken, attachments) {
  if (!platformUser || !platformUser._id || !activationToken || !Array.isArray(attachments)) {
    return "";
  }

  const baseUrlOriginal = process.env.NEXTAUTH_URL;
  const baseUrl = baseUrlOriginal.replace(/^(.+?:\/\/[^/]+).*$/, "$1");

  const websiteImageAlt = process.env.NEXT_PUBLIC_PLATFORM_NAME;
  const websiteImageCid = `website-image@${process.env.NEXT_PUBLIC_PLATFORM_URL_SHORT}`;
  const websiteImageUrl = toAbsoluteImageUrl("/images/logo.webp");
  const websiteName = process.env.NEXT_PUBLIC_PLATFORM_NAME;

  const title = `Activate your account at ${websiteName}`;
  const titleHeader = `Activate your account at ${websiteName}`;

  const greeting = "Hi!";

  const messageA = "You have to activate your account before you can use it.";
  const messageB = "To activate your account press on the button below.";

  const buttonHref = `${baseUrl}/activate/${activationToken}`;
  const buttonText = "Activate your account";

  const emailGenerator = new EmailGenerator(title);

  emailGenerator.addH3(titleHeader, true);
  emailGenerator.addImg(`cid:${websiteImageCid}`, websiteImageAlt);
  emailGenerator.addH1(greeting);
  emailGenerator.addP(messageA);
  emailGenerator.addP(messageB);
  emailGenerator.addA(buttonHref, buttonText, true, "40px");

  attachments.push({
    cid: websiteImageCid,
    filename: "website-image" + getImageExtension(websiteImageUrl),
    path: websiteImageUrl,
  });

  return emailGenerator.toHTML();
}

export function generateSubjectActivateAccount() {
  return `Activate your account at ${process.env.NEXT_PUBLIC_PLATFORM_NAME}`;
}

export async function sendEmail(to, subject, html, attachments = [], from = null) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.E_MAIL_HOSTNAME,
      port: 465,
      secure: true,
      auth: {
        user: process.env.E_MAIL_USERNAME,
        pass: process.env.E_MAIL_PASSWORD,
      },
    });

    transport.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    const message = {
      attachments,
      from: from ? from : process.env.E_MAIL_FROM,
      to,
      subject,
      text: subject,
      html,
    };

    await transport.sendMail(message);

    return true;
  } catch (error) {
    console.log(error.message);

    return false;
  }
}

function getImageExtension(imageUrl) {
  return imageUrl.indexOf(".") >= 0 ? "." + imageUrl.split(".").pop() : "";
}

function toAbsoluteImageUrl(imageUrl) {
  if (imageUrl && imageUrl.startsWith("/api/files/")) {
    return imageUrl.replace("/api/files/", "./uploads/");
  } else if (imageUrl && imageUrl.startsWith("/images/")) {
    return imageUrl.replace("/images/", "./public/images/");
  } else {
    return "./public/images/logo.webp";
  }
}
