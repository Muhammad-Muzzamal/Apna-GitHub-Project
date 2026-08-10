import Navbar from "./Navbar";
import LeftSidebar from "./LeftSidebar";
import PinnedRepos from "./PinnedRepos";
import ContributionGraph from "./ContributionGraph";
import ActivityOverview from "./ActivityOverview";
import ContributionActivity from "./ContributionActivity";
import RightSidebar from "./RightSidebar";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { label: "Overview", id: "overview" },
  { label: "Repositories", id: "repos", count: true },
  { label: "Projects", id: "projects" },
  { label: "Packages", id: "packages" },
  { label: "Stars", id: "stars" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Navbar */}
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResult={[]} />

      {/* Profile Tab Bar */}
      <div className="border-b border-[#21262d] bg-[#0d1117]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-3 text-sm whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                    ? "border-[#f78166] text-[#e6edf3] font-semibold"
                    : "border-transparent text-[#8b949e] hover:text-[#e6edf3]"
                  }`}
              >
                {tab.label}
                {tab.count && userProfile && (
                  <span className="bg-[#30363d] text-[#8b949e] text-[10px] px-1.5 py-0.5 rounded-full">
                    {userProfile.repositories?.length ?? 0}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Body */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar (Profile) */}
          <div className="lg:col-span-3">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            {activeTab === "overview" && (
              <>
                <PinnedRepos />
                <ContributionGraph />
                <ActivityOverview />
                <ContributionActivity />
              </>
            )}

            {activeTab === "repos" && (
              <div className="w-full">
                <PinnedRepos />
              </div>
            )}

            {["projects", "packages", "stars"].includes(activeTab) && (
              <div className="text-[#8b949e] py-14 text-center border border-dashed border-[#30363d] rounded-xl">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-lg font-medium text-[#e6edf3] mb-2">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </p>
                <p className="text-sm">Nothing to show here yet.</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <RightSidebar />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#21262d] mt-10 py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#8b949e] text-sm">
              <svg height="18" viewBox="0 0 16 16" fill="currentColor" className="text-[#e6edf3]">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
              <span>© 2026 GitHub, Inc.</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#8b949e]">
              {["Terms", "Privacy", "Security", "Status", "Docs", "Contact"].map((item) => (
                <a key={item} href="#" className="hover:text-[#58a6ff] hover:underline transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
