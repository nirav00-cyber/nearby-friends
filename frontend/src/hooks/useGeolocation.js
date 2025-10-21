import { useState, useEffect } from 'react';

/**
 * Custom hook to get the user's current geolocation
 * @param {boolean} watch - If true, continuously watch position changes
 * @returns {Object} { location, error, loading, refetch }
 */
export const useGeolocation = (watch = false) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSuccess = (position) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    });
    setError(null);
    setLoading(false);
  };

  const handleError = (err) => {
    let errorMessage = 'Unable to retrieve location';
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
        break;
      case err.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable.';
        break;
      case err.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
      default:
        errorMessage = 'An unknown error occurred while fetching location.';
    }
    
    setError(errorMessage);
    setLoading(false);
    console.error('Geolocation error:', err);
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    let watchId;

    if (watch) {
      // Continuously watch position
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      // Get position once
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch]);

  return { location, error, loading, refetch };
};
