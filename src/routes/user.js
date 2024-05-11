import { Router } from "express";
import { getData, register, login } from "../controllers/auth.js";
import { validateUser } from "../helper/validator/user.validator.js";
const router = Router();

router.route("/data").get(getData); // For cronjob
router.route("/register").post(validateUser, register);
router.route("/login").post(login);

export default router;
