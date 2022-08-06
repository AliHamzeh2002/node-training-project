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

function findPostById(id){
    return posts.find(post => post.id === parseInt(id));
}

module.exports.router = router;