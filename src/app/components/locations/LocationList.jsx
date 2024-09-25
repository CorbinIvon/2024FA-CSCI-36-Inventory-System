import LocationItem from './LocationItem';

const LocationList = ({ locations, onLocationSelect }) => {
  if (!locations || locations.length === 0) {
    return <p>No locations available.</p>;
  }

  return (
    <div className="mt-4">
      {locations.map((location) => (
        <LocationItem
          key={location.id}
          location={location}
          onLocationSelect={onLocationSelect}
        />
      ))}
    </div>
  );
};

export default LocationList;
