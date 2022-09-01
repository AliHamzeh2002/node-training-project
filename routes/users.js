const express = require('express');
const _ = require("lodash");
const auth = require("../middlewares/auth")
const paginate = require("../middlewares/paginate");
const userService = require("../services/user");
const router = express.Router();

router.get("/", paginate, async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'To get all the users in the given page and size.'
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/User" }],
            description: 'an array of users'
        } 
    */
    try{
        const users = await userService.getAllUsers(req);
        return res.send(users);
    }
    catch(err){
        return res.status(500).send(err.message);
    }
});

router.get("/:id", async(req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'to get a user data by given id."
        #swagger.parameters["id"] = {description: "id of the user."}
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/User" }],
            description: 'the user object'
        } 
    */
    try{
        const user = await userService.getOneUser(req);
        res.send(user);
    }
    catch(err){
        if (err.name === "notFoundError")
            return res.status(404).send(err.message);
        res.status(500).send(err.message);
    }
});

router.post("/", async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'to create a new user.'
        #swagger.requestBody = {
            description: "posts field will be ignored and assigned as empty array.",
            required: true,
            schema: { $ref: "#/definitions/User" }
        }
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/User" }],
            description: 'the new user object + user token in header with x-auth-token key.'
        } 
    */
    try{
        const {user, token} = await userService.signUpUser(req);
        res.header("x-auth-token", token)
           .send(_.pick(user, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
    }
    catch(err){
        if (err.name === "validationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'to update a user by id and the user's token.'
        #swagger.parameters["id"] = {description: "id of the user."}
        #swagger.requestBody = {
            description: "posts field will be ignored.",
            required: true,
            schema: { $ref: "#/definitions/User" }
        }
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/User" }],
            description: 'the new user object + the new user token in header with x-auth-token key.'
        } 
    */
    try{
        const {user, token} = await userService.updateUser(req);
        res.header("x-auth-token", token)
            .send(_.pick(user, ["_id" ,"name", "username", "age", "email", "phoneNumber"]));
    }
    catch(err){
        if (err.name === "ValidationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
})

router.post("/login", async(req, res) => {
    /* 
    #swagger.description = "to login a user."
    #swagger.parameters['emailOrName'] = {
               in: 'body',
               type: 'string',
               description: 'the username or email of the user.',
               required: true,
    } 
    #swagger.parameters['password'] = {
               in: 'body',
               type: 'string',
               description: 'the password of the user.',
               required: true,
    } 
    */
    try{
        const {token} = await userService.loginUser(req);
        res.header("x-auth-token", token)
            .send("Login successful.");
    }
    catch(err){
        if (err.name === "validationError" || err.code === 11000)
            return res.status(400).send(err.message);
        return res.status(500).send(err.message);
    }
});

router.delete("/:id", auth, async(req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'to delete a user data by given id and a the user's valid token.'
        #swagger.parameters["id"] = {description: "id of the user."}
        #swagger.responses[200] = { 
            schema: [{ $ref: "#/definitions/User" }],
            description: 'the user object'
        } 
    */
    try{
        const user = await userService.deleteUser(req);
        res.send(user);
    }
    catch(err){
        if (err.name === "permissionError")
            return res.status(403).send(err.message);
        res.status(500).send(err.message);
    }
});

module.exports.router = router;

