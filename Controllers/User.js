const userService = require('../Services/User.js')
const { update } = require('../Validations/User.js')
const path = require('path');


const getUserById = async(req,res,next) => {
    try {
        const userId = req.params.userId
        
        const result = await userService.getUserById(userId);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}


const updateUser = async(req,res,next) => {
    try {
        const userId = req.params.userId;
        const result = await update.validateAsync(req.body);

        const resultService = await userService.updateUser(userId, result);

        res.status(201).json(resultService);
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req,res,next) => {
    try {
        const userId = req.params.userId;

        const result = await userService.deleteUser(userId);
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}



const resetPassword = async(req,res,next) => {
    try {
        const { userId,uniqueString } = req.params;
        const { newPassword } = req.body
        const result = await userService.resetPassword(userId,uniqueString,newPassword);

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const resetPasswordURL = async(req,res,next) => {
    try {
        const { userId, uniqueString } = req.params;
        const result = await userService.resetPasswordUrl(userId,uniqueString);

        res.sendFile(path.join(__dirname,result));
    } catch (error) {
        next(error)
    }
}

const forgotPassword = async(req,res,next) => {
    try {
        const { email } = req.body;
        console.log(email);
        const result = await userService.forgotPasswordService(email);

        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUserById,
    updateUser,
    deleteUser,
    resetPassword,
    resetPasswordURL,
    forgotPassword,
}