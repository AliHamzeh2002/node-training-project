const express = require('express');
const Joi = require("joi");
const findUserById = require("./users").findUserById;
const findPostById = require("./posts").findPostById;
const router = express.Router();

const likes = [
    {id: 1, userId: 1, postId: 1}
];

let available_id = 2;

router.get("/", (req, res) => {
    res.send(likes);
})

router.get("/:id", (req, res) => {
    const like = findLikesById(req.params.id);
    if (!like) return res.status(404).send("like with given id doesn't exist!");
    res.send(like);
})

function findLikesById(id){
    return likes.find(like => like.id === parseInt(id));
}

module.exports.router = router;
