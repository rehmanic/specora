import * as service from "./service.js";

export async function createFeedback(req, res) {
  try {
    const { title, status, formJson } = req.body;
    const feedback = await service.createFeedback({ title, status, formJson });
    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllFeedback(req, res) {
  try {
    const data = await service.getAllFeedback();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getFeedbackById(req, res) {
  try {
    const data = await service.getFeedbackById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function updateFeedback(req, res) {
  try {
    const data = await service.updateFeedback(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function deleteFeedback(req, res) {
  try {
    await service.deleteFeedback(req.params.id);
    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
