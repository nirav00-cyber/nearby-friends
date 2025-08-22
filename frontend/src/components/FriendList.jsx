export default function FriendList({ friends }) {
  if (!friends.length) {
    return <div className="card">No friends found.</div>;
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Friends</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {friends.map((f) => (
          <li
            key={f._id}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div><strong>{f.name}</strong></div>
              <div className="muted">{f.email}</div>
            </div>
            {f.distance !== undefined && (
              <div style={{ fontWeight: "bold" }}>
                {f.distance} km away
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
