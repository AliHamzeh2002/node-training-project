const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },

    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 50
    },

    age:{
        type: Number,
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },

    email:{
        type: String,
        required: true,
        uniquie: true,
        lowercase: true,
        minlength: 5,
        maxlength: 255,
    },

    phoneNumber:{
        type: Number,
        required: true,
        validate:{
            validator: function(val){
                return val.toString().length === 11
            },
            message: "Phone number should have 11 characters"
        }
    },

    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        username: this.username,
        },
        "privateKey"
    );
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        username: Joi.string().min(2).max(255).required(),
        age: Joi.number().integer().greater(10),
        email: Joi.String().min(2).max(255).email().required(),
        phoneNumber: Joi.Number().min(11).max(11).required(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;