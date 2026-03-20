import express from "express";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import users from "./routes/user.routes.js";
import arts from "./routes/art.routes.js";
import verification from "./routes/verification.routes.js";
import auction from "./routes/auction.routes.js";
import activity from "./routes/activity.routes.js";
const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use("/api/users/", users);
app.use("/api/arts/", arts);
app.use("/api/verify/", verification);
app.use("/api/auction/", auction);
app.use("/api/activity/", activity);
app.get("/", (req, res) => {
    res.send("Zeb backend running");
});
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
//# sourceMappingURL=server.js.map