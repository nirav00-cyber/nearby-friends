import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const loc = useLocation();
  const link = (to, label) => (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: loc.pathname === to ? "#fff" : "#cbd5e1",
        padding: "8px 12px",
        borderRadius: 8,
        background: loc.pathname === to ? "#3b82f6" : "transparent",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#0f172a",
      padding: "12px 18px",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 10,
      boxShadow: "0 2px 10px rgba(0,0,0,.15)"
    }}>
      <div style={{ fontWeight: 700 }}>Nearby Friends</div>
      <div style={{ display: "flex", gap: 10 }}>
        {link("/", "Home")}
        {link("/add-user", "Add User")}
        { link("/nearbyFriends", "Nearby Friends") }
      </div>
    </nav>
  );
}
