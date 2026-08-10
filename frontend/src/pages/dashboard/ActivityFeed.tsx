import { useEffect, useState } from "react";
import { GoRepo, GoRepoForked, GoIssueOpened, GoStar } from "react-icons/go";
import { FaCodePullRequest } from "react-icons/fa6";
import { VscGitCommit } from "react-icons/vsc";

type ActivityEvent = {
    id: number;
    type: "push" | "fork" | "issue" | "pr" | "star" | "create";
    user: string;
    userColor: string;
    repo: string;
    message: string;
    time: string;
    icon: React.ReactNode;
    iconBg: string;
};

const mockEvents: ActivityEvent[] = [
    {
        id: 1, type: "push", user: "Muhammad-Muzzamal", userColor: "text-[#58a6ff]",
        repo: "apna-github-project",
        message: "Pushed 3 commits to main branch",
        time: "2 hours ago",
        icon: <VscGitCommit />, iconBg: "bg-[#161b22] border-[#30363d]",
    },
    {
        id: 2, type: "star", user: "amna_coder", userColor: "text-[#58a6ff]",
        repo: "scroll-guard-android",
        message: "starred your repository",
        time: "5 hours ago",
        icon: <GoStar />, iconBg: "bg-yellow-900/30 border-yellow-600/30",
    },
    {
        id: 3, type: "pr", user: "dev.hamza", userColor: "text-[#58a6ff]",
        repo: "apna-github-project",
        message: "Opened a pull request: Add JWT auth to backend",
        time: "8 hours ago",
        icon: <FaCodePullRequest />, iconBg: "bg-purple-900/30 border-purple-600/30",
    },
    {
        id: 4, type: "issue", user: "Muhammad-Muzzamal", userColor: "text-[#58a6ff]",
        repo: "devcollab-platform",
        message: "Closed issue #12: Fix dashboard layout overflow",
        time: "1 day ago",
        icon: <GoIssueOpened />, iconBg: "bg-red-900/30 border-red-600/30",
    },
    {
        id: 5, type: "fork", user: "zara.codes", userColor: "text-[#58a6ff]",
        repo: "scroll-guard-android",
        message: "forked your repository",
        time: "1 day ago",
        icon: <GoRepoForked />, iconBg: "bg-blue-900/30 border-blue-600/30",
    },
    {
        id: 6, type: "create", user: "Muhammad-Muzzamal", userColor: "text-[#58a6ff]",
        repo: "react-component-lib",
        message: "Created new repository",
        time: "2 days ago",
        icon: <GoRepo />, iconBg: "bg-green-900/30 border-green-600/30",
    },
    {
        id: 7, type: "push", user: "Muhammad-Muzzamal", userColor: "text-[#58a6ff]",
        repo: "devcollab-platform",
        message: "Pushed 7 commits to feature/kanban-board",
        time: "2 days ago",
        icon: <VscGitCommit />, iconBg: "bg-[#161b22] border-[#30363d]",
    },
    {
        id: 8, type: "star", user: "ahmed.fullstack", userColor: "text-[#58a6ff]",
        repo: "apna-github-project",
        message: "starred your repository",
        time: "3 days ago",
        icon: <GoStar />, iconBg: "bg-yellow-900/30 border-yellow-600/30",
    },
];

const ActivityFeed = () => {
    const [visible, setVisible] = useState(5);

    return (
        <div>
            <h2 className="text-base font-semibold text-[#e6edf3] mb-4">Recent Activity</h2>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#21262d]" />

                <div className="space-y-0">
                    {mockEvents.slice(0, visible).map((event, idx) => (
                        <div
                            key={event.id}
                            className="relative flex gap-4 pb-5 group"
                            style={{ animationDelay: `${idx * 60}ms` }}
                        >
                            {/* Icon bubble */}
                            <div
                                className={`relative z-10 w-10 h-10 shrink-0 rounded-full border ${event.iconBg} flex items-center justify-center text-[#e6edf3] text-sm group-hover:scale-110 transition-transform`}
                            >
                                {event.icon}
                            </div>

                            {/* Content card */}
                            <div className="flex-1 min-w-0 bg-[#161b22] border border-[#21262d] rounded-lg px-3 py-2.5 hover:border-[#30363d] transition-all group-hover:shadow-md">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm text-[#e6edf3] leading-snug">
                                        <span className={`font-semibold ${event.userColor} hover:underline cursor-pointer`}>
                                            {event.user}
                                        </span>{" "}
                                        {event.message}{" "}
                                        <a href="#" className="text-[#58a6ff] hover:underline font-medium">
                                            {event.repo}
                                        </a>
                                    </p>
                                    <span className="text-[11px] text-[#6e7681] shrink-0 mt-0.5 whitespace-nowrap">
                                        {event.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {visible < mockEvents.length && (
                <button
                    onClick={() => setVisible(mockEvents.length)}
                    className="w-full mt-2 py-2 text-sm text-[#58a6ff] hover:text-[#79c0ff] border border-[#21262d] rounded-lg hover:bg-[#161b22] transition-all"
                >
                    Show more activity
                </button>
            )}
        </div>
    );
};

export default ActivityFeed;
