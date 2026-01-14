import { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
    name: {
        type:String,
        required:true
    },
})

userSchema.plugin(passportLocalMongoose.default);

export default userSchema;