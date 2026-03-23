import express from "express";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import users from "./routes/user.routes.js"
import arts from "./routes/art.routes.js"
import verification from "./routes/verification.routes.js"
import auction from "./routes/auction.routes.js"
import activity from "./routes/activity.routes.js"

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use("/uploads", (req, res, next) => {
  const ext = path.extname(req.url);
  if (!ext) {
    // Basic fallback for hashed files without extensions - set as image/jpeg or similar
    // Browsers are usually good at interpreting image data if the header says image/*
    res.setHeader("Content-Type", "image/jpeg"); 
  }
  next();
}, express.static(uploadDir));

dotenv.config();

const PORT = process.env.PORT || 5000

app.use("/api/users/", users);
app.use("/api/arts/", arts);
app.use("/api/verify/", verification);
app.use("/api/auction/", auction);
app.use("/api/activity/", activity);

app.get("/", (req, res)=>{
  res.send("Zeb backend running");
});



connectDB().then(()=> {
  app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
  })
})




