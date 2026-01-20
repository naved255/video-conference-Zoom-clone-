import userModel from "../models/userModel.js";


export const userSignupController = async (req, res) => {
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
}

export const userLogout = (req, res) => {
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
}

export const userLogin = async (req, res) => {
    try {
        console.log(req.user);
        res.status(200).json({ status: true, message: "user is logged in", username: req.user?.username });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: "something went wrong in db" });
    }
}