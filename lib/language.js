// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function findLanguage(headersList) {
  const acceptLanguage = headersList?.get?.("accept-language");

  if (typeof acceptLanguage !== "string" || !acceptLanguage) {
    return "en";
  }

  const candidates = acceptLanguage
    .split(",")
    .map((candidate) => candidate.trim())
    .filter(Boolean)
    .map((candidate) => {
      const [tag, ...rest] = candidate.split(";").map((part) => part.trim());

      const qualityPart = rest.find((part) => part.startsWith("q="));

      const quality = qualityPart ? Number(qualityPart.slice(2)) : 1;

      return { tag, quality: Number.isFinite(quality) ? quality : 0 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of candidates) {
    const tagLowerCase = tag.toLowerCase();

    if (tagLowerCase.startsWith("sv")) {
      return "sv";
    }

    if (tagLowerCase.startsWith("en")) {
      return "en";
    }
  }

  return "en";
}
