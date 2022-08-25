const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

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
            max: 1000,
            validate:{
                validator: Number.isInteger,
                message: "age should be an Integer"
            }
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
            type: String,
            required: true,
            validate:{
                validator: function(value){
                    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                    return regex.test(value);
                },
                message: "Phone Number Format Is Wrong."
            }
        },

        password:{
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024
        },
    },
    {timestamps: true}
);

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        username: this.username,
        },
        config.get("jwtPrivateKey")
    );
    return token;
}

const User = mongoose.model("User", userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        username: Joi.string().min(2).max(255).required(),
        age: Joi.number().integer().greater(10),
        email: Joi.string().min(2).max(255).email().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;