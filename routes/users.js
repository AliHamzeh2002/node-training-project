const express = require('express');
const _ = require("lodash");
const bcrypt = require("bcrypt");
const {validate, User} = require("../models/user.js")
const auth = require("../middlewares/auth.js")
const router = express.Router();

router.get("/", async (req, res) => {
    const users = await User
                    .find()
                    .select("username age email phoneNumber -_id");
    res.send(users);
});

router.get("/me", auth, async(req, res) => {
    console.log(req.user);
    const user = await User
            .findById(req.user._id)
            .select("-password");
    res.send(user);
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

router.delete("/:id", (req, res) => {
    const user = findUserById(req.params.id);
    if (!user) return res.status(404).send("User with given id doesn't exist!");

    const index = users.indexOf(user);
    users.splice(index, 1);
    res.send(user);
});

router.put("/:id", (req, res) => {
    const user = findUserById(req.params.id);
    if (!user) return res.status(404).send("User with given id doesn't exist!");

    const { error } = validateUser(req.body);
    if(error && error.details[0].type != "custom") return res.status(400).send(error.details[0].message);

    user.age = req.body.age;
    user.name = req.body.name;
    user.username = req.body.username;
    res.send(user);
})

module.exports.router = router;

