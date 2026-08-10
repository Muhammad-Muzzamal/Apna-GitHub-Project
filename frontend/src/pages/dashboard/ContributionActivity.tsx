import { useState } from "react";
import { GoRepo, GoIssueOpened, GoRepoForked } from "react-icons/go";
import { VscGitCommit } from "react-icons/vsc";
import { FaCodePullRequest } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ContribEntry = {
    id: number;
    date: string;
    monthLabel?: string;
    type: "commits" | "issue_opened" | "issue_closed" | "pr" | "fork" | "repo_created";
    title: string;
    repos: { name: string; href: string }[];
    count?: number;
    details?: { text: string; label?: string; href: string }[];
    badge?: { text: string; color: string };
    special?: React.ReactNode;
};

// No fake entries — will be populated from real backend data
const ENTRIES: ContribEntry[] = [];

const typeIcons: Record<string, React.ReactNode> = {
    commits: <VscGitCommit className="text-[#3fb950]" />,
    issue_opened: <GoIssueOpened className="text-[#3fb950]" />,
    issue_closed: <GoIssueOpened className="text-[#8b949e]" />,
    pr: <FaCodePullRequest className="text-[#a5a0f7]" />,
    fork: <GoRepoForked className="text-[#58a6ff]" />,
    repo_created: <GoRepo className="text-[#58a6ff]" />,
};

const ContributionActivity = () => {
    const { currentUser } = useAuth();
    const [expandedIds, setExpandedIds] = useState<number[]>([]);

    const toggle = (id: number) => {
        setExpandedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-[#e6edf3]">Contribution activity</h2>
                <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                    <button className="hover:text-[#58a6ff] transition-colors font-medium text-[#e6edf3]">2026</button>
                    <button className="hover:text-[#58a6ff] transition-colors">2025</button>
                    <button className="hover:text-[#58a6ff] transition-colors">2024</button>
                </div>
            </div>

            {ENTRIES.length === 0 ? (
                /* ── Empty State ── */
                <div className="border border-dashed border-[#30363d] rounded-xl py-12 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center">
                        <VscGitCommit className="text-[#8b949e] text-2xl" />
                    </div>
                    <p className="text-sm font-medium text-[#e6edf3] mb-1">
                        No contribution activity yet
                    </p>
                    <p className="text-xs text-[#8b949e] mb-5 max-w-xs mx-auto leading-relaxed">
                        When you create a repository, open issues, or make commits, your activity will appear here.
                    </p>
                    {currentUser ? (
                        <Link
                            to="/repo/new"
                            className="inline-flex items-center gap-2 text-xs font-semibold bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md transition-colors"
                        >
                            <GoRepo />
                            Create a repository
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-xs font-semibold border border-[#30363d] bg-[#21262d] hover:bg-[#292e36] text-[#e6edf3] px-4 py-2 rounded-md transition-colors"
                        >
                            Sign in to see activity
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {ENTRIES.map((entry, idx) => (
                        <div key={entry.id} className="relative mb-6">
                            {/* Month label */}
                            {entry.monthLabel && (
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-sm font-semibold text-[#e6edf3]">{entry.monthLabel}</h3>
                                    <div className="flex-1 h-px bg-[#21262d]" />
                                </div>
                            )}

                            {/* Timeline entry */}
                            <div className="flex gap-3">
                                {/* Icon + line */}
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center text-sm shrink-0">
                                        {typeIcons[entry.type]}
                                    </div>
                                    {idx < ENTRIES.length - 1 && (
                                        <div className="w-px flex-1 bg-[#21262d] mt-1" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0 pb-2">
                                    <div className="flex items-start gap-2 flex-wrap">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-[#e6edf3] font-medium leading-snug mb-0.5">
                                                {entry.title}
                                            </p>
                                            <span className="text-xs text-[#8b949e]">{entry.date}</span>
                                        </div>
                                        {entry.badge && (
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${entry.badge.color} shrink-0`}>
                                                {entry.badge.text}
                                            </span>
                                        )}
                                        {entry.details && entry.details.length > 0 && (
                                            <button
                                                onClick={() => toggle(entry.id)}
                                                className="text-xs text-[#8b949e] border border-[#30363d] rounded-full px-2.5 py-0.5 hover:border-[#8b949e] hover:text-[#e6edf3] transition-all shrink-0"
                                            >
                                                {expandedIds.includes(entry.id) ? "▴" : "▾"}
                                            </button>
                                        )}
                                    </div>

                                    {entry.special && (
                                        <div className="mt-3 max-w-sm">{entry.special}</div>
                                    )}

                                    {expandedIds.includes(entry.id) && entry.details && entry.details.length > 0 && (
                                        <div className="mt-3 bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
                                            {entry.details.map((d, di) => (
                                                <div
                                                    key={di}
                                                    className="flex items-center justify-between px-4 py-2.5 border-b border-[#21262d] last:border-b-0 hover:bg-[#21262d]/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <VscGitCommit className="text-[#3fb950] text-sm shrink-0" />
                                                        <a href={d.href} className="text-[#58a6ff] text-xs hover:underline truncate">
                                                            {d.text}
                                                        </a>
                                                    </div>
                                                    {d.label && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1f6feb]/20 text-[#58a6ff] border border-[#1f6feb]/30 shrink-0 ml-2">
                                                            {d.label}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <button className="w-full py-2.5 text-sm text-[#58a6ff] hover:text-[#79c0ff] border border-[#21262d] rounded-xl hover:bg-[#161b22] transition-all flex items-center justify-center gap-2">
                        Show more activity
                    </button>
                </>
            )}
        </div>
    );
};

export default ContributionActivity;
