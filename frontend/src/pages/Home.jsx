import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../api/friends";
import UserCard from "../components/UserCard";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUsers();
        setUsers(data || []);
      } catch (e) {
        console.error(e);
        alert("Failed to load users. Is backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>All Users</h1>
      {loading ? (
        <div className="card">Loading…</div>
      ) : users.length ? (
        <div className="grid">
          {users.map((u) => (
            <UserCard key={u._id} user={u} onClick={(user) => navigate(`/users/${user._id}`)} />
          ))}
        </div>
      ) : (
        <div className="card">No users yet. Create one from the “Add User” page.</div>
      )}
    </div>
  );
}
