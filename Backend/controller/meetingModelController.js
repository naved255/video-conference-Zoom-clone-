import meetingModel from '../models/meetingModel.js'

export const postMeetingHistory = async (req, res) => {
    try {
       console.log('hitted')
       let {meetingCode} = req.body;
       console.log(meetingCode);
       let meeting = new meetingModel({userId: req.user?._id, meetingCode:meetingCode});
       await meeting.save();

       res.status(200).json({status:true, message:"history created"});

    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:'something went wrong'});
    }
}

export const getMeetingHistory = async (req, res) => {
    try {
       let history = await meetingModel.find({userId: req.user?._id});
       console.log(history);
       res.status(200).json({status:true, message:"history send", data:history}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:'something went wrong'});
    }
}