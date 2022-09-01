const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const m2s = require("mongoose-to-swagger");

const userSchema = new mongoose.Schema({
        name:{
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        username:{
            type: String,
            required: true,
            trim: true,
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
            trim: true,
            lowercase: true,
            unique: true,
            minlength: 5,
            maxlength: 255,
            validate:{
                validator: function(email){
                           let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                           return regex.test(email);
                },
                message: "Email Format Is Wrong"
            },
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

        posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],

        likes:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Like"
        }]
    },
    {timestamps: true}
);

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign(
        {_id: this._id,username: this.username,},
        config.get("jwtPrivateKey"),
        {expiresIn: "1h"}
    );
    return token;
}

const User = mongoose.model("User", userSchema);
const userSwaggerSchema = m2s(User);

exports.User = User;

