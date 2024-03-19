const userService = require("../services/userService");
const ErrorHandler = require("../utils/errorHandler");
const SuccessHandler = require("../utils/successHandler");
const asyncHandler = require("express-async-handler");

exports.getAllUsers = asyncHandler(async(req, res, next)=>{

    const users = await userService.getAllUserData();

    return !users
    ? ErrorHandler("Error Users not Found")
    : SuccessHandler(res, "Successfully Retrieved users data", users)
});

exports.createUser = [
    asyncHandler(async(req, res, next)=>{
        const user = await userService.createUserData(req);

        return SuccessHandler(res, "User Successfully Created", user);
    })
]