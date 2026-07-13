// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import Website from "@/models/Website";
import WebsiteComponentTemplate from "@/models/WebsiteComponentTemplate";
import WebsiteIntegration from "@/models/WebsiteIntegration";
import WebsiteModel from "@/models/WebsiteModel";
import WebsiteModelData from "@/models/WebsiteModelData";
import WebsitePage from "@/models/WebsitePage";
import { MAXIMUM_WEBSITES, MAXIMUM_WEBSITE_COMPONENT_TEMPLATES, MAXIMUM_WEBSITE_INTEGRATIONS, MAXIMUM_WEBSITE_MODELS, MAXIMUM_WEBSITE_MODEL_DATAS, MAXIMUM_WEBSITE_PAGES, PLANS, PLAN_FREE, PLAN_FREE_MAXIMUM_WEBSITES, PLAN_FREE_MAXIMUM_WEBSITE_COMPONENT_TEMPLATES, PLAN_FREE_MAXIMUM_WEBSITE_INTEGRATIONS, PLAN_FREE_MAXIMUM_WEBSITE_MODELS, PLAN_FREE_MAXIMUM_WEBSITE_MODEL_DATAS, PLAN_FREE_MAXIMUM_WEBSITE_PAGES } from "@/definitions/plan-definitions";

export async function canCreateWebsite(currentPlatformUser) {
  if (!currentPlatformUser.isPlatformAdmin) {
    const plan = currentPlatformUser.plan;

    if (PLANS.includes(plan) || plan === null || plan === undefined) {
      const maximumWebsiteCount = MAXIMUM_WEBSITES[plan] ?? PLAN_FREE_MAXIMUM_WEBSITES;

      if (maximumWebsiteCount === 0) {
        return false;
      }

      if (maximumWebsiteCount >= Number.MAX_SAFE_INTEGER) {
        return true;
      }

      const websiteCount = await Website.countDocuments({ owner: currentPlatformUser._id });

      if (websiteCount >= maximumWebsiteCount) {
        return false;
      }
    }
  }

  return true;
}

export async function canCreateWebsiteComponentTemplate(currentPlatformUser, website) {
  if (currentPlatformUser.isPlatformAdmin) {
    return true;
  }

  const owner = website?.owner;

  if (!owner?._id || !website._id) {
    return false;
  }

  const plan = PLANS.includes(owner.plan) ? owner.plan : PLAN_FREE;

  const maximum = MAXIMUM_WEBSITE_COMPONENT_TEMPLATES[plan] ?? PLAN_FREE_MAXIMUM_WEBSITE_COMPONENT_TEMPLATES;

  if (maximum === 0) {
    return false;
  }

  if (maximum >= Number.MAX_SAFE_INTEGER) {
    return true;
  }

  const websiteComponentTemplateCount = await WebsiteComponentTemplate.countDocuments({
    website: website._id,
  });

  return websiteComponentTemplateCount < maximum;
}

export async function canCreateWebsiteIntegration(currentPlatformUser, website) {
  if (currentPlatformUser.isPlatformAdmin) {
    return true;
  }

  const owner = website?.owner;

  if (!owner?._id || !website._id) {
    return false;
  }

  const plan = PLANS.includes(owner.plan) ? owner.plan : PLAN_FREE;

  const maximum = MAXIMUM_WEBSITE_INTEGRATIONS[plan] ?? PLAN_FREE_MAXIMUM_WEBSITE_INTEGRATIONS;

  if (maximum === 0) {
    return false;
  }

  if (maximum >= Number.MAX_SAFE_INTEGER) {
    return true;
  }

  const websiteIntegrationCount = await WebsiteIntegration.countDocuments({
    website: website._id,
  });

  return websiteIntegrationCount < maximum;
}

export async function canCreateWebsiteModel(currentPlatformUser, website) {
  if (currentPlatformUser.isPlatformAdmin) {
    return true;
  }

  const owner = website?.owner;

  if (!owner?._id || !website._id) {
    return false;
  }

  const plan = PLANS.includes(owner.plan) ? owner.plan : PLAN_FREE;

  const maximum = MAXIMUM_WEBSITE_MODELS[plan] ?? PLAN_FREE_MAXIMUM_WEBSITE_MODELS;

  if (maximum === 0) {
    return false;
  }

  if (maximum >= Number.MAX_SAFE_INTEGER) {
    return true;
  }

  const websiteModelCount = await WebsiteModel.countDocuments({
    website: website._id,
  });

  return websiteModelCount < maximum;
}

export async function canCreateWebsiteModelData(currentPlatformUser, website, websiteModel) {
  if (currentPlatformUser.isPlatformAdmin) {
    return true;
  }

  const owner = website?.owner;

  if (!owner?._id || !website._id || !websiteModel?._id) {
    return false;
  }

  const plan = PLANS.includes(owner.plan) ? owner.plan : PLAN_FREE;

  const maximum = MAXIMUM_WEBSITE_MODEL_DATAS[plan] ?? PLAN_FREE_MAXIMUM_WEBSITE_MODEL_DATAS;

  if (maximum === 0) {
    return false;
  }

  if (maximum >= Number.MAX_SAFE_INTEGER) {
    return true;
  }

  const websiteModelDataCount = await WebsiteModelData.countDocuments({
    website: website._id,
    websiteModel: websiteModel._id,
  });

  return websiteModelDataCount < maximum;
}

export async function canCreateWebsitePage(currentPlatformUser, website) {
  if (currentPlatformUser.isPlatformAdmin) {
    return true;
  }

  const owner = website?.owner;

  if (!owner?._id || !website._id) {
    return false;
  }

  const plan = PLANS.includes(owner.plan) ? owner.plan : PLAN_FREE;

  const maximum = MAXIMUM_WEBSITE_PAGES[plan] ?? PLAN_FREE_MAXIMUM_WEBSITE_PAGES;

  if (maximum === 0) {
    return false;
  }

  if (maximum >= Number.MAX_SAFE_INTEGER) {
    return true;
  }

  const websitePageCount = await WebsitePage.countDocuments({
    website: website._id,
  });

  return websitePageCount < maximum;
}
