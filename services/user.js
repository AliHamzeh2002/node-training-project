const {User} = require("../models/user");
const bcrypt = require("bcrypt");

async function getAllUsers(req){
    try{
        const users = await User
                            .find()
                            .skip((req.query.page - 1) * req.query.size)
                            .limit(req.query.size)
                            .select("-password")
                            .populate("posts", "title");
        return users;
    }
    catch(err){
        throw err;
    }
}

async function signUpUser(req){
    try{
        user = new User({
            name: req.body.name,
            username: req.body.username,
            age: req.body.age,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber, 
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        return {token: token, user: user};
    }
    catch(err){
        throw err;
    }
}

async function loginUser(req){
    try{
        const user = await User.findOne({$or: [{email: req.body.emailOrName}, {username: req.body.emailOrName}]});
        if (!user)  
            throw {name:"validationError", message: "Wrong Data"};
        const isPassValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPassValid)
            throw {name:"validationError", message: "Wrong Data"};
        const token = user.generateAuthToken();
        return {token: token, user: user};
    }
    catch(err){
        throw err;
    }
}

async function getOneUser(req){
    try{
        const user = await User
                    .findById(req.params.id)
                    .select("-password")
                    .populate("posts", "title");
        if (!user)
            throw {name:"notFoundError", message: "User With Given Id Not Found."};
        return user;
    }
    catch(err){
        throw err;
    }
}

async function deleteUser(req){
    try{
        if (!req.user._id.equals(req.params.id))
            throw {name:"permissionError", message: "Permission Denied."};
        const user = await User.findByIdAndDelete(req.user._id)
                                .select("-password");
        return user;
    }
    catch(err){
        throw err
    }
}

async function updateUser(req){
    try{
        let updatedData = {
            name: req.body.name,
            username: req.body.username,
            age: req.body.age,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber, 
        };
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(req.body.password, salt);

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedData, {new: true})
        const token = updatedUser.generateAuthToken();
        return {token: token, user: updatedUser};
    }
    catch(err){
        throw err;
    }
}

exports.getAllUsers = getAllUsers;
exports.signUpUser = signUpUser;
exports.loginUser = loginUser;
exports.getOneUser = getOneUser;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;