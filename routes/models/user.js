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
    
})