import { useState, useRef, useEffect } from "react";
import {
  FaGithub,
  FaBell,
  FaCaretDown,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import { GoIssueOpened, GoRepo } from "react-icons/go";
import { FaCodePullRequest } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type NavbarProps = {
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  searchResult?: any[];
  username?: string;
};

const Navbar = ({ searchQuery = "", setSearchQuery, searchResult = [] }: NavbarProps) => {
  const { currentUser, userProfile, avatarDataUrl, setCurrentUser, setCurrentUserID } = useAuth();
  const navigate = useNavigate();

  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const createRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const username = userProfile?.username ?? localStorage.getItem("username") ?? "User";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(e.target as Node))
        setShowCreateMenu(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node))
        setShowAvatarMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    setCurrentUser(null);
    setCurrentUserID(null);
    navigate("/login");
    setShowAvatarMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#161b22] border-b border-[#30363d] text-white">
      <div className="px-4 sm:px-6 h-[62px] flex items-center justify-between gap-3 max-w-screen-2xl mx-auto">

        {/* ── Left ── */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Logo */}
          <Link to="/" className="shrink-0 text-white hover:text-gray-300 transition-colors">
            <FaGithub className="text-[26px]" />
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-2 bg-[#0d1117] border border-[#30363d] hover:border-[#58a6ff] rounded-md px-3 py-1.5 w-64 xl:w-80 transition-all duration-200 cursor-text group">
              <FaSearch className="text-[#8b949e] text-xs shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                placeholder="Search or jump to..."
                className="bg-transparent text-[#e6edf3] text-sm w-full outline-none placeholder-[#8b949e]"
              />
              <span className="text-[#8b949e] text-xs border border-[#30363d] rounded px-1 shrink-0 hidden lg:block">
                /
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-[#e6edf3]">
            {["Pull requests", "Issues", "Marketplace", "Explore"].map((item) => (
              <a
                key={item}
                href="#"
                className="px-3 py-1 rounded-md hover:bg-[#21262d] transition-colors whitespace-nowrap"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition"
          >
            <FaSearch className="text-sm" />
          </button>

          {currentUser ? (
            <>
              {/* Create dropdown */}
              <div className="relative" ref={createRef}>
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center gap-1 text-[#e6edf3] text-sm border border-[#30363d] rounded-md px-2 py-1.5 hover:bg-[#21262d] hover:border-[#8b949e] transition-all"
                >
                  <FaPlus className="text-xs" />
                  <FaCaretDown className="text-xs" />
                </button>
                {showCreateMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <Link
                      to="/repo/new"
                      onClick={() => setShowCreateMenu(false)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#e6edf3] hover:bg-[#21262d] transition-colors"
                    >
                      <GoRepo className="text-[#8b949e]" />
                      New repository
                    </Link>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#e6edf3] hover:bg-[#21262d] transition-colors">
                      <FaCodePullRequest className="text-[#8b949e]" />
                      New pull request
                    </button>
                    <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#e6edf3] hover:bg-[#21262d] transition-colors">
                      <GoIssueOpened className="text-[#8b949e]" />
                      New issue
                    </button>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-[#e6edf3] hover:bg-[#21262d] rounded-md transition border border-[#30363d] hover:border-[#8b949e]">
                <FaBell className="text-sm" />
                <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-[#1f6feb] rounded-full" />
              </button>

              {/* Avatar dropdown */}
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="flex items-center gap-1"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#30363d] hover:border-[#58a6ff] transition ring-0 hover:ring-2 hover:ring-[#1f6feb]/40">
                    {avatarDataUrl ? (
                      <img src={avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] flex items-center justify-center text-white font-bold text-xs">
                        {username[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <FaCaretDown className="text-[#8b949e] text-xs" />
                </button>

                {showAvatarMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#21262d]">
                      <p className="text-xs text-[#8b949e]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#e6edf3] truncate">{username}</p>
                    </div>
                    {[
                      { label: "Your profile", to: "/" },
                      { label: "Your repositories", to: "/" },
                      { label: "Settings", to: "/" },
                    ].map(({ label, to }) => (
                      <Link
                        key={label}
                        to={to}
                        onClick={() => setShowAvatarMenu(false)}
                        className="block px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-[#21262d]">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-[#e6edf3] hover:bg-[#21262d] transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ── Not logged in ── */
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm text-[#e6edf3] px-3 py-1.5 rounded-md hover:bg-[#21262d] border border-[#30363d] transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-[#238636] hover:bg-[#2ea043] px-3 py-1.5 rounded-md transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-fadeIn">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Search or jump to..."
            className="w-full bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm rounded-md px-3 py-2 outline-none focus:border-[#58a6ff] placeholder-[#8b949e]"
            autoFocus
          />
        </div>
      )}
    </header>
  );
};

export default Navbar;
