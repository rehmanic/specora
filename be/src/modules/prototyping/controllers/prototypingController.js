import asyncHandler from "../../../utils/asyncHandler.js";
import * as prototypingService from "../services/prototypingService.js";

// ─── Prototype CRUD ───────────────────────────────────────

export const getPrototypes = asyncHandler(async (req, res) => {
    const prototypes = await prototypingService.getPrototypes(req.params.projectId);
    res.json({ prototypes });
});

export const createPrototype = asyncHandler(async (req, res) => {
    const prototype = await prototypingService.createPrototype(req.params.projectId, req.body.name, req.body.description);
    res.status(201).json({ prototype });
});

export const updatePrototype = asyncHandler(async (req, res) => {
    const prototype = await prototypingService.updatePrototype(req.params.prototypeId, req.body);
    res.json({ prototype });
});

export const deletePrototype = asyncHandler(async (req, res) => {
    await prototypingService.deletePrototype(req.params.prototypeId);
    res.json({ message: "Prototype deleted" });
});

// ─── Screen CRUD ──────────────────────────────────────────

export const getScreens = asyncHandler(async (req, res) => {
    const screens = await prototypingService.getScreens(req.params.prototypeId);
    res.json({ screens });
});

export const createScreen = asyncHandler(async (req, res) => {
    const screen = await prototypingService.createScreen(req.params.prototypeId, req.body.name);
    res.status(201).json({ screen });
});

export const updateScreen = asyncHandler(async (req, res) => {
    const screen = await prototypingService.updateScreen(req.params.screenId, req.body);
    res.json({ screen });
});

export const deleteScreen = asyncHandler(async (req, res) => {
    await prototypingService.deleteScreen(req.params.screenId);
    res.json({ message: "Screen deleted" });
});

export const reorderScreens = asyncHandler(async (req, res) => {
    await prototypingService.reorderScreens(req.body.screenOrders);
    res.json({ message: "Screens reordered" });
});

// ─── Requirement Linking ──────────────────────────────────

export const getScreenRequirements = asyncHandler(async (req, res) => {
    const requirements = await prototypingService.getScreenRequirements(req.params.screenId);
    res.json({ requirements });
});

export const updateScreenRequirements = asyncHandler(async (req, res) => {
    const count = await prototypingService.updateScreenRequirements(req.params.screenId, req.body.requirement_ids);
    res.json({ message: "Requirements linked", count });
});
