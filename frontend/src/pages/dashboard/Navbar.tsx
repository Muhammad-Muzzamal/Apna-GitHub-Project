import { FaCaretDown, FaGithub, FaUserCircle } from "react-icons/fa";
import { FaCodePullRequest, FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { FiInbox } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoIssueOpened } from "react-icons/go";
import { Link } from "react-router-dom";
import { RiGitRepositoryLine } from "react-icons/ri";
import api from "../../config/api.config";
import { useAuth } from "../../context/AuthContext";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [repositoryCount, setRepositoryCount] = useState<number>(0);
  const { currentUser, userName } = useAuth();

  const pathname = window.location.pathname;

  useEffect(() => {
    const fetchRepositories = async () => {
      const response = await api.get("/repo/user/me");
      const repositorries = response?.data?.data;
      // console.log(repositorries.length);
      setRepositoryCount(repositorries.length);
    };
    fetchRepositories();
  }, [repositoryCount]);

  const navItems = [
    {
      label: "Overview",
      path: "/profile",
    },
    {
      label: "Repositories",
      path: "/dashboard",
      count: repositoryCount,
    },
    {
      label: "Projects",
      path: "/projects",
    },
    {
      label: "Stars",
      path: "/stars",
      count: 71,
    },
  ];

  return (
    <nav className="bg-[#010409] text-white border-b border-gray-800">
      {/* Upper Part */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=" text-gray-300 p-2 rounded-md hover:bg-[#21262D] border border-gray-600"
            >
              <GiHamburgerMenu className="text-xl" />
            </button>

            {/* GitHub Logo */}
            <FaGithub className="text-3xl shrink-0" />

            {/* Username */}
            <span className="font-semibold text-sm sm:text-base truncate">
              {userName}
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <div className="hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline outline-gray-600 w-40 md:w-50 py-1.5 rounded-md px-2 bg-[#0D1117] text-sm focus:ring-[#1F6FEB] focus:ring-2 transition focus:outline-none"
                placeholder="Type to search"
              />
            </div>

            {/* Create */}
            <div className="text-gray-400 p-2 border border-gray-600 rounded-md flex justify-between items-center gap-2 cursor-pointer hover:bg-[#21262D]">
              <FaPlus />
              <FaCaretDown className="hidden sm:block" />
            </div>

            {/* Issue */}
            <div className="hidden md:flex text-gray-400 p-2 border border-gray-600 rounded-md hover:bg-[#21262D] cursor-pointer">
              <GoIssueOpened />
            </div>

            {/* Pull Request */}
            <div className="hidden lg:flex text-gray-400 p-2 border border-gray-600 rounded-md hover:bg-[#21262D] cursor-pointer">
              <FaCodePullRequest />
            </div>

            {/* Repository */}
            <div className="hidden lg:flex text-gray-400 p-2 border border-gray-600 rounded-md hover:bg-[#21262D] cursor-pointer">
              <RiGitRepositoryLine />
            </div>

            {/* Inbox */}
            <div className="hidden md:flex text-gray-400 p-2 border border-gray-600 rounded-md hover:bg-[#21262D] cursor-pointer">
              <FiInbox />
            </div>

            {/* Profile */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full bg-[#21262D] border border-gray-600 flex items-center justify-center">
              <FaUserCircle className="text-2xl text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full outline outline-gray-600 py-2 rounded-md px-3 bg-[#0D1117] text-sm focus:ring-[#1F6FEB] focus:ring-2 transition focus:outline-none"
          placeholder="Type to search"
        />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-800 px-4 py-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 p-2 text-gray-300 hover:bg-[#15191F] rounded-md">
              <GoIssueOpened />
              <span>Issues</span>
            </div>

            <div className="flex items-center gap-3 p-2 text-gray-300 hover:bg-[#15191F] rounded-md">
              <FaCodePullRequest />
              <span>Pull Requests</span>
            </div>

            <div className="flex items-center gap-3 p-2 text-gray-300 hover:bg-[#15191F] rounded-md">
              <RiGitRepositoryLine />
              <span>Repositories</span>
            </div>

            <div className="flex items-center gap-3 p-2 text-gray-300 hover:bg-[#15191F] rounded-md">
              <FiInbox />
              <span>Inbox</span>
            </div>
          </div>
        </div>
      )}

      {/* Lower Part */}
      {window.location.pathname === "/repo/new" ? (
        <></>
      ) : (
        <div className="overflow-x-auto scrollbar-hide">
          <ul className="flex justify-start items-center px-4 sm:px-6 lg:px-13 space-x-2 sm:space-x-5 text-sm min-w-max">
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  className={`
                  px-2 sm:px-3
                  py-2
                  whitespace-nowrap
                  hover:bg-[#15191F]
                  rounded-t-md
                  cursor-pointer
                  ${
                    isActive
                      ? "border-b-2 border-[#F78166]"
                      : "border-b-2 border-transparent"
                  }
                `}
                  to={`${item.path}`}
                >
                  {item.label}

                  {item.count && (
                    <span className="bg-[#252A31] px-1.5 rounded-xl ml-2 text-xs">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
