const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

const postSchema = new mongoose.Schema({
        title:{
            type: String,
            required: true,
            min: 4,
            max: 1024
        }, 
        text:{
            type: String,
            required: true,
            min: 20,
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
);

const Post = mongoose.model("Post", postSchema);

function validatePost(post){
    const schema = Joi.object({
        title: Joi.string().min(4).max(1024).required(),
        text: Joi.string().min(20).required(),
        author: Joi.objectId().required(),
    })
    return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;