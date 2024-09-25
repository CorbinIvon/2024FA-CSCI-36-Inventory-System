// src/components/locations/LocationItem.jsx
export default function LocationItem({ location, onLocationSelect }) {
  const handleClick = () => {
    onLocationSelect(location); // Pass the clicked location to the parent
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 border rounded bg-slate-700 hover:bg-slate-500"
    >
      <h2 className="text-lg font-semibold">{location.name}</h2>
      <p className="text-sm text-gray-600">{location.description}</p>
    </div>
  );
}
