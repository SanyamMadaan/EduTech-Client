const express = require("express");
require("dotenv").config();
const Port = process.env.PORT || 3000;
const { user, Admin, Course } = require("./db");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const key = process.env.key;
const app = express();
const Razorpay=require('razorpay')

dotenv.config();

app.use(express.json());
app.use(cors());

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email, password });
    if (existingUser) {
      const userId = existingUser._id;
      console.log("userId while logging in ", userId);
      const token = jwt.sign({ userId }, key);
      console.log(token);
      return res.status(200).json({ token: token });
    }
    return res.status(400).json({ msg: "No user exists for entered email" });
  } catch (e) {
    console.error("Error while logging in:", e);
    res.status(400).json({ msg: "Error while logging in" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, contact, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(411).json({ msg: "User already exists" });
    }
    const newUser = await user.create({ email, contact, password });
    const userId = newUser._id;
    const token = jwt.sign({ userId }, key);
    console.log("userId from signup ", userId);
    console.log(token);
    res.status(200).json({ token: token });
  } catch (e) {
    console.error("Error while signing up:", e);
    res.status(500).json({ msg: "Error while signing up" });
  }
});

app.post("/purchase/:courseId", async (req, res) => {
  const price=req.body.price;
  const courseId=req.params.courseId;

  const options = {
    amount: Number(price*100),  // amount in the smallest currency unit
    currency: "INR"
  };

  const order=await instance.orders.create(options);
  console.log(order);

  res.status(200).json({
    success:true,
    order
  });  
});

app.get('/getApiKey',(req,res)=>{
  const key=process.env.RAZORPAY_API_KEY;
  res.status(200).json({key});
})

app.get("/purchases", async (req, res) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token.split(" ")[1], key);
    const userId = decoded.userId;
    const existingUser = await user.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    // Assuming you have a field named purchasedCourses in your user schema
    const purchasedCourses = await Course.find({
      _id: { $in: existingUser.purchasedCourses },
    });
    res.status(200).json(purchasedCourses);
  } catch (error) {
    console.error("Error while fetching purchased courses:", error);
    res
      .status(500)
      .json({
        msg: "Error while fetching purchased courses",
        error: error.message,
      });
  }
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
