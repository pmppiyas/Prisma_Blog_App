import { Router } from "express";
import { PostController } from "./post.controller";

const router = Router();

router.post("/create", PostController.createPost);

router.get("/", PostController.getAllPost);

export const PostRouter = router;
