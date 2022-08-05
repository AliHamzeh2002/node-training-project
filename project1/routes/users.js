const express = require('express');
const Joi = require("joi");
const router = express.Router();

const users = [
    {id: 1, name:"ali", username:"admin", age:19}
];

let available_id = 2;

router.get("/", (req, res) => {
    res.send(users);
})

router.get("/:id", (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
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

module.exports = router;

