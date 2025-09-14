import { Router } from "express";
import UserController from "./user.controller";

const router = Router();

router.post("/create", UserController.createUser);

router.get("/", UserController.getAllUsers);

router.get("/:id", UserController.getAuser);

router.put("/update/:id", UserController.updateUser);

router.delete("/delete/:id", UserController.deleteUser);

export const UserRoutes = router;
