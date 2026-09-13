import { User } from "../Model/UserModel.js";

export const UserSignUp = async (req, res) => {
    const {userName, email} = req.body;
    if (!userName || !email) return res.status(400).json({ message: "user info reqire" });
    try {
        const user_exist = await User.findOne({ email });
        if (user_exist) return res.status(400).json({ message: "user already exist" });

        const new_user = User({
            userName, email
        });
        await new_user.save();

        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};