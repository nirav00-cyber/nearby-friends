import { useState, useEffect } from "react";
import { createUser } from "../api/friends";
import { useGeolocation } from "../hooks/useGeolocation";


export default function AddUser() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const { location, error: geoError, loading: geoLoading } = useGeolocation(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let latitude, longitude;

      if (location) {
        // Use the location from the hook
        latitude = location.latitude;
        longitude = location.longitude;
      } else {
        // Fallback: Mumbai coords if location is not available
        console.warn("Location not available, using default coords (Mumbai)");
        latitude = 19.0760;
        longitude = 72.8777;
      }

      await createUser({ ...form, latitude, longitude });
      alert("User created successfully!");
      setForm({ name: "", email: "" });
    } catch (e) {
      console.error(e);
      alert(`Failed to create user: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Create User</h1>
      
      {geoLoading && (
        <div className="card" style={{ background: '#fef3c7', borderColor: '#fbbf24', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#92400e' }}>
            📍 Fetching your location...
          </div>
        </div>
      )}
      
      {location && !geoLoading && (
        <div className="card" style={{ background: '#d1fae5', borderColor: '#10b981', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#065f46' }}>
            ✅ Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        </div>
      )}
      
      {geoError && (
        <div className="card" style={{ background: '#fee2e2', borderColor: '#ef4444', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#7f1d1d', marginBottom: 8 }}>
            ⚠️ {geoError}
          </div>
          <div style={{ fontSize: 12, color: '#991b1b' }}>
            Will use default location (Mumbai: 19.0760, 72.8777)
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving…" : "Create"}
        </button>
      </form>
    </div>
  );
}
