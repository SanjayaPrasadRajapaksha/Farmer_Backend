import express from "express";
const router = express.Router();
import UserController from "../controllers/user.controller.js";

router.post("/registerCustomer", UserController.registerCustomer);//
router.post("/registerAdmin", UserController.registerAdmin);//
router.post("/login", UserController.userLogin);
router.post("/sendOTP", UserController.sendOTP);
router.post("/getUserByRole", UserController.getUserByRole);
router.put("/changeUserPasswordWithOTP", UserController.changeUserPasswordWithOTP);
router.put("/changePasswordByUserId/:id", UserController.changePasswordByUserId);//
router.put("/updateUserById/:id", UserController.updateUserById);
router.put("/verifyUserById/:id", UserController.verifyUserById);
router.put("/activateUserById/:id",  UserController.activateUserById);
router.get("/getAllUser", UserController.getAllUser);
router.get("/getUserById/:id", UserController.getUserById);
router.delete("/deleteUserById/:id", UserController.deleteUserById);


export default router;
