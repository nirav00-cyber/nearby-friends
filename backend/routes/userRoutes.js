import express from "express";
import User from "../models/user.js"
import { updateLocation, setAway } from "../controllers/friendController.js"; 


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


router.post('/:id/location', updateLocation);
router.post('/:id/away', setAway); 


export default router; 
