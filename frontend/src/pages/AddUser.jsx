import { useState } from "react";
import { createUser } from "../api/friends";


export default function AddUser() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
 

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
navigator.geolocation.getCurrentPosition(
  async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    await saveUser(latitude, longitude);
  },
  async (error) => {
    console.error("❌ Geolocation error:", error);
    alert("Could not fetch location, using default coords (Mumbai)");

    // fallback: Mumbai coords
    const latitude = 19.0760;
    const longitude = 72.8777;
    await saveUser(latitude, longitude);
  }
);

async function saveUser(latitude, longitude) {
  try {
    await createUser({ ...form, latitude, longitude });
    alert("User created successfully!");
    setForm({ name: "", email: "" });
  } catch (e) {
    console.error(e);
    alert(`Failed to create user: ${e.message}`);
  } finally {
    setSaving(false);
  }
}

};


  return (
    <div className="page">
      <h1 style={{ marginTop: 0 }}>Create User</h1>
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
