import { useState } from "react";

const SearchBar = ({ data, onSearchResults }) => {
  const [query, setQuery] = useState(""); // Store the search input

  // Handle input changes and perform fuzzy search on the client side
  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (value.length >= 2) {
      const results = fuzzySearch(value, data); // Perform the fuzzy search on the fetched data
      if (typeof onSearchResults === "function") {
        onSearchResults(results);
      }
    } else {
      if (typeof onSearchResults === "function") {
        onSearchResults(null); // Reset the search results when the query is too short
      }
    }
  };

  // Simple fuzzy search function
  const fuzzySearch = (query, data) => {
    const lowercaseQuery = query.toLowerCase();
    if (!Array.isArray(data)) {
      return [];
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Search locations..."
      />
    </div>
  );
};

export default SearchBar;
