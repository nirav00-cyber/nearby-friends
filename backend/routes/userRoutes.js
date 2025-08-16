import express from "express";
import User from "../models/user.js"

const router = express.Router();

router.get('/', async (req, res) =>
{
    try
    {
        const users = await User.find({}, "name email");
        res.json(users);
    }
    catch (e)
    {
        res.status(500).json({ message: e.message });
    }
});

export default router; 
