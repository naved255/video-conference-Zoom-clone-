import { Router } from "express";
import { isLoggedIn } from "../middlewares.js";
import { getMeetingHistory, postMeetingHistory } from "../controller/meetingModelController.js";

const router = Router();

router.post('/', isLoggedIn, postMeetingHistory );

router.get('/', isLoggedIn, getMeetingHistory);

export default router