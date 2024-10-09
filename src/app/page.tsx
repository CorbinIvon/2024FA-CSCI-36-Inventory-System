'use client';

import { useState, useEffect } from 'react';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import LocationList from '@/components/locations/LocationList';
import Breadcrumb from '@/components/layout/Breadcrumb';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { getLocations } from '@/utils/api'; // Import the API utility function
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/solid'; // Using Heroicons for icons
import InventoryNode, { buildNodeMap, linkNodes, flattenTree, getOrphans } from '@/utils/node'; // Import InventoryNode and related functions

type Location = InventoryNode;

export default function HomePage() {
  const [user, setUser] = useState<{ email: string; id: string } | null>(null);
  const [locations, setLocations] = useState<Location[]>([]); // Store fetched locations
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null); // For tracking current location
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Location[] | null>(null); // Store search results

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
      const response = await getLocations(); // Fetch all locations from the API

      // Convert API response to InventoryNode instances
      const nodes = response.locations.map((loc: any) => new InventoryNode(loc.id, loc.parentID, loc));

      // Build node map and link nodes
      const nodeMap = buildNodeMap(nodes);
      linkNodes(nodes, nodeMap);

      // Get root nodes (orphans)
      const rootNodes = getOrphans(nodes);

      setLocations(rootNodes);
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
    const locationsToDisplay = currentLocation ? currentLocation.children || [] : locations;

    return (
      <LocationList locations={locationsToDisplay} onLocationSelect={handleLocationSelect} />
    );
  };

  // Handle search results
  const handleSearchResults = (results: Location[] | null) => {
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-tr from-slate-900 to-slate-800 text-white">
      {!user ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Inventory Management System</h1>
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

          {/* Breadcrumb Navigation */}
          {currentLocation && (
            <Breadcrumb currentLocation={currentLocation} onNavigate={handleNavigate} />
          )}

          {/* Current Location Description */}
          {currentLocation && (
            <div className="mb-4 p-4 bg-gradient-to-tl from-slate-600 to-slate-500 shadow rounded">
              <h2 className="text-2xl font-bold">{currentLocation.data?.name as string}</h2>
              <p>{currentLocation.data?.description as string}</p>
            </div>
          )}
          <SearchBar data={flattenTree(currentLocation || { children: locations } as InventoryNode)} onSearchResults={handleSearchResults} />
          {searchResults && <SearchResults results={searchResults} onLocationSelect={handleLocationSelect} />}

          {/* Location List (show current location's children or root locations) */}
          {loading ? <p>Loading locations...</p> : renderLocations()}
        </div>
      )}
    </div>
  );
}
