import { GoIssueOpened } from "react-icons/go";
import { FaCodePullRequest } from "react-icons/fa6";
import { VscGitCommit } from "react-icons/vsc";
import { useAuth } from "../../context/AuthContext";

const suggestions = [
  { name: "vercel/next.js", desc: "The React Framework", lang: "JavaScript", langColor: "#f1e05a", stars: "122k" },
  { name: "microsoft/vscode", desc: "Visual Studio Code", lang: "TypeScript", langColor: "#3178c6", stars: "164k" },
  { name: "facebook/react", desc: "The library for web UIs", lang: "JavaScript", langColor: "#f1e05a", stars: "227k" },
];

const RightSidebar = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <aside className="space-y-4">
        {/* Explore repositories */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-[#21262d]">
            <h3 className="text-sm font-semibold text-[#e6edf3]">Explore repositories</h3>
          </div>
          <div className="divide-y divide-[#21262d]">
            {suggestions.map((repo) => (
              <div key={repo.name} className="px-4 py-3 hover:bg-[#21262d]/50 transition-colors">
                <a href="#" className="text-sm font-semibold text-[#58a6ff] hover:underline block truncate">
                  {repo.name}
                </a>
                <p className="text-[12px] text-[#8b949e] mt-0.5 mb-2 line-clamp-2">{repo.desc}</p>
                <div className="flex items-center gap-3 text-[11px] text-[#8b949e]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: repo.langColor }} />
                    {repo.lang}
                  </span>
                  <span>⭐ {repo.stars}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-[#21262d]">
            <a href="#" className="text-xs text-[#58a6ff] hover:underline">
              Explore more →
            </a>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      {/* Latest activity */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e6edf3]">Latest activity</h3>
          <span className="text-[10px] text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>
        <div className="px-4 py-4 text-center">
          <div className="w-10 h-10 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center mx-auto mb-3">
            <VscGitCommit className="text-[#8b949e] text-lg" />
          </div>
          <p className="text-sm text-[#8b949e]">No recent events.</p>
          <p className="text-xs text-[#6e7681] mt-1 leading-relaxed">
            Activity from repositories you star or follow will appear here.
          </p>
        </div>
      </div>

      {/* Open issues */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e6edf3]">Open issues</h3>
          <GoIssueOpened className="text-[#3fb950] text-sm" />
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-sm text-[#8b949e]">No open issues.</p>
          <p className="text-xs text-[#6e7681] mt-1">
            Issues assigned to you will appear here.
          </p>
        </div>
      </div>

      {/* Pull requests */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#21262d] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#e6edf3]">Pull requests</h3>
          <FaCodePullRequest className="text-[#a5a0f7] text-sm" />
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-sm text-[#8b949e]">No pull requests.</p>
          <p className="text-xs text-[#6e7681] mt-1">
            PRs waiting for your review will appear here.
          </p>
        </div>
      </div>

      {/* Explore */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#21262d]">
          <h3 className="text-sm font-semibold text-[#e6edf3]">Explore repositories</h3>
        </div>
        <div className="divide-y divide-[#21262d]">
          {suggestions.map((repo) => (
            <div key={repo.name} className="px-4 py-3 hover:bg-[#21262d]/50 transition-colors">
              <a href="#" className="text-sm font-semibold text-[#58a6ff] hover:underline block truncate">
                {repo.name}
              </a>
              <p className="text-[12px] text-[#8b949e] mt-0.5 mb-2">{repo.desc}</p>
              <div className="flex items-center gap-3 text-[11px] text-[#8b949e]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: repo.langColor }} />
                  {repo.lang}
                </span>
                <span>⭐ {repo.stars}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-[#21262d]">
          <a href="#" className="text-xs text-[#58a6ff] hover:underline">Explore more →</a>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
