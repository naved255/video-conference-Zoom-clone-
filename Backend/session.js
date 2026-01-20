import session from "express-session";
import MongoStore from "connect-mongo";

const isProduction = process.env.NODE_ENV === "production";

export default session({
    name: "vc-session",
    secret: process.env.superSecrete,
    resave: false,
    saveUninitialized: false, // do not save empty sessions
    store: MongoStore.create({
        mongoUrl: process.env.mongoUrl,
        collectionName: "sessions",
        ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
        httpOnly: true,
        secure: true, // only true in production
        sameSite: "none",
        maxAge: 14 * 24 * 60 * 60 * 1000,
    },
});
