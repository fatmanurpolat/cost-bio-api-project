const User = require('../Models/User.js')
const Trip = require('../Models/Trip.js')
const { UserVerification } = require('../Models/Verification.js')
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const { sendEmail } = require('../Helpers/Mail.js')

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw createError[404]('There is no user')

        return { message: "Success", user }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const updateUser = async (userId, result) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw createError[404]('There is no user')

        user.firstName = result.firstName;
        user.lastName = result.lastName,
            user.phoneNumber = result.phoneNumber,
            user.profileImage = result.profileImage,

            await user.save();

        return { message: "User successfully updated" };
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const deleteUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw createError[404]('There is no user')

        await User.deleteOne({ _id: userId });

        return { message: "User successfully deleted" };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getUserTrips = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw createError[404]('There is no user')

        const userTrips = await Trip.find({ user: userId });
        return { message: "Success", userTrips }
    } catch (error) {
        console.log(error);
        throw error;
    }

}

const resetPasswordUrl = async(userId, uniqueString ) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw createError.NotFound('User not found');

        const resetRequest = await UserVerification.find({ userId: userId, uniqueString });
        console.log(resetRequest);
        if (!resetRequest) throw createError.NotFound('There is no reset request for this user');

        if (Date.now() > resetRequest.expiresAt) {
            UserVerification.deleteOne({ userId })
                .then(() => {
                    throw new Error('Link has expired. Please send email confirm again.')
                })
        }

        // Return reset-password html page
        return '../Views/reset-password.html'
    } catch (error) {
        console.log(error);
        throw error
    }
}

const resetPassword = async (userId, uniqueString, newPassword) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw createError.NotFound('User not found');

        const resetRequest = await UserVerification.find({ userId, uniqueString });

        if (!resetRequest) throw createError.NotFound('There is no reset request for this user');

        if (Date.now() > resetRequest.expiresAt) {
            UserVerification.deleteOne({ userId: user._id })
                .then(() => {
                    throw new Error('Link has expired. Please send mail again.')
                })
        }

        await bcrypt.hash(newPassword, 10).then(async (result) => {
            if (result) {
                await User.findByIdAndUpdate(user._id, { password: result });
                await UserVerification.findByIdAndDelete(resetRequest._id);
            }
        }).catch((err) => {
            console.log(err);
            throw createError.ExpectationFailed('An error occured while password update ')
        })


        return 'Password reset successful';
    } catch (error) {
        throw error;
    }
}

const forgotPasswordService = async (email) => {
    try {
        const user = await User.findOne({email:email});
        if (!user) throw createError.NotFound('User Not Found');

        const type = 'reset-password'
        await sendEmail(email, user._id, type);
        return ({ message: " Mail Successfully Sended "})
    } catch (error) {
        console.log(error);
        throw error
    }
}

const userService = {
    getUserById,
    updateUser,
    deleteUser,
    getUserTrips,
    resetPasswordUrl,
    resetPassword,
    forgotPasswordService,
}

module.exports = userService