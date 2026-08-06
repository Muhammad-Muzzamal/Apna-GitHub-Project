import { FaGithub, FaUserCircle } from "react-icons/fa";

type NavbarProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  searchResult: any[];
  username: string;
};

const Navbar = ({
  searchQuery,
  setSearchQuery,
  searchResult,
  username,
}: NavbarProps) => {
  return (
    <nav className="bg-[#161B22] border-b border-gray-700">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-5">
          <FaGithub className="text-3xl text-white" />

          <div className="relative">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 rounded-md border border-gray-600 bg-[#0D1117] px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
            />

            {/* Search Suggestions */}
            {searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 max-h-80 overflow-y-auto rounded-md border border-gray-700 bg-[#161B22] shadow-lg z-50">
                {searchResult.length > 0 ? (
                  searchResult.map((repo) => (
                    <div
                      key={repo._id}
                      className="cursor-pointer border-b border-gray-700 p-3 hover:bg-[#21262D] last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-white">
                          {repo.name}
                        </h3>

                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            repo.visibility
                              ? "border-green-600 text-green-400"
                              : "border-gray-600 text-gray-300"
                          }`}
                        >
                          {repo.visibility ? "Public" : "Private"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-400 truncate">
                        {repo.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-400">
                    No repositories found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{username}</span>

          <div className="h-10 w-10 rounded-full bg-[#21262D] border border-gray-600 flex items-center justify-center">
            <FaUserCircle className="text-2xl text-gray-300" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;