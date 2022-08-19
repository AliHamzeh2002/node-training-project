const express = require('express');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {validate, User} = require("../models/user.js")
const auth = require("../middlewares/auth.js")
const router = express.Router();

router.get("/", async (req, res) => {
    const users = await User
                    .find()
                    .select("username age email -_id");
    res.send(users);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({$or:[{email: req.body.email},
                                 {username: req.body.username}]});
    if(user) return res.status(400).send("Email or Username Already Registered.");

    user = new User(_.pick(req.body, ["name", "username", "age", "email", "phoneNumber"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    await user.save();
    
    const token = user.generateAuthToken();
    res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
});

router.get("/me", auth, async(req, res) => {
    const user = await User
            .findById(req.user._id)
            .select("-password");
    res.send(user);
});

router.delete("/me", auth, async(req, res) => {
    const user = await User.findByIdAndDelete(req.user._id)
                            .select("-password");
    res.send(user);
});

router.put("/me", auth, async (req, res) => {
    let users = await User.find({$or:[{email: req.body.email}, {username: req.body.username}]});
    if (users.length > 1 || (users.length && users[0].id !== req.user._id))
        return res.status(400).send("Email or Username Already Used.");
    
    let updatedData = _.pick(req.body, ["name", "username", "age", "email", "phoneNumber"]);
    const salt = await bcrypt.genSalt(10);
    updatedData.password = await bcrypt.hash(req.body.password, salt);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {new: true})
    const token = updatedUser.generateAuthToken();
    res
        .header("x-auth-token", token)
        .send(_.pick(updatedUser, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
})

module.exports.router = router;

