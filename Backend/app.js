import express, { urlencoded } from 'express'
import mongoose from 'mongoose';
import userModel from './models/userModel.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from './session.js';
import {isLoggedIn} from './middlewares.js'

const port = 3000;
const app = express();

app.use(session)

app.use(express.urlencoded({extended:true}));

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
        let {name, username, password} = req.body;
        let user = new userModel({name:name, username:username});
        let registered = await userModel.register(user, password);
        console.log("user registered");
        req.logIn(registered, (err) => {
            if(err) console.log(err);
            res.status(200).json({status:true, message:"User registered successfully"});
        })
    } catch (error) {
        console.log("error in db: ",error);
        res.status(500).json({status:false, message:"Something went wrong in db"});
    }
})

app.get("/user/logout", isLoggedIn, async (req, res) => {
    try {
        req.logOut((err) => {
            if(err) {
                console.log(err);
                res.status(500).json({status:false, message:"failed to logout"});
            }

            res.status(200).json({status:true, message:"user logout successfully"});
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:'user logout failed'});
    }
})

app.post("/user/login", passport.authenticate('local'),async (req, res) => {
    try {
        console.log(req.user);
        res.status(200).json({status:true, message:"user is logged in", username:req.user?.username});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:false, message:"something went wrong in db"});
    }
})

app.listen(port, () => {
    console.log(`backend running on port ${port}\nClick http://localhost:3000`);
})