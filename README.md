# Nearby Friends

Objective
---------
This prototype demonstrates a small "nearby friends" app: create users, add friends, and display friends with their distance from the current user. The long-term goal is a simple map-and-presence experience where:

- All friends are listed (near or far).
- Online friends appear with a green indicator (live location when reported).
- Offline friends show their last-known location and a "last seen" timestamp (in gray).
- Users can update/report their location (so positions can change over time).
- A map view will plot online locations and last-known positions for offline friends.

Current status (what's implemented now)
---------------------------------------
- Backend:
  - User model with GeoJSON `location` and `friends` array (2dsphere index).
  - `createUser` endpoint to create users with a static location.
  - `addFriend` endpoint that updates both users' `friends` arrays.
  - `getNearbyFriends` controller that computes distances (Haversine) and returns friends within an optional distance filter.
- Frontend:
  - Basic React UI with `UserCard`, `FriendList`, `NearbyFriends` components.
  - Pages to create users and add friends.
  - Calls to the backend `getNearbyFriends` API to show friends and distances.

Notes: location is currently set only at user creation time and is static. There is no presence (online/offline) tracking or real-time updates yet. No map integration exists yet.

Checklist — Done
----------------
1. User schema with GeoJSON `location` and 2dsphere index — Done
2. Create user API (`/api/friends/create`) that stores initial location — Done
3. Add friend API (`/api/friends/add-friend`) that makes friendships mutual — Done
4. Controller `getNearbyFriends` that computes distances and returns friends (with optional `distance` filter) — Done
5. Frontend skeleton and components to display users and friends — Done

Checklist — Next steps (chronological, minimal increments)
---------------------------------------------------------
1. Add presence and last-location fields to the model
   - Add `online: Boolean`, `lastSeen: Date`, `lastLocation: GeoJSON` to `User` model.
2. Add presence/location update endpoints (backend)
   - POST `/api/users/:id/location` — body: `{ latitude, longitude, online = true }` to update `lastLocation`, `location` (optional), set `online: true`, update `lastSeen`.
   - POST `/api/users/:id/away` — set `online: false` and update `lastSeen`.
3. Modify friends endpoint to always return all friends
   - Create `getFriendsWithDistance` (or update `getNearbyFriends`) to return every friend with: `_id`, `name`, `email`, `online`, `lastSeen`, `location`/`lastLocation`, and computed `distance` (when coords available). Keep optional `maxDistance` as a filter.
4. Frontend: display presence and last-seen
   - Update API client to consume new fields.
   - In `FriendList` / `UserCard`, show a small green indicator for `online === true`.
   - When offline, show "last seen X minutes ago" in gray and show last-known coordinates.
5. Add a client control to report current user location (for testing)
   - Button to call `/api/users/:id/location` (or use browser Geolocation) so you can simulate movement.
6. Add periodic polling or WebSocket updates (choose one)
   - Short-term: poll friends endpoint every 10–30s to update positions.
   - Longer-term: add Socket.IO or WebSocket-based presence to push updates in real time.
7. Map integration
   - Add a map (Leaflet or Google Maps) component to plot online friends (green) and offline last-known positions (gray). Add popups showing name, distance, and last seen.
8. UX polish and tests
   - Add small unit tests for distance calculation and backend endpoints.
   - Add basic e2e/manual steps in README for testing presence and map.

How to run (dev)
-----------------
Open two terminals and run backend and frontend separately.

PowerShell (backend):
```powershell
cd backend
npm install
# ensure .env has MONGO_URI
node server.js
```

PowerShell (frontend):
```powershell
cd frontend
npm install
npm run dev
```

What's next (if you want me to implement changes)
-------------------------------------------------
- I can implement the minimal backend model changes and presence endpoints first (steps 1–2) and update the friends endpoint (step 3). Then I can update the frontend to show online/last-seen indicators and add a manual "Update my location" button (steps 4–5).

If that plan looks good, tell me to proceed and I'll start implementing the backend model + endpoints first.
