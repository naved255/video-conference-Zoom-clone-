import { Schema } from "mongoose";

let meetingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    meetingCode: {
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now,
        required:true
    }
})

export default meetingSchema;