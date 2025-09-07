import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsers, getNearbyFriends, addFriend, updateLocation } from "../api/friends";
import FriendList from "../components/FriendList";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function UserPage() {
  const { userId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // full user object
  const [friends, setFriends] = useState([]);
  const [adding, setAdding] = useState(false);
  const [candidateId, setCandidateId] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // Use our online status hook to handle presence
  useOnlineStatus(userId, currentLocation);

  // load all users (for dropdown) + identify selected user
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUsers();
        setAllUsers(data || []);
        const me = (data || []).find((u) => u._id === userId);
        setSelectedUser(me || null);
      } catch (e) {
        console.error(e);
        alert("Failed to load users");
      }
    })();
  }, [userId]);

  // helper to load friends (reused)
  const loadFriends = async () => {
    if (!userId) return;
    try {
      const { data } = await getNearbyFriends(userId);
      setFriends(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Failed to load friends");
    }
  };

  // load friends for selected user and set up polling
  useEffect(() => {
    loadFriends();
    
    // Set up polling to refresh friends list more frequently for better responsiveness
    const friendsRefreshInterval = setInterval(() => {
      loadFriends();
    }, 5000); // 5 seconds for more responsive updates
    
    return () => {
      clearInterval(friendsRefreshInterval);
    };
  }, [userId]);

  const candidates = useMemo(() => {
    const friendIds = new Set(friends.map((f) => f._id));
    return allUsers
      .filter((u) => u._id !== userId && !friendIds.has(u._id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, friends, userId]);

  const onAddFriend = async (e) => {
    e.preventDefault();
    if (!candidateId) return;
    setAdding(true);
    try {
      await addFriend({ userId, friendId: candidateId });
      // refresh friends
      await loadFriends();
      setCandidateId("");
    } catch (e) {
      console.error(e);
      alert("Failed to add friend");
    } finally {
      setAdding(false);
    }
  };

  const handleUpdateLocation = async () => {
    try {
      const lat = parseFloat(prompt("Latitude", "12.34"));
      const lng = parseFloat(prompt("Longitude", "56.78"));
      if (Number.isNaN(lat) || Number.isNaN(lng)) return alert("Invalid coords");

      // Update the current location state so our hook can use it
      const newLocation = { latitude: lat, longitude: lng };
      setCurrentLocation(newLocation);
      
      await updateLocation(userId, { ...newLocation, online: true });
      await loadFriends();
    } catch (e) {
      console.error(e);
      alert("Failed to update location");
    }
  };

  if (!selectedUser) {
    return (
      <div className="page">
        <div className="card">Loading user…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>{selectedUser.name}</h1>
      <div className="muted">{selectedUser.email}</div>

      <div style={{ marginTop: 8 }}>
        <button className="btn" onClick={handleUpdateLocation}>Update my location</button>
      </div>

      <FriendList friends={friends} />

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Add Friend</h3>
        <form onSubmit={onAddFriend} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={candidateId}
            onChange={(e) => setCandidateId(e.target.value)}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #e2e8f0", flex: 1 }}
          >
            <option value="">Select a user…</option>
            {candidates.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!candidateId || adding}
            className="btn"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}
