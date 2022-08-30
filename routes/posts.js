const express = require('express');
const postService = require("../services/post");
const auth = require("../middlewares/auth");
const paginate = require("../middlewares/paginate")
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    try{
        const posts = await postService.getAllPosts(req);
        res.send(posts);
    }
    catch(err){
        res.status(500).send(err.message);
    }
})

router.get("/:id", async (req, res) => {
    try{
        const post = await postService.getOnePost(req);
        res.send(post);
    }
    catch(err){
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        res.status(500).send(err.message);
    }
})

router.post("/", auth, async (req, res) => {
    try{        
        const post = await postService.createPost(req);
        res.send(post);
    }
    catch(err){
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        res.status(500).send(err.message);
    }
})

router.put("/:id", auth, async (req, res) => {
    try{    

        const post = await postService.updatePost(req);
        res.send(post);
    }
    catch(err){
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        if (err.name === "permissionError")
            return res.status(403).send(err.message);
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        res.status(500).send(err.message);
    }
})

router.delete("/:id", auth, async (req, res) => {
    try{
        const post = await postService.deletePost(req);
        res.send(post);
    }
    catch(err){
        if (err.name === "permissionError")
            return res.status(403).send(err.message);
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        return res.status(500).send(err.message);
    }
});



module.exports.router = router;
