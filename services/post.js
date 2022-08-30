const {Post} = require("../models/post");

async function getAllPosts(req){
    try{
        const posts = await Post
                .find()
                .skip((req.query.page - 1) * req.query.size)
                .limit(req.query.size)
                .sort(req.query.sort)
                .populate("author", "username");
        return posts;
    }
    catch(err){
        throw err;
    }
}

async function getOnePost(req){
    try{
        const post = await Post.findById(req.params.id)
                                .populate("author", "username");
        if (!post)  
            throw {name:"notFoundError", message: "Post Not Found"};
        return post;
    }
    catch(err){
        throw err;
    }
}

async function createPost(req){
    try{
        const post = new Post({
            title: req.body.title,
            text: req.body.text,
            author: req.user
        });
        req.user.posts.push(post._id);
        await req.user.save();
        await post.save();
        return post;
    }   
    catch(err){
        throw err;
    }
}

async function findPostData(userId, postId){
    try{
        const post = await Post.findById(postId);
        if (!post)  
            throw {name:"notFoundError", message: "Post Not Found"};
        if (!userId.equals(post.author._id))
            throw {name:"permissionError", message: "Permission Denied."};
        return post;
    }
    catch(err){
        throw err;
    }
}

async function updatePost(req){
    try{
        const post = await findPostData(req.user._id, req.params.id);
        post.title = req.body.title;
        post.text = req.body.text;
        await post.save();
        return post;
    }
    catch(err){
        throw err;
    }
}

async function deletePost(req){
    try{
        const post = await findPostData(req.user._id, req.params.id);
        const postIndex = req.user.posts.indexOf(post._id);
        req.user.posts.splice(postIndex, 1);

        await req.user.save();
        await post.remove();
        return post;
    }
    catch(err){
        throw err;
    }
}

exports.getAllPosts = getAllPosts;
exports.getOnePost = getOnePost;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;