require("dotenv").config();
const express = require("express");
const router = express.Router();

const verifyToken = require('../Middlewares/verify-token')
const Post = require('../Models/post');

router.post("/", verifyToken, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) {
            res.status(400).send("Description is required!")
            return
        }

        const post = await Post.create({ description });

        res.status(201).send(post)
    } catch (error) {
        console.log(error)
    }
})

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).send(posts)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;