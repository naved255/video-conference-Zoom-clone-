import express from 'express'
import mongoose from 'mongoose';
import userModel from './models/userModel.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from './session.js';
import { isLoggedIn } from './middlewares.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import {createServer} from "node:http"
import { Server } from 'socket.io';
import createSocketConnection from './socketManager.js'
import meetingModel from './models/meetingModel.js'

const port = 3000;  
const app = express();

let server = createServer(app);
let io = createSocketConnection(server);


app.use(session)
app.use(cors({
    credentials:true,
    origin: ["http://localhost:5173"]
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


const mongoUrl = "mongodb://127.0.0.1:27017/chating";

const conn = mongoose.connect(mongoUrl).then(() => console.log("db connected"));

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.post('/user/signup', async (req, res) => {
    try {
        console.log(req.body.form);
        let { name, username, password } = req.body.form;


        let findUser = await userModel.findOne({username:username});
        if(findUser) {
            console.log('user exist');
            return res.status(402).json({status:false, message:"user already exist"});
        }

        let user = new userModel({ name: name, username: username });
        let registered = await userModel.register(user, password);
        console.log("user registered");
        req.logIn(registered, (err) => {
            if (err) console.log(err);
            res.status(200).json({ status: true, message: "User registered successfully" });
        })
    } catch (error) {
        console.log("error in db: ", error);
        res.status(500).json({ status: false, message: "Something went wrong in db" });
    }
})

app.get('/isAuth', isLoggedIn, async (req, res) => {
    try {
        res.status(200).json({status:true, message:"user exist and logged in", username:req.user?.username});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:"user not exist or something went wrong"});
    }
})

app.get("/user/logout", isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .json({ status: false, message: "failed to logout" });
        }

        return res
            .status(200)
            .json({ status: true, message: "user logout successfully" });
    });
});

app.post("/user/history", isLoggedIn, async (req, res) => {
    try {
        console.log("hitted")
       let {meetingCode} = req.body;
       console.log(meetingCode);
       let meeting = new meetingModel({userId: req.user?._id, meetingCode:meetingCode});
       await meeting.save();

       res.status(200).json({status:true, message:"history created"});

    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:'something went wrong'});
    }
})

app.get("/user/history", isLoggedIn, async (req, res) => {
    try {
       let history = await meetingModel.find({userId: req.user?._id});
       console.log(history);
       res.status(200).json({status:true, message:"history send", data:history}); 
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:'something went wrong'});
    }
})


app.post("/user/login", passport.authenticate('local', { failureMessage: true }), async (req, res) => {
    try {
        console.log(req.user);
        res.status(200).json({ status: true, message: "user is logged in", username: req.user?.username });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "something went wrong in db" });
    }
})

server.listen(port, () => {
    console.log(`backend running on port ${port}\nClick http://localhost:3000`);
})