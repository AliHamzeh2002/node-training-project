const express = require('express');
const _ = require("lodash")
const config = require("config");
const auth = require("../middlewares/auth");
const paginate = require("../middlewares/paginate")
const {Like, validate} = require("../models/like");
const {Post} = require("../models/post");
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    try{
        const likes = await Like.find()
                                .skip((req.query.page - 1) * req.query.size)
                                .limit(req.query.size)
                                .populate("userId", "username")
                                .populate("postId", "title")
        res.send(likes);
    }
    catch(err){
        res.status(500).send(err.message);
    }
})

router.get("/:id", async (req, res) => {
    try{
        const like = await Like.findById(req.params.id);
        if (!like) return res.status(404).send("like with given id doesn't exist!");
        res.send(like);
    }
    catch(err){
        res.status(500).send(err.message);
    }
})

router.post("/", auth, async (req, res) => {
    try{
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        
        const post = await Post.findById(req.body.postId);
        if (!post) return res.status(404).send("Post not Found.");

        const like = new Like({
            userId: req.user._id,
            postId: req.body.postId
        });
        post.likes.push(like._id);
        req.user.likes.push(like._id);

        await req.user.save();
        await post.save();
        await like.save();
        res.send(like);
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }

})

router.delete("/:id", auth,  async (req, res) => {
    try{
        const like = await Like.findById(req.params.id);
        if (!like) return res.status(404).send("like with given id doesn't exist!");

        let likeIndex = req.user.likes.indexOf(like._id);
        req.user.likes.splice(likeIndex, 1);

        const post = await Post.findById(like.postId);
        likeIndex = post.likes.indexOf(like._id);
        post.likes.splice(likeIndex, 1);

        await post.save();
        await req.user.save();
        await like.remove();
        res.send(like);
    }
    catch(err){
        res.status(500).send(err.message);
    }
});

module.exports.router = router;
