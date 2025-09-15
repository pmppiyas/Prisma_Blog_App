import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { PostRouter } from "../modules/post/post.route";
import { AuthRouter } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/post",
    route: PostRouter,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
