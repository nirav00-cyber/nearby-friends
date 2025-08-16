export default function FriendList({ friends }) {
  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ margin: "0 0 8px" }}>Friends</h3>
      {friends.length ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {friends.map((f) => (
            <li key={f._id} style={{
              padding: 10,
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              background: "#f8fafc",
            }}>
              <div style={{ fontWeight: 600 }}>{f.name}</div>
              <div style={{ fontSize: 13, color: "#64748b" }}>{f.email}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: "#64748b" }}>No friends yet.</div>
      )}
    </div>
  );
}
