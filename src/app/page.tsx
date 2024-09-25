'use client';

import { useState, useEffect } from 'react';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import LocationList from '@/components/locations/LocationList';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { getLocations } from '@/utils/api'; // Import the API utility function

type Location = {
  id: string;
  name: string;
  description: string;
  parent?: Location | null;
  children?: Location[];
};

export default function HomePage() {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [locations, setLocations] = useState<Location[]>([]); // Store fetched locations
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null); // For tracking current location
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch locations after the user signs in
      fetchLocations();
    }
  }, [user]);

  // Handle sign-in by storing user info
  const handleSignIn = (userData: { email: string; id: string }) => {
    setUser(userData);
  };

  // Fetch all locations from API and store them in state
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getLocations(); // Call the API utility function
      setLocations(response.locations.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
        description: loc.description || '',
        parent: loc.parent || null,
        children: loc.children || []
      }))); // Map the response to ensure it matches the Location type
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  };

  // Handle scoping into a location
  const handleLocationSelect = (location: Location) => {
    setCurrentLocation(location);
  };

  // Handle breadcrumb navigation (go back to a parent location)
  const handleNavigate = (location: Location) => {
    setCurrentLocation(location);
  };

  const renderLocations = () => {
    // If we're scoped into a location, show only the children of the current location
    const locationsToDisplay = currentLocation ? currentLocation.children || [] : locations;

    return (
      <LocationList locations={locationsToDisplay} onLocationSelect={handleLocationSelect} />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {!user ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Inventory Management System</h1>
          <GoogleSignIn onSignIn={handleSignIn} />
        </div>
      ) : (
        <div>
          {/* Breadcrumb Navigation */}
          {currentLocation && (
            <Breadcrumb currentLocation={currentLocation} onNavigate={handleNavigate} />
          )}

          {/* Current Location Description */}
          {currentLocation && (
            <div className="mb-4 p-4 bg-white shadow rounded">
              <h2 className="text-2xl font-bold">{currentLocation.name}</h2>
              <p>{currentLocation.description}</p>
            </div>
          )}

          {/* Location List (show current location's children or root locations) */}
          {loading ? <p>Loading locations...</p> : renderLocations()}
        </div>
      )}
    </div>
  );
}
