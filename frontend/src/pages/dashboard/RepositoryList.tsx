import React, { useEffect, useState } from "react";

import { CiStar } from "react-icons/ci";
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

  const handleFilteredRepo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().replace(/\s+/g, "-");
    if (value === "") {
      setSortedRepositories(repository);
    } else {
      const filtered = repository.filter((repo) => {
        const nameMatch = repo.name.toLowerCase().includes(value);
        const descMatch =
          repo.description?.toLowerCase().includes(value) || false;
        return nameMatch || descMatch;
      });
      setSortedRepositories(filtered);
    }
  };

  return (
    <section className="order-1 lg:order-2 lg:col-span-9 lg:px-6  lg:border-gray-800">
      <h2 className="text-2xl font-bold mb-5">My Repositories</h2>

      <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap justify-start items-stretch sm:items-center gap-3 mb-3">
        <input
          type="text"
          className="outline outline-gray-600 w-full sm:flex-1 lg:w-100 py-1 rounded-md px-2 focus:ring-[#1F6FEB] focus:ring-2 transition focus:outline-none"
          placeholder="Find a repository..."
          onChange={handleFilteredRepo}
        />

        <select
          name="sort"
          id="sort"
          className="border bg-[#262C36] px-3 py-1 border-gray-600 rounded-md w-full sm:w-auto"
          onChange={handleSortValue}
        >
          <option value="">Sort</option>
          <option value="name">Name</option>
          <option value="update">update</option>
          <option value="default">default</option>
        </select>

        <button className="bg-[#29903B] flex items-center justify-center px-3 py-1 rounded-md w-full sm:w-auto">
          <MdCreateNewFolder className="mr-2" />
          New
        </button>
      </div>

      <hr className="border-gray-600" />

      <div>
        {sortedRepositories.length > 0 ? (
          sortedRepositories.map((repo) => (
            <div
              key={repo._id}
              className="py-6 border-b border-gray-800 last:border-b-0"
            >
              <div className="flex  items-center justify-between">
                <div className="flex items-center justify-start space-x-4">
                  <h2 className="text-xl font-semibold text-blue-400 hover:underline cursor-pointer break-all">
                    {repo.name}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1  rounded-full border border-gray-600 text-gray-400`}
                  >
                    {repo.visibility ? "Public" : "Private"}
                  </span>
                </div>
                <span className="border border-gray-600 bg-[#262C36] flex items-center px-2 gap-2 rounded-md cursor-pointer">
                  <CiStar />
                  Star
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
          ))
        ) : (
          <div className="py-10 text-center text-gray-400">
            {" "}
            No repository found{" "}
          </div>
        )}
      </div>
    </section>
  );
};

export default RepositoryList;
