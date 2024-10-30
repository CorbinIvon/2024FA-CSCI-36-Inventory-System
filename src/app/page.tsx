"use client";

import { useState, useEffect } from "react";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import LocationList from "@/components/locations/LocationList";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SearchBar from "@/components/search/SearchBar";
import { getLocations } from "@/utils/api"; // Import the API utility function
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/solid"; // Using Heroicons for icons

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

  type ApiLocation = {
    id: string;
    name: string;
    description?: string;
    parent?: string | null; // Assuming the API provides parent as an ID or null
    children?: ApiLocation[];
  };

  // Fetch all locations from API and store them in state
  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getLocations(); // Fetch all locations from the API

      // Recursively assign parent references and build the full parent chain
      const assignParent = (
        locations: ApiLocation[],
        parent: Location | null = null
      ): Location[] => {
        return locations.map((loc: ApiLocation) => {
          const location: Location = {
            id: loc.id,
            name: loc.name,
            description: loc.description || "",
            parent: parent, // Reference to the immediate parent
            children: [], // Initialize children, will populate below
          };

          // Recursively assign children, and pass the current location as the parent
          location.children = loc.children
            ? assignParent(loc.children, location)
            : [];

          return location;
        });
      };

      const locationsWithParents = assignParent(response.locations);
      setLocations(locationsWithParents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locations:", error);
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

  // Go back one directory (to the parent location)
  const handleGoBack = () => {
    if (currentLocation && currentLocation.parent) {
      setCurrentLocation(currentLocation.parent); // Move to the parent of the current location
    }
  };

  // Go back to the root location (home)
  const handleGoHome = () => {
    setCurrentLocation(null); // Go to root
  };

  const renderLocations = () => {
    // If we're scoped into a location, show only the children of the current location
    const locationsToDisplay = currentLocation
      ? currentLocation.children || []
      : locations;

    return (
      <LocationList
        locations={locationsToDisplay}
        onLocationSelect={handleLocationSelect}
      />
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-slate-900 to-slate-800 text-white">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Inventory Management System</h1>
        <p><a href="http://inventory-api.corbinmeier.net:18080/api/tree" target="_blank">API DEMO HERE</a></p>
      </div>
      {!user ? (
        <div className="flex flex-col items-center justify-center">
          <p>TODO - This service requires that you sign in with Google</p>
          <br />
          <GoogleSignIn onSignIn={handleSignIn} />
        </div>
      ) : (
        <div>
          {/* Back Arrow and Home Button */}
          {currentLocation && (
            <div className="flex items-center mb-4 space-x-4">
              <button
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-blue-300 hover:text-white"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleGoHome}
                className="flex items-center space-x-2 text-blue-300 hover:text-white"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </button>
            </div>
          )}
          {/* Search Bar */}
          <SearchBar data={locations} onSearchResults={setLocations} />
          {/* Breadcrumb Navigation */}
          {currentLocation && (
            <Breadcrumb
              currentLocation={currentLocation}
              onNavigate={handleNavigate}
            />
          )}
          {/* Current Location Description */}
          {currentLocation && (
            <div className="mb-4 p-4 bg-gradient-to-tl from-slate-600 to-slate-500 shadow rounded">
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
