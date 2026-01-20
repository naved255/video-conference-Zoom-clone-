import session from "express-session";
import MongoStore from 'connect-mongo';

export default session({
    secret: `${process.env.superSecrete}`,
    resave:false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `${process.env.mongoUrl}`,
        collectionName: 'sessions',
        ttl: 14 *24 *60 *60
    }),
    cookie: {
        httpOnly:true,
        secure:true,
        sameSite:'none',
        maxAge: 14 *24 *60 *60*1000

    }
})