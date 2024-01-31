require("dotenv").config();
const express = require("express");
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send("Email and Password is required!")
            return
        }

        const oldUser = await User.findOne({ email });
        if (oldUser) {
            res.status(400).send('User is already exist');
            return;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        await User.create({ email, password: encryptedPassword });

        res.status(201).send("User is created succesfully")
    } catch (error) {
        console.log(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).send("Email and Password is required!")
            return
        }

        const user = await User.findOne({ email }).select('+password')
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { id: user.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1800s' });

            res.status(201).send({ token });
            return
        }

        res.status(404).send('Email or password is wrong!');
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;