const jwt = require("jsonwebtoken");
const config = require("config");
const {User} = require("../models/user");

async function auth(req, res, next){
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try{
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = await User.findById(decoded._id);
        if (!req.user)
            return res.status(404).send("User Not Found")
        next();
    }
    catch(err){
        return res.status(400).send("Invalid Token.");
    }
}

function isDeveloper(req, res, next){
    if (!req.user.isDeveloper)
        return res.status(403).send("Access Denied.");
    next();
}

exports.auth = auth;
exports.isDeveloper = isDeveloper;