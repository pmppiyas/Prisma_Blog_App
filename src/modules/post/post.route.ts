import { Router } from "express";
import { PostController } from "./post.controller";
import { multerUpload } from "../../config/multer";

const router = Router();

router.post("/create", multerUpload.single("file"), PostController.createPost);

router.get("/", PostController.getAllPost);

router.get("/:id", PostController.getAPost);

router.put("/update/:id", PostController.updateAPost);

router.delete("/delete/:id", PostController.deletePost);

export const PostRouter = router;
