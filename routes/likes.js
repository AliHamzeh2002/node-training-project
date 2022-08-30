const express = require('express');
const auth = require("../middlewares/auth");
const paginate = require("../middlewares/paginate");
const likeService = require("../services/like");

const router = express.Router();

router.get("/", paginate, async (req, res) => {
    try{
        const likes = await likeService.getAllLikes(req);
        res.send(likes);
    }
    catch(err){
        res.status(500).send(err.message);
    }
})

router.get("/:id", async (req, res) => {
    try{
        const like = await likeService.getOneLike(req);
        res.send(like);
    }
    catch(err){
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
    }
})

router.post("/", auth, async (req, res) => {
    try{
        const like = await likeService.createlike(req);
        res.send(like);
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        return res.status(500).send(err.message);
    }

})

router.delete("/:id", auth,  async (req, res) => {
    try{
        const like = await likeService.deleteLike(req);
        res.send(like);
    }
    catch(err){
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        res.status(500).send(err.message);
    }
});

module.exports.router = router;
