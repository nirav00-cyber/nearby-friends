import User from "../models/user.js";
import mongoose from "mongoose";
import { calculateDistance } from "../utils/distance.js";
// Create a new user with location
export const createUser = async (req, res) => {
    try {
        const { name, email, password, latitude, longitude } = req.body;

        if (!name || !email || !latitude || !longitude) {
            return res.status(400).json({ message: "Name, email, latitude, and longitude are required" });
        }

        const user = new User({
            name,
            email,
            password, // In a real app, you should hash this password
            // Store location as GeoJSON
            location: {
                type: "Point",
                coordinates: [longitude, latitude] // GeoJSON expects [lng, lat]
            }
        });

        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Add Friend

export const addFriend = async (req, res) =>
{
    try
    {
        const { userId, friendId } = req.body;

        //prevent self-friendship 
        if (userId === friendId)
        {
            return res.status(400).json({ message: "You cannot add yourself as a friend." });
        }

        //add friend both ways (mutual friendship)

        await User.findByIdAndUpdate(userId,
            { $addToSet: { friends: friendId } });
        await User.findByIdAndUpdate(friendId,
            { $addToSet: { friends: userId } });
        res.status(200).json({ message: "Friend added successfully." });

    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
}


//Get user's friends

export const getFriends = async (req, res) =>
{
    try
    {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('friends', 'name email');
        res.json(user.friends);
    }
    catch (error)
    {
        res.status(400).json({ message: error.message });
    }
}

//Get nearby friends based on location

export const getNearbyFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const { distance } = req.query; // max distance in meters

    const user = await User.findById(userId).populate(
      "friends",
      "name email location"
    );

    if (!user || !user.location) {
      return res
        .status(404)
        .json({ message: "User not found or location not set" });
    }

    const [userLng, userLat] = user.location.coordinates;

    // Calculate distance for each friend
    const friendsWithDistance = user.friends
      .filter(f => f.location) // only if location is set
      .map(friend => {
        const [friendLng, friendLat] = friend.location.coordinates;
        const dist = calculateDistance(userLat, userLng, friendLat, friendLng);
        return {
          _id: friend._id,
          name: friend.name,
          email: friend.email,
          distance: Math.round(dist * 100) / 100, // km rounded to 2 decimals
        };
      });

    // Filter by distance if query param is provided
    const nearbyFriends = distance
      ? friendsWithDistance.filter(f => f.distance * 1000 <= parseInt(distance))
      : friendsWithDistance;

    // Sort by nearest
    nearbyFriends.sort((a, b) => a.distance - b.distance);

    res.json(nearbyFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};