const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);