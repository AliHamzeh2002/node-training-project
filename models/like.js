const mongoose = require("mongoose");
const Joi = require("joi");

const likeSchema = new mongooseSchema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Like = mongoose.model("Like", likeSchema);

