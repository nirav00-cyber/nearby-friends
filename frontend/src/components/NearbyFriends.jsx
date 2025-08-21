import React, { useEffect, useState } from "react";
import { getNearbyFriends } from "../api/friends";

const NearbyFriends = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getNearbyFriends("userId", 10000000); // example: 10km
      setFriends(data);
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  if (loading) return <p>Loading nearby friends...</p>;

  if (!friends.length) return <p>No nearby friends found.</p>;

  return (
    <div>
      <h2>Nearby Friends</h2>
      <ul>
        {friends.map((f) => (
          <li key={f._id}>
            <strong>{f.name}</strong> ({f.email}) - {f.distance} km away
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbyFriends;
