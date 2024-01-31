// user.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema)