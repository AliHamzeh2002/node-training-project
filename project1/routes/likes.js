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

router.post("/", (req, res) => {
    const { error } = validateLike(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    if (!isLikeUnique(req.body)) return res.status(400).send("This like already exists!");
    
    const like = {id: available_id,
                userId: req.body.userId,
                postId: req.body.postId
    };
    available_id++;
    likes.push(like);
    res.send(like);

})

function validateLike(like){
    const schema = Joi.object({
        userId: Joi.number().integer().required().custom((value , helper) => {
            if (!findUserById(value)) return helper.message("Username with given id doesn't exist");
            return value;
        }),
        postId: Joi.number().integer().required().custom((value , helper) => {
            if (!findPostById(value)) return helper.message("post with given id doesn't exist");
            return value;
        }),
    });
    return schema.validate(like);
}

function isLikeUnique(like){
    return !likes.find(l => (like.postId === l.postId && like.userId === l.userId))
}

function findLikesById(id){
    return likes.find(like => like.id === parseInt(id));
}


module.exports.router = router;
