import React, { useEffect, useState } from "react";

import { MdCreateNewFolder } from "react-icons/md";

const RepositoryList = ({ repository }) => {
  const [sortValue, setSortValue] = useState<string>("");
  const [sortedRepositories, setSortedRepositories] = useState(repository);

  useEffect(() => {
    setSortedRepositories(repository);
  }, [repository]);

  const handleSortValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    if (e.target.value === "default") {
      setSortedRepositories(repository);
      return;
    }
    if (e.target.value === "name") {
      const sorted = [...sortedRepositories].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setSortedRepositories(sorted);
      return;
    }
    if (e.target.value === "default") {
      const sorted = [...sortedRepositories].sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
      setSortedRepositories(sorted);
      return;
    }
  };

  return (
    <section className="order-1 lg:order-2 lg:col-span-9 lg:px-6  lg:border-gray-800">
      <h2 className="text-2xl font-bold mb-5">My Repositories</h2>
      <div className="flex justify-start items-center space-x-5 mb-3">
        <input
          type="text"
          className="outline outline-gray-600 w-100 py-1 rounded-md px-2 focus:ring-[#1F6FEB] focus:ring-2 transition focus:outline-none"
          placeholder="Find a repository..."
        />
        <select
          name="sort"
          id="sort"
          className="border bg-[#262C36] px-3 py-1 border border-gray-600 rounded-md"
          onChange={handleSortValue}
        >
          <option value="">Sort</option>
          <option value="name">Name</option>
          <option value="update">update</option>
          <option value="default">default</option>
        </select>

        <button className="bg-[#29903B] flex items-center px-3 py-1 rounded-md">
          <MdCreateNewFolder className="mr-2" />
          New
        </button>
      </div>
      <hr className="border-gray-600" />

      <div>
        {sortedRepositories.map((repo) => (
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
