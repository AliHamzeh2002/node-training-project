const express = require('express');
const _ = require("lodash");
const config = require("config");
const bcrypt = require("bcrypt");
const {validate, User} = require("../models/user")
const auth = require("../middlewares/auth")
const paginate = require("../middlewares/paginate");
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    const users = await User
                    .find()
                    .skip((req.query.page - 1) * req.query.size)
                    .limit(req.query.size)
                    .select("-password");
    res.send(users);
});

router.post("/", async (req, res) => {
    try{
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        
        user = new User(_.pick(req.body, ["name", "username", "age", "email", "phoneNumber"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);

        await user.save();
        
        const token = user.generateAuthToken();
        res.header("x-auth-token", token)
           .send(_.pick(user, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
});

router.get("/:id", auth, async(req, res) => {
    const user = await User
            .findById(req.params.id)
            .select("-password");
    res.send(user);
});

router.delete("/:id", auth, async(req, res) => {
    if (req.user._id !== req.params.id)
        return res.status(403).send("Access Denied");
    const user = await User.findByIdAndDelete(req.user._id)
                            .select("-password");
    res.send(user);
});

router.put("/:id", auth, async (req, res) => {
    try{
        let updatedData = _.pick(req.body, ["name", "username", "age", "email", "phoneNumber"]);
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(req.body.password, salt);

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {new: true})
        const token = updatedUser.generateAuthToken();
        res
            .header("x-auth-token", token)
            .send(_.pick(updatedUser, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
})

module.exports.router = router;

