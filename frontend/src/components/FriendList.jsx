import UserCard from "./UserCard";

export default function FriendList({ friends }) {
  if (!friends.length) {
    return <div className="card">No friends found.</div>;
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Friends</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {friends.map((f) => (
          <UserCard key={f._id} user={f} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
}
