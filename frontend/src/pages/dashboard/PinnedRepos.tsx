import { useEffect, useState } from "react";
import { GoRepo, GoStar, GoRepoForked, GoIssueOpened } from "react-icons/go";
import { MdPublic, MdLock, MdCreateNewFolder } from "react-icons/md";
import { Link } from "react-router-dom";
import api from "../../config/api.config";
import { useAuth } from "../../context/AuthContext";
import { CgSpinner } from "react-icons/cg";

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Kotlin: "#A97BFF",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
};

type Repo = {
    _id: string;
    name: string;
    description?: string;
    visibility: boolean;
    issues: any[];
    content: any[];
    owner: { username: string };
    updatedAt?: string;
};

// ── Empty State ───────────────────────────────────────────
const EmptyState = () => (
    <div className="border border-dashed border-[#30363d] rounded-xl p-10 text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center">
            <GoRepo className="text-[#8b949e] text-3xl" />
        </div>
        <h3 className="text-[#e6edf3] font-semibold text-lg mb-2">No repositories yet</h3>
        <p className="text-[#8b949e] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Create your first repository to start managing your code and collaborating with others.
        </p>
        <Link
            to="/repo/new"
            className="inline-flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
        >
            <MdCreateNewFolder className="text-base" />
            Create your first repository
        </Link>
    </div>
);

// ── Main Component ────────────────────────────────────────
const PinnedRepos = () => {
    const { currentUser, currentUserID } = useAuth();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        if (!currentUser || !currentUserID) {
            setRepos([]);
            return;
        }

        const fetchRepos = async () => {
            setLoading(true);
            try {
                const res = await api.get("/repo/user/me", {
                    headers: { Authorization: `Bearer ${currentUser}` },
                });
                setRepos(res.data?.data ?? []);
            } catch {
                setRepos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, [currentUser, currentUserID]);

    const filtered = repos.filter((r) =>
        r.name.toLowerCase().includes(filter.toLowerCase())
    );

    // ── Not logged in ─────────────────────────────────────
    if (!currentUser) {
        return (
            <div className="border border-[#21262d] rounded-xl p-8 text-center mb-6">
                <GoRepo className="text-[#8b949e] text-4xl mx-auto mb-3" />
                <p className="text-[#8b949e] text-sm">
                    <Link to="/login" className="text-[#58a6ff] hover:underline font-medium">
                        Sign in
                    </Link>{" "}
                    to view and manage your repositories.
                </p>
            </div>
        );
    }

    // ── Loading ───────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 mb-6">
                <CgSpinner className="animate-spin text-[#58a6ff] text-3xl" />
            </div>
        );
    }

    // ── No repos ──────────────────────────────────────────
    if (repos.length === 0) {
        return <EmptyState />;
    }

    // ── Repos exist ───────────────────────────────────────
    return (
        <div className="mb-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#e6edf3]">
                    Repositories
                    <span className="text-xs text-[#8b949e] bg-[#30363d] px-2 py-0.5 rounded-full ml-2">
                        {repos.length}
                    </span>
                </h2>
                <Link
                    to="/repo/new"
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md transition-colors"
                >
                    <MdCreateNewFolder />
                    New
                </Link>
            </div>

            {/* Filter (show when more than 3 repos) */}
            {repos.length > 3 && (
                <div className="mb-4">
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Find a repository..."
                        className="w-full bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm rounded-md px-3 py-1.5 outline-none focus:border-[#58a6ff] placeholder-[#6e7681]"
                    />
                </div>
            )}

            {/* Repo Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(filter ? filtered : repos).map((repo) => (
                    <div
                        key={repo._id}
                        className="group bg-[#0d1117] border border-[#21262d] rounded-xl p-4 hover:border-[#30363d] hover:shadow-lg hover:shadow-black/20 transition-all duration-200 flex flex-col justify-between min-h-[120px] relative overflow-hidden"
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#58a6ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                        <div className="relative">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                    <GoRepo className="text-[#8b949e] shrink-0 text-sm" />
                                    <a href="#" className="text-[#58a6ff] text-sm font-semibold hover:underline truncate">
                                        {repo.name}
                                    </a>
                                </div>
                                <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#30363d] text-[#8b949e] flex items-center gap-1 shrink-0">
                                    {repo.visibility ? (
                                        <><MdPublic className="text-[9px]" /> Public</>
                                    ) : (
                                        <><MdLock className="text-[9px]" /> Private</>
                                    )}
                                </span>
                            </div>
                            <p className="text-[12px] text-[#8b949e] leading-relaxed line-clamp-2 mb-3">
                                {repo.description ? repo.description : <span className="italic opacity-60">No description provided.</span>}
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="relative flex items-center gap-4 text-[11px] text-[#8b949e] flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: LANG_COLORS["TypeScript"] }}
                                />
                                <span>TypeScript</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GoStar />
                                <span>0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GoRepoForked />
                                <span>0</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <GoIssueOpened />
                                <span>{repo.issues?.length ?? 0}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filter && filtered.length === 0 && (
                    <div className="col-span-2 py-10 text-center text-[#8b949e] text-sm border border-dashed border-[#30363d] rounded-xl">
                        No repositories match "
                        <span className="text-[#e6edf3]">{filter}</span>"
                    </div>
                )}
            </div>

            <div className="mt-4 text-center">
                <Link
                    to="/repo/new"
                    className="inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                >
                    <MdCreateNewFolder />
                    Create a new repository
                </Link>
            </div>
        </div>
    );
};

export default PinnedRepos;
