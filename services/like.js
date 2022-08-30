const {Like} = require("../models/like");
const {Post} = require("../models/post");

async function getAllLikes(req){
    try{
        const likes = await Like.find()
                        .skip((req.query.page - 1) * req.query.size)
                        .limit(req.query.size)
                        .populate("userId", "username")
                        .populate("postId", "title");
        return likes;
    }
    catch(err){
        throw err;
    }
}

async function getOneLike(req){
    try{
        const like = await Like.findById(req.params.id);
        if (!like)
            throw {name:"notFoundError", message: "Like Not Found"};
        return like;
    }
    catch(err){
        throw err;
    }
}

async function createlike(req){
    try{        
        const post = await Post.findById(req.body.postId);
        if (!post)
            throw {name:"notFoundError", message: "Post Not Found"};

        const like = new Like({
            userId: req.user._id,
            postId: req.body.postId
        });

        post.likes.push(like._id);
        req.user.likes.push(like._id);

        await req.user.save();
        await post.save();
        await like.save();

        return like;
    }
    catch(err){
        throw err;
    }
}

async function deleteLike(req){
    try{
        const like = await Like.findById(req.params.id);
        if (!like)
            throw {name:"notFoundError", message: "Like Not Found"};

        let likeIndex = req.user.likes.indexOf(like._id);
        req.user.likes.splice(likeIndex, 1);

        const post = await Post.findById(like.postId);
        likeIndex = post.likes.indexOf(like._id);
        post.likes.splice(likeIndex, 1);

        await post.save();
        await req.user.save();
        await like.remove();

        return like;
    }
    catch(err){
        throw err;
    }
}

exports.getAllLikes = getAllLikes;
exports.getOneLike = getOneLike;
exports.createlike = createlike;
exports.deleteLike = deleteLike;