import mongoose from "mongoose";
import meetingSchema from "../schema/meetingSchema.js";

const meetingModel = mongoose.model('meeting', meetingSchema);

export default meetingModel;