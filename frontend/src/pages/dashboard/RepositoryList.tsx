const RepositoryList = ({ repository }) => {
  return (
    <section className="order-1 lg:order-2 lg:col-span-6 lg:px-6 lg:border-r lg:border-gray-800">
      <h2 className="text-2xl font-bold mb-5">My Repositories</h2>

      <div>
        {repository.map((repo) => (
          <div
            key={repo._id}
            className="py-6 border-b border-gray-800 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-blue-400 hover:underline cursor-pointer break-all">
                {repo.name}
              </h2>

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

            <p className="mt-3 text-gray-400">{repo.description}</p>

            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
              <span>
                <span className="text-gray-300">Owner:</span>{" "}
                {repo.owner.username}
              </span>

              <span>
                <span className="text-gray-300">Files:</span>{" "}
                {repo.content.length}
              </span>

              <span>
                <span className="text-gray-300">Issues:</span>{" "}
                {repo.issues.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RepositoryList;
