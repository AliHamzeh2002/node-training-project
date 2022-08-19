const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
        title:{
            type: String,
            required: true,
            minlength: 4,
            maxlength: 1024
        }, 
        text:{
            type: String,
            required: true,
            minlength: 20,
        },
        author: { 
            type: new mongoose.Schema({
                username: {
                    type: String,
                    minlength: 3,
                    maxlength: 256,
                    required: true
                }
            }),
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
    })
    return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;