import mongoose from "mongoose";
import userSchema from "../schema/userSchema.js";

const userModel = mongoose.model('user', userSchema);

export default userModel;