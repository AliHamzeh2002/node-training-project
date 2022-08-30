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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }]
    },
    {timestamps: true}
);

const Post = mongoose.model("Post", postSchema);

exports.Post = Post;
