import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/login", AuthController.loginByCredential);

router.post("/google", AuthController.googleLogin);

export const AuthRouter = router;
