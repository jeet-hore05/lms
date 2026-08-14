import { Router } from "express";
const router = Router();

import { contactUs } from "../controllers/miscellaneous.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

router.post("/contact", contactUs);

export default router;