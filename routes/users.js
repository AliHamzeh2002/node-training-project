const express = require('express');
const {validate, User} = require("../models/user.js")
const router = express.Router();

router.get("/", async (req, res) => {
    console.log(1111);
    const users = await User
                    .find()
                    .select("name username age");
    res.send(users);
});

router.get("/:id", (req, res) => {
    const user = findUserById(req.params.id);
    if (!user)  return res.status(404).send("User with given id doesn't exist!");
    res.send(user);
})

router.post("/", (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const user = {id: available_id,
                name: req.body.name,
                username: req.body.username,
                age: req.body.age
    };
    available_id++;
    users.push(user);
    res.send(user);

})

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

function uniqueUsername(value, helper){
    const isUsernameUnique = users.find(u => value === u.username);
    if (isUsernameUnique)  return helper.message("username is not unique");
    return value;
}

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        username: Joi.string().min(3).required().custom(uniqueUsername),
        age: Joi.number().integer().greater(10).required(),
    });
    return schema.validate(user);
}

function findUserById(id){
    return users.find(u => u.id === parseInt(id));
}

module.exports.router = router;
module.exports.findUserById = findUserById;

