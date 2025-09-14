import { Router } from "express";
import { PostController } from "./post.controller";

const router = Router();

router.post("/create", PostController.createPost);

router.get("/", PostController.getAllPost);

router.get("/:id", PostController.getAPost);

router.put("/update/:id", PostController.updateAPost);

export const PostRouter = router;
