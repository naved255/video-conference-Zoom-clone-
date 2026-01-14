
export const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        res.status(401).json({status:false, message: "unAuthorized"});
    }
    next();
}