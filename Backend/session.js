import session from "express-session";
import MongoStore from 'connect-mongo';

export default session({
    secret: "supersecreate",
    resave:false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://127.0.0.1:27017/chating",
        collectionName: 'sessions',
        ttl: 14 *24 *60 *60
    }),
    cookie: {
        httpOnly:true,
        secure:false,
        maxAge: 14 *24 *60 *60*1000

    }
})