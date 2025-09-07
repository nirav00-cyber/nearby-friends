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
      "name email location online lastSeen lastLocation"
    );

    if (!user || !user.location) {
      return res
        .status(404)
        .json({ message: "User not found or location not set" });
    }
    
    console.log(`Getting nearby friends for user ${userId}. Friend count: ${user.friends.length}`);
    user.friends.forEach(friend => {
      console.log(`Friend ${friend._id}: ${friend.name}, online: ${friend.online}`);
    });

    // GeoJSON coordinates are stored as [longitude, latitude]
    const [userLng, userLat] = user.location.coordinates;

    // Calculate distance for each friend (include friends even if they don't have `location`; fall back to `lastLocation`)
    const friendsWithDistance = user.friends.map((friend) => {
      const friendCoords = friend.location?.coordinates || friend.lastLocation?.coordinates;
      let distanceKm = null;

      if (Array.isArray(friendCoords) && friendCoords.length === 2) {
        const [friendLng, friendLat] = friendCoords;
        const dist = calculateDistance(userLat, userLng, friendLat, friendLng);
        distanceKm = Math.round(dist * 100) / 100; // km rounded to 2 decimals
      }

      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        online: !!friend.online,
        lastSeen: friend.lastSeen || null,
        distance: distanceKm,
      };
    });

    // Filter by distance if query param is provided
    const nearbyFriends = distance
      ? friendsWithDistance.filter(f => f.distance * 1000 <= parseInt(distance))
      : friendsWithDistance;

  // Sort by nearest (treat null distances as Infinity so they go to the end)
  nearbyFriends.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

    res.json(nearbyFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Update user's reported location and set online
export const updateLocation = async (req, res) =>
{
  try
  {
    const { id } = req.params; //route will be /api/users/:id/location
    const { latitude, longitude, online = true } = req.body;
    
    console.log(`Updating user ${id} status: online=${online}, location: ${latitude ? `[${longitude}, ${latitude}]` : 'not provided'}`);
    
    // Create the update object
    const update = {
      lastSeen: new Date(),
      online: online,
    };
    
    // Only add location data if both latitude and longitude are provided and are numbers
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      update.location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
      update.lastLocation = {
        type: "Point",
        coordinates: [longitude, latitude]
      };
    } else if (latitude !== undefined || longitude !== undefined) {
      // Only return error if one coordinate is provided but not both, or if they're invalid types
      return res.status(400).json({ message: "If providing location, both latitude and longitude must be numbers" });
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: "user not found" });
    console.log(`User ${id} updated successfully, online status: ${user.online}`);
    res.json({ message: "Location updated", user });
  
  }
  catch (error)
  {
    console.error(`Error updating user ${req.params.id}:`, error);
    res.status(500).json({ message: error.message });
    
  }
};


// mark user away/offline

export const setAway = async (req, res) =>
{
  try
  {
    const { id } = req.params; 
    console.log(`Setting user ${id} to offline status`);
    
    const user = await User.findByIdAndUpdate(id, { online: false, lastSeen: new Date() }, { new: true });

    if (!user) return res.status(404).json({ message: "user not found" }); 
    
    console.log(`User ${id} set to offline successfully`);
    res.json({ message: "user set to away", user });

  }
  catch (error)
  {
    console.error(`Error setting user ${req.params.id} to away:`, error);
    res.status(500).json({ message: error.message }); 
  }
}