import LocationItem from '@/components/locations/LocationItem';

const SearchResults = ({ results, onLocationSelect }) => {
  if (!results || results.length === 0) {
    return <p>No matching locations found.</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Search Results</h2>
      {results.map((location) => (
        <LocationItem
          key={location.id}
          location={location}
          onLocationSelect={onLocationSelect}
        />
      ))}
    </div>
  );
};

export default SearchResults;
