//import repo from "./repository.js";
import { create, findAll, findById, update, remove } from "./repository.js";

export async function createFeedback(data) {
  return await repo.create(data);
}

export async function getAllFeedback() {
  return await repo.findAll();
}

export async function getFeedbackById(id) {
  return await repo.findById(id);
}

export async function updateFeedback(id, data) {
  return await repo.update(id, data);
}

export async function deleteFeedback(id) {
  return await repo.remove(id);
}
