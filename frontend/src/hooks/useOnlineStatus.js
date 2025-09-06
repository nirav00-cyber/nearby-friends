import { useEffect, useRef } from 'react';
import { updateLocation, setAway } from '../api/friends';

const POLL_INTERVAL = 60000; // 1 minute in milliseconds

export const useOnlineStatus = (userId, currentLocation) => {
  const pollInterval = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Function to update online status
    const updateOnlineStatus = async () => {
      try {
        if (currentLocation) {
          await updateLocation(userId, {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            online: true
          });
        }
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    };

    // Initial status update
    updateOnlineStatus();

    // Set up polling
    pollInterval.current = setInterval(updateOnlineStatus, POLL_INTERVAL);

    // Cleanup function to run when component unmounts or userId changes
    const cleanup = async () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
      try {
        await setAway(userId);
      } catch (error) {
        console.error('Failed to set user as away:', error);
      }
    };

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanup();
      } else {
        updateOnlineStatus();
        // Restart polling
        if (pollInterval.current) {
          clearInterval(pollInterval.current);
        }
        pollInterval.current = setInterval(updateOnlineStatus, POLL_INTERVAL);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount or when userId changes
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanup();
    };
  }, [userId, currentLocation]);
};