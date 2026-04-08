import express from "express";
import ContactController from "../controllers/contact.controller.js";

const router = express.Router();
router.post("/contactAdd", ContactController.contactAdd);
router.get("/getAllContact", ContactController.getAllContact);
router.delete("/deleteContactById/:id", ContactController.deleteContactById);
router.get("/getContactById/:id", ContactController.getContactById);


export default router;