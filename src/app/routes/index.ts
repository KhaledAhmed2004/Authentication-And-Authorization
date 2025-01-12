import { Router } from "express";
import { UserRouter } from "../modules/user/user.routes";
import { AuthRoute } from "../modules/auth/auth.routes";
import { uploadRouter } from "../modules/upload/upload.routes";

const router = Router(); // Create a new Router instance

// Define paths and their route handlers
const moduleRoutes = [
  { path: "/user", route: UserRouter },
  { path: "/auth", route: AuthRoute },
  { path: "/upload", route: uploadRouter },
  // Add more routes as needed
];

// Add each route to the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router; // Export the router to be used in the main app
