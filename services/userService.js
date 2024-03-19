const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllUserData = async()=>{
    const users = User.find()
    .sort({ createdAt: -1})
    .lean()
    .exec()

    return users;
};

exports.createUserData = async(req, res)=>{
    const duplicateUser = await User.findOne({
        name: req.body.name
    });

    if(duplicateUser){
        throw new ErrorHandler("Duplicate User Name")
    }

    const user = await User.create({
        ...req.body,
    })

    return user;
}