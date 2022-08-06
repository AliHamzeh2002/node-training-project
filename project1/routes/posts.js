const express = require('express');
const Joi = require("joi");
const findUserById = require("./users").findUserById;
const router = express.Router();

const posts = [
    {id: 1, title: "test post", text:"test content", userId: 1}
];

let available_id = 2;

router.get("/", (req, res) => {
    res.send(posts);
})

router.get("/:id", (req, res) => {
    const post = findPostById(req.params.id);
    if (!post)  return res.status(404).send("Post with given id doesn't exist!");
    res.send(post);
})

router.post("/", (req, res) => {
    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const post = {id: available_id,
                title: req.body.title,
                text: req.body.text,
                userId: req.body.userId
    };
    available_id++;
    posts.push(post);
    res.send(post);

})

router.put("/:id", (req, res) => {
    const post = findPostById(req.params.id);
    if (!post) return res.status(404).send("User with given id doesn't exist!");

    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if (post.userId !== req.body.userId)  return res.status(400).send("userId can't be changed");

    post.title = req.body.title;
    post.text = req.body.text;
    res.send(post);
})

function validatePost(user){
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        text: Joi.string().min(10).required(),
        userId: Joi.number().integer().required().custom((value , helper) => {
            if (!findUserById(value)) return helper.message("Username with given id doesn't exist");
            return value;
        }),
    });
    return schema.validate(user);
}

function findPostById(id){
    return posts.find(post => post.id === parseInt(id));
}

module.exports.router = router;