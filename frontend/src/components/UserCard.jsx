export default function UserCard({ user, onClick }) {
  return (
    <div
      onClick={() => onClick(user)}
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
      <div style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</div>
      <div style={{ fontSize: 13, color: "#64748b" }}>{user.email}</div>
    </div>
  );
}
