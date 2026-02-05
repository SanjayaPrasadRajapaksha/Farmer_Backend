import express from "express";
import Economic_CenterController from "../controllers/economic_center_location.controller.js";

const router = express.Router();
router.post("/create", Economic_CenterController.create);
router.put("/updateById/:id", Economic_CenterController.updateById);
router.get("/getAll", Economic_CenterController.getAll);
router.get("/getById/:id", Economic_CenterController.findById);
router.delete("/deleteById/:id", Economic_CenterController.deleteById);

export default router;