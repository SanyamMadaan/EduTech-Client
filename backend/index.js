const express = require('express');
const Port = 3000;
const { user, Admin, Course } = require('./db');
const cors = require('cors');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const key = "12345";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email, password });
        if (existingUser) {
            const userId = existingUser._id;
            console.log("useid while loging in ",userId);
            const token = jwt.sign({ userId }, key);
            console.log(token);
            return res.status(200).json({ "token":token });
        }
        return res.status(400).json({ msg: "No user exists for entered email" });
    } catch (e) {
        console.error("Error while logging in:", e);
        res.status(400).json({ msg: "Error while logging in" });
    }
});

app.post('/signup', async (req, res) => {
    const { email, contact, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(411).json({ msg: "User already exists" });
        }
        const newUser = await user.create({ email, contact, password });
        const userId = newUser._id; // Use newUser._id instead of response._id
        const token = jwt.sign({ userId }, key);
        console.log("userid from signup ", userId);
        console.log(token);
        res.status(200).json({ "token": token });
    } catch (e) {
        console.error("Error while signing up:", e);
        res.status(500).json({ msg: "Error while signing up" });
    }
});


app.post('/purchase/:courseId', async (req, res) => {
    const courseId = req.params.courseId;
    console.log("Requested courseId:", courseId);

    const token = req.headers.token;
    console.log("Received token:", token);

    try {
        const tokenParts = token.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(400).json({ msg: "Invalid token format" });
        }
        const tokenValue = tokenParts[1];
        console.log("Token value:", tokenValue);

        const decoded = await jwt.verify(tokenValue, key);
        console.log("Decoded token:", decoded);

        const userId = decoded.userId;
        console.log("User ID from token:", userId);

        const existingUser = await user.findOne({ _id: userId });
        console.log("Existing user:", existingUser);

        if (!existingUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Add your purchase logic here

        res.status(200).json({ msg: "Purchase successful" });
    } catch (e) {
        res.status(500).json({ msg: "Error while purchasing course", error: e.message });
    }
});

app.listen(Port);
