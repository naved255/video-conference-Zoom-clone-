
export const isLoggedIn = (req, res, next) => {
     console.log("isAuthenticated:", req.isAuthenticated());
    if(!req.isAuthenticated()) {
       return res.status(401).json({status:false, message: "unAuthorized"});
    }
    next();
}