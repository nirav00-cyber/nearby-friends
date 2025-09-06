import React, { useEffect, useState } from "react";
import { getNearbyFriends } from "../api/friends";
import "./NearbyFriends.css";

const NearbyFriends = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(10000); // 10km default
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchFriends = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getNearbyFriends(userId, distance);
      setFriends(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriends();
    }
  }, [userId, distance, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusColor = (friend) => {
    if (friend.online) return "green";
    
    // If they were seen in the last 5 minutes, show as away
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (friend.lastSeen && new Date(friend.lastSeen) > fiveMinutesAgo) {
      return "orange";
    }
    return "red";
  };

  const formatDistance = (dist) => {
    if (dist === null) return "Unknown distance";
    if (dist < 1) return `${Math.round(dist * 1000)}m away`;
    return `${dist.toFixed(1)}km away`;
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Never";
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 1000 / 60);
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes/60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="nearby-friends">
      <div className="nearby-friends-header">
        <h2>Nearby Friends</h2>
        <div className="controls">
          <select 
            value={distance} 
            onChange={(e) => setDistance(Number(e.target.value))}
            className="distance-select"
          >
            <option value={1000}>1 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={50000}>50 km</option>
            <option value={100000}>100 km</option>
          </select>
          <button onClick={handleRefresh} className="refresh-button">
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading nearby friends...</div>
      ) : friends.length === 0 ? (
        <p className="no-friends">No nearby friends found within {distance/1000}km.</p>
      ) : (
        <div className="friends-list">
          {friends.map((friend) => (
            <div key={friend._id} className="friend-card">
              <div className="friend-header">
                <strong>{friend.name}</strong>
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(friend) }}
                  title={friend.online ? "Online" : `Last seen ${formatLastSeen(friend.lastSeen)}`}
                />
              </div>
              <div className="friend-details">
                <span className="friend-email">{friend.email}</span>
                <span className="friend-distance">{formatDistance(friend.distance)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyFriends;
