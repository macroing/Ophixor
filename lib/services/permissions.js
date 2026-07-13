// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

import { PLAN_FREE, PLAN_PERSONAL, PLAN_PRO, PLAN_PRO_GOLD, PLANS } from "@/definitions/plan-definitions";

export function can(permissions, resource, action) {
  const all = permissions["*"];

  if (typeof all === "boolean") {
    return all;
  }

  return permissions?.[resource]?.[action] === true;
}

export function getPermissions(platformUser, website) {
  if (!platformUser || !website) {
    return { "*": false };
  }

  if (platformUser.isPlatformAdmin) {
    return { "*": true };
  }

  const platformUserId = platformUser._id?.toString() || platformUser.toString();

  if ((website.owner?._id?.toString() || website.owner?.toString()) === platformUserId) {
    return createPermissionsByPlan(platformUser);
  }

  const collaborator = website.collaborators.find((currentCollaborator) => (currentCollaborator?.platformUser?._id?.toString() || currentCollaborator?.platformUser?.toString()) === platformUserId);

  if (collaborator) {
    const permissions = collaborator.permissions || {};

    return {
      ...permissions,
      isCollaborator: true,
    };
  }

  return { "*": false };
}

export function isValid(permissions) {
  if (!isValidObject(permissions)) {
    return false;
  }

  if (!isValidObject(permissions.componentTemplate) || !isValidBoolean(permissions.componentTemplate.create) || !isValidBoolean(permissions.componentTemplate.delete) || !isValidBoolean(permissions.componentTemplate.read)) {
    return false;
  }

  if (!isValidObject(permissions.integration) || !isValidBoolean(permissions.integration.create) || !isValidBoolean(permissions.integration.delete) || !isValidBoolean(permissions.integration.read) || !isValidBoolean(permissions.integration.update)) {
    return false;
  }

  if (!isValidObject(permissions.media) || !isValidBoolean(permissions.media.create) || !isValidBoolean(permissions.media.delete) || !isValidBoolean(permissions.media.read)) {
    return false;
  }

  if (!isValidObject(permissions.model) || !isValidBoolean(permissions.model.create) || !isValidBoolean(permissions.model.delete) || !isValidBoolean(permissions.model.read) || !isValidBoolean(permissions.model.update)) {
    return false;
  }

  if (!isValidObject(permissions.modelData) || !isValidBoolean(permissions.modelData.create) || !isValidBoolean(permissions.modelData.delete) || !isValidBoolean(permissions.modelData.read) || !isValidBoolean(permissions.modelData.update)) {
    return false;
  }

  if (!isValidObject(permissions.page) || !isValidBoolean(permissions.page.create) || !isValidBoolean(permissions.page.delete) || !isValidBoolean(permissions.page.publish) || !isValidBoolean(permissions.page.read) || !isValidBoolean(permissions.page.update)) {
    return false;
  }

  if (!isValidObject(permissions.website) || !isValidBoolean(permissions.website.delete) || !isValidBoolean(permissions.website.updateAccessibility) || !isValidBoolean(permissions.website.updateAnalytics) || !isValidBoolean(permissions.website.updateCollaborators) || !isValidBoolean(permissions.website.updateInformation)) {
    return false;
  }

  return true;
}

function createPermissionsByPlan(platformUser) {
  const plan = PLANS.includes(platformUser?.plan) ? platformUser.plan : PLAN_FREE;

  const isPersonal = plan === PLAN_PERSONAL;
  const isPro = plan === PLAN_PRO;
  const isProGold = plan === PLAN_PRO_GOLD;

  return {
    componentTemplate: {
      create: isPersonal || isPro || isProGold,
      delete: isPersonal || isPro || isProGold,
      read: isPersonal || isPro || isProGold,
    },
    integration: {
      create: isProGold,
      delete: isProGold,
      read: isProGold,
      update: isProGold,
    },
    media: {
      create: isPersonal || isPro || isProGold,
      delete: isPersonal || isPro || isProGold,
      read: isPersonal || isPro || isProGold,
    },
    model: {
      create: isPro || isProGold,
      delete: isPro || isProGold,
      read: isPro || isProGold,
      update: isPro || isProGold,
    },
    modelData: {
      create: isPro || isProGold,
      delete: isPro || isProGold,
      read: isPro || isProGold,
      update: isPro || isProGold,
    },
    page: {
      create: isPersonal || isPro || isProGold,
      delete: isPersonal || isPro || isProGold,
      publish: isPersonal || isPro || isProGold,
      read: isPersonal || isPro || isProGold,
      update: isPersonal || isPro || isProGold,
    },
    website: {
      delete: isPersonal || isPro || isProGold,
      updateAccessibility: isPersonal || isPro || isProGold,
      updateAnalytics: isPersonal || isPro || isProGold,
      updateCollaborators: isProGold,
      updateInformation: isPersonal || isPro || isProGold,
      updateTheme: isPersonal || isPro || isProGold,
    },
  };
}

function isValidBoolean(value) {
  return typeof value === "boolean";
}

function isValidObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function mergePermissions(permissionsByPlan, permissions) {
  const mergedPermissions = {};

  Object.entries(permissionsByPlan).forEach(([resourceName, resource]) => {
    mergedPermissions[resourceName] = {};

    Object.entries(resource).forEach(([actionName, isAllowed]) => {
      mergedPermissions[resourceName][actionName] = isAllowed === true && permissions?.[resourceName]?.[actionName] === true;
    });
  });

  return mergedPermissions;
}
