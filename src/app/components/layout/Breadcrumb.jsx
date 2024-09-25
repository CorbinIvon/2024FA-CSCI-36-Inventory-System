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
              className="pointer rounded bg-slate-700 hover:bg-slate-500 px-1"
            >
              {loc.name}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
