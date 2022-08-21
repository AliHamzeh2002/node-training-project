const express = require('express');
const _ = require("lodash")
const auth = require("../middlewares/auth");
const {Like, validate} = require("../models/like");
const {Post} = require("../models/post");
const router = express.Router();

router.get("/", async (req, res) => {
    const likes = await Like.find();
    res.send(likes);
})

router.get("/:id", async (req, res) => {
    try{
        const like = await Like.findById(req.params.id);
        if (!like) return res.status(404).send("like with given id doesn't exist!");
        res.send(like);
    }
    catch(err){
        res.send(err.message);
    }
})

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const isPostValid = await Post.findById(req.body.postId);
    if (!isPostValid) return res.status(404).send("Post not Found.");
    req.body.userId = req.user._id;

    const identicalLikes = await Like.find({postId: req.body.postId, userId: req.body.userId});
    if (identicalLikes.length)
        return res.status(400).send("Already liked this");

    const like = new Like(_.pick(req.body, ["postId", "userId"]));
    await like.save();
    res.send(like);

})

router.delete("/:id", async (req, res) => {
    try{
        const like = await Like.findById(req.params.id);
        if (!like) return res.status(404).send("like with given id doesn't exist!");
        await like.remove()
        res.send(like);
    }
    catch(err){
        res.send(err.message);
    }
});

module.exports.router = router;
