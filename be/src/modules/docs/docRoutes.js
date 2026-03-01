import express from "express";
const router = express.Router({ mergeParams: true });
import * as docController from "./docController.js";

router
    .route("/")
    .get(docController.getDocs)
    .post(docController.createDoc);

router
    .route("/:id")
    .get(docController.getDocById)
    .put(docController.updateDoc)
    .delete(docController.deleteDoc);

export default router;
