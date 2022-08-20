const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi)

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

function validateLike(like){
    const schema = Joi.object({
        post: joi.objectId().required(),
        user: joi.objectId().required(),
    })
    return schema.validate(like);
}

exports.Like = Like;
exports.validate = validateLike