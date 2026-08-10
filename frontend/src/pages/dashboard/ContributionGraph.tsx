import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

// Build a full 365-day grid with all counts = 0 (blank)
// In the future, real commit dates from the API will be merged in to light up cells
const buildContributionGrid = (commitDates: string[] = []) => {
    const data: { date: string; count: number }[] = [];
    const today = new Date();

    // Create a count map from commit dates
    const countMap: Record<string, number> = {};
    commitDates.forEach((d) => {
        const key = d.split("T")[0]; // normalise to YYYY-MM-DD
        countMap[key] = (countMap[key] ?? 0) + 1;
    });

    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        data.push({ date: dateStr, count: countMap[dateStr] ?? 0 });
    }
    return data;
};

const getColor = (count: number) => {
    if (count === 0) return "#161b22";   // blank — no commits
    if (count < 5) return "#0e4429";   // level 1
    if (count < 10) return "#006d32";   // level 2
    if (count < 15) return "#26a641";   // level 3
    return "#39d353";                   // level 4 (most active)
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "", "Wed", "", "Fri", "", ""];

const ContributionGraph = () => {
    // Pull real commit dates from user profile if available
    // userProfile.repositories could be extended later with commit timestamps
    const { userProfile } = useAuth();

    // For now we pass an empty array — all boxes start blank.
    // When the backend returns commit dates, pass them here:
    //   const commitDates = userProfile?.commitDates ?? [];
    const commitDates: string[] = [];

    const contributions = useMemo(
        () => buildContributionGrid(commitDates),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [userProfile]
    );

    const totalContributions = contributions.reduce((sum, d) => sum + d.count, 0);

    // Group into weeks (columns of 7)
    const weeks: typeof contributions[] = [];
    let week: typeof contributions = [];

    // Pad to start on Sunday
    const firstDay = new Date(contributions[0].date).getDay();
    for (let i = 0; i < firstDay; i++) week.push({ date: "", count: -1 });

    contributions.forEach((day) => {
        week.push(day);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    });
    if (week.length > 0) {
        while (week.length < 7) week.push({ date: "", count: -1 });
        weeks.push(week);
    }

    // Build month labels
    const monthLabels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((wk, wi) => {
        const realDay = wk.find((d) => d.date);
        if (!realDay) return;
        const month = new Date(realDay.date).getMonth();
        if (month !== lastMonth) {
            monthLabels.push({ label: MONTHS[month], col: wi });
            lastMonth = month;
        }
    });

    return (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 sm:p-5 mb-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#e6edf3]">
                    {totalContributions > 0 ? (
                        <>
                            <span className="text-[#3fb950]">{totalContributions.toLocaleString()}</span>{" "}
                            contributions in the last year
                        </>
                    ) : (
                        <span className="text-[#8b949e]">
                            0 contributions in the last year —{" "}
                            <span className="text-[#e6edf3] font-normal text-xs">
                                start committing to light up your graph!
                            </span>
                        </span>
                    )}
                </h3>
                <button className="text-xs text-[#8b949e] hover:text-[#58a6ff] transition-colors flex items-center gap-1">
                    Contribution settings ▾
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* Month labels */}
                    <div className="flex mb-1 ml-8">
                        {weeks.map((_, wi) => {
                            const label = monthLabels.find((m) => m.col === wi);
                            return (
                                <div key={wi} className="w-[13px] mr-[2px] shrink-0">
                                    {label && (
                                        <span className="text-[10px] text-[#8b949e] whitespace-nowrap">{label.label}</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex gap-0">
                        {/* Day labels */}
                        <div className="flex flex-col mr-2 mt-0.5">
                            {DAYS.map((day, i) => (
                                <div key={i} className="h-[13px] mb-[2px] flex items-center">
                                    <span className="text-[9px] text-[#8b949e] w-6 text-right">{day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Contribution cells */}
                        <div className="flex gap-[2px]">
                            {weeks.map((wk, wi) => (
                                <div key={wi} className="flex flex-col gap-[2px]">
                                    {wk.map((day, di) => (
                                        <div
                                            key={di}
                                            title={
                                                day.date
                                                    ? day.count > 0
                                                        ? `${day.count} contribution${day.count > 1 ? "s" : ""} on ${day.date}`
                                                        : `No contributions on ${day.date}`
                                                    : ""
                                            }
                                            className="w-[13px] h-[13px] rounded-sm transition-all hover:scale-125 hover:ring-1 hover:ring-[#58a6ff]/60 cursor-pointer"
                                            style={{
                                                backgroundColor:
                                                    day.count < 0 ? "transparent" : getColor(day.count),
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-1.5 mt-2">
                        <span className="text-[10px] text-[#8b949e]">Less</span>
                        {["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"].map((color) => (
                            <div
                                key={color}
                                className="w-[13px] h-[13px] rounded-sm"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                        <span className="text-[10px] text-[#8b949e]">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContributionGraph;
