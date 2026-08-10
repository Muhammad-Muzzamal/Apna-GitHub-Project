import { useEffect, useRef } from "react";

// Radar/Activity chart — drawn on Canvas
const ActivityOverview = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const stats = [
        { label: "Code review", value: 0, count: 0 },
        { label: "Commits", value: 0, count: 0 },
        { label: "Issues", value: 0, count: 0 },
        { label: "Pull requests", value: 0, count: 0 },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = canvas.width;
        const H = canvas.height;
        const cx = W / 2;
        const cy = H / 2;
        const maxR = Math.min(W, H) / 2 - 30;

        ctx.clearRect(0, 0, W, H);

        const angles = [
            -Math.PI / 2,           // top (Code review)
            0,                       // right (Commits)
            Math.PI / 2,             // bottom (Issues)
            Math.PI,                 // left (Pull requests)
        ];

        // Draw grid rings
        [0.25, 0.5, 0.75, 1].forEach((r) => {
            ctx.beginPath();
            ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(48, 54, 61, 0.7)";
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw axis lines
        angles.forEach((angle) => {
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
            ctx.strokeStyle = "#21262d";
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw filled polygon
        ctx.beginPath();
        stats.forEach((s, i) => {
            const r = s.value * maxR;
            const x = cx + Math.cos(angles[i]) * r;
            const y = cy + Math.sin(angles[i]) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = "rgba(63, 185, 80, 0.18)";
        ctx.fill();
        ctx.strokeStyle = "#3fb950";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw data points
        stats.forEach((s, i) => {
            const r = s.value * maxR;
            const x = cx + Math.cos(angles[i]) * r;
            const y = cy + Math.sin(angles[i]) * r;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#3fb950";
            ctx.fill();
            ctx.strokeStyle = "#0d1117";
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Labels
        ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        ctx.fillStyle = "#8b949e";
        ctx.textAlign = "center";

        const labelOffsets = [
            { x: 0, y: -18 },
            { x: 22, y: 0 },
            { x: 0, y: 18 },
            { x: -22, y: 0 },
        ];
        stats.forEach((s, i) => {
            const lx = cx + Math.cos(angles[i]) * (maxR + 20) + labelOffsets[i].x;
            const ly = cy + Math.sin(angles[i]) * (maxR + 20) + labelOffsets[i].y;
            ctx.fillText(s.label, lx, ly);
        });
    }, []);

    return (
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 sm:p-5 mb-6">
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-[#e6edf3]">Activity overview</h3>
                <span className="text-xs text-[#8b949e]">2025</span>
            </div>

            <p className="text-xs text-[#8b949e] mb-4">
                No contributions yet. Start committing to see your activity.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Radar Chart */}
                <div className="flex items-center justify-center">
                    <canvas ref={canvasRef} width={200} height={200} className="block" />
                </div>

                {/* Legend + Stats */}
                <div className="flex-1 space-y-3">
                    {stats.map((item) => ({ ...item, color: "#3fb950", pct: 0 })).map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-[#e6edf3]">{item.label}</span>
                                    <span className="text-[#8b949e]">{item.count}</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#21262d] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivityOverview;
