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
        console.log(`Updating online status for user ${userId}`);
        
        if (currentLocation) {
          await updateLocation(userId, {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            online: true
          });
          console.log(`Updated location and online status for user ${userId}`);
        } else {
          // If no location data, just update online status without coordinates
          await updateLocation(userId, { online: true });
          console.log(`Updated online status only (no location) for user ${userId}`);
        }
      } catch (error) {
        console.error('Failed to update online status:', error);
      }
    };

    // Initial status update
    updateOnlineStatus();

    // Set up polling
    const interval = setInterval(updateOnlineStatus, POLL_INTERVAL);
    pollInterval.current = { interval };

    // Cleanup function to run when component unmounts or userId changes
    const cleanup = async () => {
      if (pollInterval.current?.interval) {
        clearInterval(pollInterval.current.interval);
      }
      if (pollInterval.current?.visibilityTimeout) {
        clearTimeout(pollInterval.current.visibilityTimeout);
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
        // Add a delay before marking user as offline when tab is hidden
        // This prevents immediate offline status when switching tabs briefly
        const visibilityTimeout = setTimeout(() => {
          // Only execute if document is still hidden after the delay
          if (document.hidden) {
            cleanup();
          }
        }, 3000); // 3 second delay
        
        // Store timeout ID to clear it if needed
        pollInterval.current = { 
          interval: pollInterval.current?.interval,
          visibilityTimeout 
        };
      } else {
        // Clear any pending timeout that would mark user as offline
        if (pollInterval.current?.visibilityTimeout) {
          clearTimeout(pollInterval.current.visibilityTimeout);
        }
        
        updateOnlineStatus();
        // Restart polling
        if (pollInterval.current?.interval) {
          clearInterval(pollInterval.current.interval);
        }
        const interval = setInterval(updateOnlineStatus, POLL_INTERVAL);
        pollInterval.current = { interval };
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