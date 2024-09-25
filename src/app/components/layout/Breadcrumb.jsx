export default function Breadcrumb({ currentLocation, onNavigate }) {
  const buildBreadcrumb = (location) => {
    const trail = [];
    let current = location;

    while (current) {
      trail.unshift(current); // Add to the beginning
      current = current.parent; // Move up the chain to the parent
    }

    return trail;
  };

  const breadcrumbTrail = buildBreadcrumb(currentLocation);

  return (
    <nav className="mb-4">
      <ol className="flex space-x-2">
        {breadcrumbTrail.map((loc, index) => (
          <li key={loc.id}>
            <button
              onClick={() => onNavigate(loc)}
              className="text-blue-600 hover:underline"
            >
              {loc.name}
            </button>
            {index < breadcrumbTrail.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
