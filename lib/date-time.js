// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export function formatRelativeTime(dateInput, language = "en") {
  if (!dateInput) {
    return "";
  }

  const date = new Date(dateInput);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const isFuture = diffMs < 0;
  const diff = Math.abs(diffMs);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value;

  let unitEn;
  let unitSv;

  if (seconds < 60) {
    value = seconds;

    unitEn = "second";
    unitSv = "sekund";
  } else if (minutes < 60) {
    value = minutes;

    unitEn = "minute";
    unitSv = "minut";
  } else if (hours < 24) {
    value = hours;

    unitEn = "hour";
    unitSv = "tim";
  } else if (days < 30) {
    value = days;

    unitEn = "day";
    unitSv = "dag";
  } else if (days < 365) {
    value = months;

    unitEn = "month";
    unitSv = "månad";
  } else {
    value = years;

    unitEn = "year";
    unitSv = "år";
  }

  const pluralEn = value !== 1 ? "s" : "";
  const pluralSv = value !== 1 ? (unitSv === "sekund" || unitSv === "minut" || unitSv === "månad" ? "er" : unitSv === "tim" ? "mar" : unitSv === "dag" ? "ar" : "") : unitSv === "tim" ? "me" : "";

  if (isFuture) {
    if (language === "sv") {
      return `Om ${value} ${unitSv}${pluralSv}`;
    } else {
      return `In ${value} ${unitEn}${pluralEn}`;
    }
  }

  if (language === "sv") {
    return `${value} ${unitSv}${pluralSv} sedan`;
  } else {
    return `${value} ${unitEn}${pluralEn} ago`;
  }
}
