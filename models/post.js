const mongoose = require("mongoose");
const Joi = require("joi");

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

const Post = mongoose.Model("Post", postSchema);

