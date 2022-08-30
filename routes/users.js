const express = require('express');
const _ = require("lodash");
const auth = require("../middlewares/auth")
const paginate = require("../middlewares/paginate");
const userService = require("../services/user");
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    try{
        const users = await userService.getAllUsers(req);
        res.send(users);
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

router.post("/", async (req, res) => {
    try{
        const {user, token} = await userService.signUpUser(req);
        res.header("x-auth-token", token)
           .send(_.pick(user, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
});

router.post("/login", async(req, res) => {
    try{
        const {token} = await userService.loginUser(req);
        res.header("x-auth-token", token)
            .send("Login successful.");
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
});

router.get("/:id", auth, async(req, res) => {
    try{
        const user = await userService.getOneUser(req);
        res.send(user);
    }
    catch(err){
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        res.status(500).send(err.message);
    }
});

router.delete("/:id", auth, async(req, res) => {
    try{
        const user = await userService.deleteUser(req);
        res.send(user);
    }
    catch(err){
        if (err.name === "permissionError")
            return res.status(403).send(err.message);
        res.status(500).send(err.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try{
        const {user, token} = await userService.updateUser(req);
        res.header("x-auth-token", token)
            .send(_.pick(user, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
})

module.exports.router = router;

