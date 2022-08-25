const express = require('express');
const _ = require("lodash");
const config = require("config");
const {Post, validate} = require("../models/post");
const {User} = require("../models/user");
const auth = require("../middlewares/auth");
const paginate = require("../middlewares/paginate")
const router = express.Router();

router.get("/", async (req, res) => {
    const posts = await Post
        .find()
        .select("title text createdAt author.username")
        .skip((req.query.page - 1) * req.query.size)
        .limit(req.query.size)
        .sort(req.query.sort)

    res.send(posts);
})

router.get("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)
                                .select("title text createdAt author.username");
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

router.put("/:id", auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    author = await User.findById(req.user._id);
    if (!author) return res.status(400).send("Invalid User.");

    try{
        const post = await Post.findById(req.params.id);
        if (!post)  return res.status(404).send("Post Not Found");
        if (!author._id.equals(post.author._id))  return res.status(403).send("You can't change this post.");

        post.title = req.body.title;
        post.text = req.body.text;
        await post.save()
        res.send(post);
    }
    catch(err){
        res.send(err.message);
    }
})

router.delete("/:id", auth, async (req, res) => {
    author = await User.findById(req.user._id);
    if (!author) return res.status(400).send("Invalid User.");

    try{
        const post = await Post.findById(req.params.id);
        if (!post)  return res.status(404).send("Post Not Found");
        if (!author._id.equals(post.author._id))  return res.status(403).send("You can't change this post.");
        await post.remove();
        res.send(post);
    }
    catch(err){
        res.send(err.message);
    }
});



module.exports.router = router;
