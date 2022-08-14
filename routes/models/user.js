const mongoose = require("mongoose");

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
        max: 200
    },
    email:{
        type: String,
        required: true,
        uniquie: true,
        minlength: 5,
        maxlength: 255,
    },
    phoneNumber:{
        type: String,
        required: true,
        validate:{
            validator: function(val){
                return val.length === 11
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

