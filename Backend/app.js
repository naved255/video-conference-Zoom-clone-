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
import createSocketConnection from './socketManager.js'
import meetingRoutes from './routes/meetingRoutes.js'
import userRoutes from './routes/userRoutes.js'
import 'dotenv/config'

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


const mongoUrl = process.env.mongoUrl;

const conn = mongoose.connect(mongoUrl).then(() => console.log("db connected"));

app.get('/', (req, res) => {
    res.send("Hello world");
})

app.use('/user', userRoutes);
app.use('/user/meeting/history', meetingRoutes);

app.get('/isAuth', isLoggedIn, async (req, res) => {
    try {
        res.status(200).json({status:true, message:"user exist and logged in", username:req.user?.username});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:"user not exist or something went wrong"});
    }
})

server.listen(port, () => {
    console.log(`backend running on port ${port}\nClick http://localhost:3000`);
})