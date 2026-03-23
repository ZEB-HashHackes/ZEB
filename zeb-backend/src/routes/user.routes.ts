import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import auth from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {username, password, publickey}  = req.body;
    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({username, passwordHash, publickey});
    await user.save();

    res.status(201).json({status: "ok", message: "user created.", data: user._id});
  } catch(err){
    console.error("Error creating user.", err);
    res.status(500).json({status: "Error", message: "Error creating user"});
  }
});

router.post("/login",auth ,async (req, res) => {
  res.json({ message: "Login successful", userId: (req as any).user._id });
});

router.get("/:publickey", async (req, res) => {
  try {
    const user = await User.findOne({ publickey: req.params.publickey });
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.json({ status: "ok", data: user });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Error fetching user" });
  }
});


export default router;

