import express from 'express';
import { createUser, addFriend, getFriends, getNearbyFriends } from '../controllers/friendController.js';

const router = express.Router();

router.post('/create', createUser);
router.post('/add-friend', addFriend);
router.get('/:userId', getFriends); 
router.get('/nearby/:userId', getNearbyFriends); 

export default router; 
