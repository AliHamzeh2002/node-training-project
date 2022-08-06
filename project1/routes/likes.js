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

module.exports.router = router;
