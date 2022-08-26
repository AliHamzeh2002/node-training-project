const express = require('express');
const _ = require("lodash");
const config = require("config");
const {Post, validate} = require("../models/post");
const {User} = require("../models/user");
const auth = require("../middlewares/auth");
const paginate = require("../middlewares/paginate")
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    try{
        const posts = await Post
            .find()
            .skip((req.query.page - 1) * req.query.size)
            .limit(req.query.size)
            .sort(req.query.sort)

        res.send(posts);
    }
    catch(err){
        res.status(500).send(err.message);
    }
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
    try{        
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: req.user
        });
        req.user.posts.push(post._id);
        await req.user.save();
        await post.save();
        res.send(post);
    }
    catch(err){
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
})

router.put("/:id", auth, async (req, res) => {
    try{    

        const post = await Post.findById(req.params.id);
        if (!post)  return res.status(404).send("Post Not Found");
        if (req.user._id !== req.params.id)  return res.status(403).send("You can't change this post.");

        post.title = req.body.title;
        post.text = req.body.text;
        await post.save()
        res.send(post);
    }
    catch(err){
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
})

router.delete("/:id", auth, async (req, res) => {
    try{

        const post = await Post.findById(req.params.id);
        if (!post)  return res.status(404).send("Post Not Found");
        if (!req.user._id.equals(post.author._id))  return res.status(403).send("You can't change this post.");

        const postIndex = req.user.posts.indexOf(post._id);
        req.user.posts.splice(postIndex, 1);

        await req.user.save();
        await post.remove();
        res.send(post);
    }
    catch(err){
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
});



module.exports.router = router;
