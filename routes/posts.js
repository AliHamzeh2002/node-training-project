const express = require('express');
const postService = require("../services/post");
const {auth} = require("../middlewares/auth");
const paginate = require("../middlewares/paginate")
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    /*
        #swagger.tags = ['Post']
        #swagger.description = 'To get all the posts in the given page and size.'
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/Post" }],
            description: 'an array of posts'
        } 
    */
    try{
        const posts = await postService.getAllPosts(req);
        res.send(posts);
    }
    catch(err){
        res.status(500).send(err.message);
    }
})

router.get("/:id", async (req, res) => {
    /*
        #swagger.tags = ['Post']
        #swagger.description = 'to get a post data by given id."
        #swagger.parameters["id"] = {description: "id of the post."}
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/Post" }],
            description: 'the post object'
        } 
    */
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
    /*
        #swagger.tags = ['Post']
        #swagger.description = 'to create a new post with a user token.'
        #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/definitions/AddPost" }
        }
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/Post" }],
            description: 'the new post object'
        } 
    */
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
    /*
        #swagger.tags = ['Post']
        #swagger.description = 'to update a post by id and the user's token.'
        #swagger.parameters["id"] = {description: "id of the post."}
        #swagger.requestBody = {
            required: true,
            schema: { $ref: "#/definitions/AddPost" }
        }
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/Post" }],
            description: 'the new post object.'
        } 
    */
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
    /*
        #swagger.tags = ['Post']
        #swagger.description = 'to delete a post data by given id and a the user's valid token.'
        #swagger.parameters["id"] = {description: "id of the post."}
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/Post" }],
            description: 'the deleted post object'
        } 
    */
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
