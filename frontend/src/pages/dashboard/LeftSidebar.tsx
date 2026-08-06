
const LeftSidebar = ({suggestedRepository}) => {
  return (
    <aside className="order-2 lg:order-1 lg:col-span-3 lg:pr-6 lg:border-r lg:border-gray-800">
      <h2 className="text-xl font-semibold mb-5">Suggested Repositories</h2>

      <div>
        {suggestedRepository.map((repo) => (
          <div
            key={repo._id}
            className="py-5 border-b border-gray-800 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-blue-400 font-semibold hover:underline cursor-pointer break-all">
                {repo.name}
              </h3>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  repo.visibility
                    ? "bg-green-900/40 text-green-400"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {repo.visibility ? "Public" : "Private"}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-400">{repo.description}</p>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>{repo.owner.username}</span>
              <span>{repo.issues.length} Issues</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LeftSidebar;
