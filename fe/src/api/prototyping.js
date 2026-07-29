import { api } from "./client";
import { PROTOTYPING } from "./endpoints";

// ─── Prototypes ───────────────────────────────────────────────

export const getPrototypes = (projectId) =>
  api.get(PROTOTYPING.PROTOTYPES(projectId));

export const createPrototype = (projectId, body) =>
  api.post(PROTOTYPING.PROTOTYPES(projectId), body);

export const updatePrototype = (prototypeId, body) =>
  api.put(PROTOTYPING.PROTOTYPE(prototypeId), body);

export const deletePrototype = (prototypeId) =>
  api.delete(PROTOTYPING.PROTOTYPE(prototypeId));

// ─── Screens ──────────────────────────────────────────────────

export const getScreens = (prototypeId) =>
  api.get(PROTOTYPING.SCREENS(prototypeId));

export const createScreen = (prototypeId, body) =>
  api.post(PROTOTYPING.SCREENS(prototypeId), body);

export const updateScreen = (screenId, body) =>
  api.put(PROTOTYPING.SCREEN(screenId), body);

export const deleteScreen = (screenId) =>
  api.delete(PROTOTYPING.SCREEN(screenId));

export const reorderScreens = (screenOrders) =>
  api.put(PROTOTYPING.REORDER_SCREENS, { screenOrders });

// ─── Requirement Linking ──────────────────────────────────────

export const getScreenRequirements = (screenId) =>
  api.get(PROTOTYPING.SCREEN_REQUIREMENTS(screenId));

export const updateScreenRequirements = (screenId, requirement_ids) =>
  api.put(PROTOTYPING.SCREEN_REQUIREMENTS(screenId), { requirement_ids });
