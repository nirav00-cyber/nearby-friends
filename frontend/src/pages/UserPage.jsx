import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getUsers, getFriends, addFriend } from "../api/friends";
import FriendList from "../components/FriendList";

export default function UserPage() {
  const { userId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // full user object
  const [friends, setFriends] = useState([]);
  const [adding, setAdding] = useState(false);
  const [candidateId, setCandidateId] = useState("");

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

  // load friends for selected user
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const { data } = await getFriends(userId);
        // your backend returns an array (populate), use as-is
        setFriends(Array.isArray(data) ? data : (data?.friends || []));
      } catch (e) {
        console.error(e);
        alert("Failed to load friends");
      }
    })();
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
      const { data } = await getFriends(userId);
      setFriends(Array.isArray(data) ? data : (data?.friends || []));
      setCandidateId("");
    } catch (e) {
      console.error(e);
      alert("Failed to add friend");
    } finally {
      setAdding(false);
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
