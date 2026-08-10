import { useRef, useState } from "react";
import { FaUserFriends, FaStar, FaMapMarkerAlt, FaLink, FaTwitter } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";
import { MdEmail, MdEdit } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const organizations = [
  { name: "OpenDev Org", initials: "OD", color: "from-purple-500 to-indigo-600" },
  { name: "React Community", initials: "RC", color: "from-blue-500 to-cyan-500" },
  { name: "NodeJS Pakistan", initials: "NP", color: "from-green-500 to-emerald-600" },
];

const LeftSidebar = () => {
  const { userProfile, avatarDataUrl, setAvatarDataUrl, currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const username = userProfile?.username ?? localStorage.getItem("username") ?? "username";
  const email = userProfile?.email ?? "";
  const followers = userProfile?.followedUsers?.length ?? 0;
  const starRepos = userProfile?.starRepos?.length ?? 0;

  // Handle avatar upload — convert to base64 and save to localStorage
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarDataUrl(result);
    };
    reader.readAsDataURL(file);
    // reset input so same file can be selected again
    e.target.value = "";
  };

  const initials = username.charAt(0).toUpperCase();

  return (
    <aside className="lg:col-span-3 w-full">
      {/* ── Avatar + Upload ── */}
      <div className="relative mb-5 w-[230px] mx-auto lg:mx-0">
        <div
          className="relative w-[230px] h-[230px] rounded-full overflow-hidden border-4 border-[#21262d] shadow-2xl shadow-black/50 cursor-pointer group"
          onMouseEnter={() => setIsHoveringAvatar(true)}
          onMouseLeave={() => setIsHoveringAvatar(false)}
          onClick={() => currentUser && fileInputRef.current?.click()}
          title={currentUser ? "Click to change avatar" : "Login to change avatar"}
        >
          {avatarDataUrl ? (
            <img src={avatarDataUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] flex items-center justify-center text-white font-bold select-none"
              style={{ fontSize: "5rem" }}
            >
              {initials}
            </div>
          )}

          {/* Hover overlay — only show when logged in */}
          {currentUser && isHoveringAvatar && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1 transition-all animate-fadeIn">
              <MdEdit className="text-white text-2xl" />
              <span className="text-white text-xs font-medium">Change photo</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        {/* Online dot */}
        {currentUser && (
          <span className="absolute w-5 h-5 bg-[#3fb950] rounded-full border-[3px] border-[#0d1117] bottom-2 right-4" />
        )}
      </div>

      {/* ── Name ── */}
      <div className="mb-4">
        <h1 className="text-[22px] font-semibold text-[#e6edf3] leading-tight break-all">
          {username}
        </h1>
        <p className="text-[16px] text-[#8b949e] font-light mt-0.5">{username}</p>
      </div>

      {/* ── Bio ── */}
      <p className="text-[13px] text-[#8b949e] leading-relaxed mb-4 italic">
        No bio yet — <a href="#" className="text-[#58a6ff] hover:underline not-italic">Edit profile</a>
      </p>

      {/* ── Action Button ── */}
      {currentUser ? (
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className="w-full py-1.5 px-4 rounded-md text-sm font-medium mb-5 border border-[#30363d] bg-[#21262d] text-[#e6edf3] hover:bg-[#292e36] hover:border-[#8b949e] transition-all duration-200 active:scale-[0.98]"
        >
          {isFollowing ? "✓ Following" : "Follow"}
        </button>
      ) : (
        <Link
          to="/login"
          className="w-full py-1.5 px-4 rounded-md text-sm font-medium mb-5 border border-[#30363d] bg-[#21262d] text-[#e6edf3] hover:bg-[#292e36] hover:border-[#8b949e] transition-all duration-200 block text-center"
        >
          Sign in to follow
        </Link>
      )}

      {/* ── Stats ── */}
      <div className="flex items-center flex-wrap gap-3 text-sm text-[#8b949e] mb-5">
        <a href="#" className="flex items-center gap-1.5 hover:text-[#58a6ff] transition-colors">
          <FaUserFriends />
          <span className="font-semibold text-[#e6edf3]">{followers}</span>
          <span>followers</span>
        </a>
        <span className="text-[#30363d] text-lg">·</span>
        <a href="#" className="hover:text-[#58a6ff] transition-colors">
          <span className="font-semibold text-[#e6edf3]">0</span>
          <span> following</span>
        </a>
        {starRepos > 0 && (
          <>
            <span className="text-[#30363d] text-lg">·</span>
            <a href="#" className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors">
              <FaStar />
              <span className="font-semibold text-[#e6edf3]">{starRepos}</span>
            </a>
          </>
        )}
      </div>

      {/* ── Info ── */}
      <div className="space-y-2 text-[13px] mb-5">
        {email && (
          <div className="flex items-center gap-2 text-[#8b949e]">
            <MdEmail className="shrink-0" />
            <span className="text-[#e6edf3] truncate">{email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-[#8b949e]">
          <FaMapMarkerAlt className="shrink-0" />
          <span className="text-[#e6edf3]">Pakistan 🇵🇰</span>
        </div>
        <div className="flex items-center gap-2 text-[#8b949e]">
          <FaLink className="shrink-0 text-xs" />
          <a href="#" className="text-[#58a6ff] hover:underline truncate">
            https://{username}.dev
          </a>
        </div>
        <div className="flex items-center gap-2 text-[#8b949e]">
          <FaTwitter className="shrink-0" />
          <a href="#" className="text-[#58a6ff] hover:underline">
            @{username}
          </a>
        </div>
      </div>

      <hr className="border-[#21262d] mb-5" />

      {/* ── Achievements ── */}
      <div className="mb-5">
        <h3 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider mb-3">
          Achievements
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Arctic Code Vault", emoji: "🏔️" },
            { label: "Pull Shark", emoji: "🦈" },
            { label: "YOLO", emoji: "🎯" },
          ].map(({ label, emoji }) => (
            <div
              key={label}
              title={label}
              className="flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] rounded-full px-2.5 py-1 text-[11px] text-[#e6edf3] hover:border-[#58a6ff] cursor-pointer transition-colors"
            >
              <span>{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[#21262d] mb-5" />

      {/* ── Organizations ── */}
      <div>
        <h3 className="text-xs font-semibold text-[#e6edf3] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <GoOrganization />
          Organizations
        </h3>
        <div className="flex flex-wrap gap-2">
          {organizations.map((org) => (
            <a
              key={org.name}
              href="#"
              title={org.name}
              className={`w-9 h-9 rounded-lg bg-gradient-to-br ${org.color} flex items-center justify-center text-white text-xs font-bold hover:scale-110 transition-transform shadow-lg`}
            >
              {org.initials}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
