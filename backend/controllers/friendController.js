import User from "../models/user.js";

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
    const { distance } = req.query; // in meters

    const user = await User.findById(userId);
    if (!user || !user.location) {
      return res
        .status(404)
        .json({ message: "User not found or location not set" });
    }

    // Use MongoDB $geoNear aggregation to also calculate distance
    const nearbyFriends = await User.aggregate([
      {
        $geoNear: {
          near: user.location,
          distanceField: "distance",
          spherical: true,
          maxDistance: distance ? parseInt(distance) : undefined,
          query: { _id: { $in: user.friends.map(f => new mongoose.Types.ObjectId(f)) } }
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          distance: { $round: [{ $divide: ["$distance", 1000] }, 2] }, // convert m → km
        }
      }
    ]);

    res.json(nearbyFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
