import bcrypt from "bcrypt";
import User from "../models/User.model.js";
const auth = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ status: "error", message: "User not found" });
        }
        const matched = await bcrypt.compare(password, user.passwordHash);
        if (!matched) {
            return res.status(401).json({ status: "error", message: "Invalid password" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};
export default auth;
//# sourceMappingURL=auth.middleware.js.map