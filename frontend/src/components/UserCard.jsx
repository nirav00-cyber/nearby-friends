export default function UserCard({ user, onClick })
{
  // helper to format "time ago" for lastSeen
  function timeAgo(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  return (
    <div
      onClick={() => onClick && onClick(user)}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        background: "#ffffff",
        cursor: "pointer",
        transition: "transform .08s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{user.email}</div>
        </div>

        <div style={{ marginLeft: 12, textAlign: "right", minWidth: 90 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: user?.online ? "#10B981" : "#9CA3AF",
                marginBottom: 6,
              }}
              title={user?.online ? "Online" : "Offline"}
            />

            {!user?.online && user?.lastSeen && (
              <div style={{ fontSize: 11, color: "#94A3B8" }}>{`Last seen ${timeAgo(user.lastSeen)}`}</div>
            )}

            {user?.distance !== null && user?.distance !== undefined && (
              <div style={{ fontSize: 12, fontWeight: 700 }}>{user.distance} km</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
