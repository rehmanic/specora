//import repo from "./repository.js";
import { create, findAll, findById, update, remove } from "./repository.js";

export async function createFeedback(data) {
  return await create(data);
}

export async function getAllFeedback() {
  return await findAll();
}

export async function getFeedbackById(id) {
  return await findById(id);
}

export async function updateFeedback(id, data) {
  return await update(id, data);
}

export async function deleteFeedback(id) {
  return await remove(id);
}
