const express = require('express');
const _ = require("lodash");
const {Post, validate} = require("../models/post");
const {User} = require("../models/user");
const auth = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    let posts;
    if (req.query.sort === "created_at"){
        posts = await Post
            .find()
            .select("title text createdAt author.username")
            .sort("-createdAt")
    }
    else{
        posts = await Post
            .find()
            .select("title text createdAt author.username")
    }

    res.send(posts);
})

router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post)  return res.status(404).send("Post Not Found");
            res.send(post);
    }
    catch(err){
        res.send(err.message);
    }
})

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    req.body.author = await User.findById(req.user._id);
    if (!req.body.author) return res.status(400).send("Invalid User.");

    const post = new Post(_.pick(req.body, ["title", "text", "author"]));
    await post.save();
    res.send(post);

})

router.put("/:id", (req, res) => {
    const post = findPostById(req.params.id);
    if (!post) return res.status(404).send("Post with given id doesn't exist!");

    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    if (post.userId !== req.body.userId)  return res.status(400).send("userId can't be changed");

    post.title = req.body.title;
    post.text = req.body.text;
    res.send(post);
})

router.delete("/:id", (req, res) => {
    const post = findPostById(req.params.id);
    if (!post) return res.status(404).send("Post with given id doesn't exist!");

    const index = posts.indexOf(post);
    posts.splice(index, 1);
    res.send(post);
});

function validatePost(post){
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
module.exports.findPostById = findPostById;