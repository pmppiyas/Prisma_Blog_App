import { Router } from "express";
import UserController from "./user.controller";

const router = Router();

router.post("/create", UserController.createUser);

router.get("/all", UserController.getAllUsers);

router.get("/:id", UserController.getAuser);

export const UserRoutes = router;
