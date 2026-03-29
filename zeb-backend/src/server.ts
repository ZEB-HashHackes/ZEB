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
import auctionRouter from "./routes/auction.routes.js";
import adminRouter from "./routes/admin.routes.js";
import activityRouter from "./routes/activity.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Support for serving static files with proper CORS and MIME-types
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  const ext = path.extname(req.url).toLowerCase();
  if (!ext) {
    // Basic fallback for hashed files without extensions
    // Defaulting to image/jpeg as most uploaded arts were images
    res.setHeader("Content-Type", "image/jpeg"); 
  }
  next();
}, express.static(uploadDir));

dotenv.config();

const PORT = process.env.PORT || 5000

app.use("/api/users", users);
app.use("/api/arts", arts);
app.use("/api/verify/", verification);
app.use("/api/auction/", auction);
app.use("/api/auction", auctionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/activity", activityRouter);

app.get("/", (req, res)=>{
  res.send("Zeb backend running");
});



connectDB().then(()=> {
  app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
  })
})




