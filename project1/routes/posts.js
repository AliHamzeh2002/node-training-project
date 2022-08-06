const express = require('express');
const Joi = require("joi");
const findUser = require("./users").findUser;
const router = express.Router();

const posts = [
    {id: 1, title: "test post", text:"test content", userId: 1}
];

let available_id = 2;

router.get("/", (req, res) => {
    res.send(posts);
})

module.exports.router = router;