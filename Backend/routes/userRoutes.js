import { Router } from "express";
import { userLogout, userSignupController } from "../controller/userModelController.js";
import passport from "passport";
import { userLogin } from "../controller/userModelController.js";
import { isLoggedIn } from "../middlewares.js";

const router = Router();

router.post('/signup', userSignupController);

router.get("/logout", isLoggedIn, userLogout);

router.post("/login", passport.authenticate('local', { failureMessage: true }), userLogin);

export default router;