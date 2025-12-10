import React from "react";

type ScheduleItem = {
    session: string;
    dateLabel: string; // contoh: "Sabtu, 10 Agustus"
    materi: string;
    coach: string;
};

const items: ScheduleItem[] = [
    {
        session: "Session I",
        dateLabel: "Jum'at, 19 Agustus",
        materi: "Uncovering the Dark Side of the ProFirm Industry",
        coach: " Indra",
    },
    {
        session: "Session II",
        dateLabel: "Sabtu, 20 Agustus",
        materi: "In-Depth Technical Analysis",
        coach: "Indra",
    },
    {
        session: "Session III",
        dateLabel: "Minggu, 21 Agustus",
        materi:
            "Live Trading Using Advanced Tools for ProFirm System Algorithmic Protection",
        coach: "Indra",
    },
];

export default function JadwalSession() {
    return (
        <section className="rounded-2xl p-6 md:p-7 bg-gradient-to-b from-[#0a1220] to-[#070c14] border border-amber-400/20 shadow-[0_16px_34px_rgba(0,0,0,0.55)]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-4">
                <h2 className="text-lg font-extrabold text-white">Jadwal Session</h2>
                <p className="text-sm text-white/70">Hari & tanggal bisa kamu ubah.</p>
            </div>
            {/* ✅ MOBILE: card layout (tanpa scroll) */}
            <div className="md:hidden space-y-3">
                {items.map((it, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl p-4 bg-gradient-to-b from-[#131c2a] to-[#0f1724] outline outline-1 outline-amber-400/20 shadow-[0_16px_34px_rgba(0,0,0,0.55)]"
                    >
                        <div className="flex items-start gap-3">
                            <span className="grid place-items-center w-9 h-9 rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300 font-black">
                                ▶
                            </span>

                            <div className="flex-1">
                                <div className="font-extrabold text-white">{it.session}</div>

                                <div className="mt-2">
                                    <span className="inline-block px-3 py-2 rounded-full text-xs font-bold tracking-wide text-amber-200 bg-amber-400/10 border border-amber-400/25">
                                        {it.dateLabel}
                                    </span>
                                </div>

                                <div className="mt-3 text-amber-200 font-extrabold leading-snug break-words">
                                    {it.materi}
                                </div>

                                <div className="mt-3 text-sm text-white">
                                    <span className="font-bold">{it.coach}</span>
                                    <span className="text-white/60"> • Live Zoom</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ DESKTOP: tabel */}
            <div className="hidden md:block">
                <table className="w-full table-fixed border-separate border-spacing-y-3">
                    <thead>
                        <tr className="text-left">
                            <th className="w-[170px] text-xs font-bold text-white/90 px-4 py-3 rounded-l-xl bg-amber-400/10 border-y border-amber-400/25">
                                Session
                            </th>
                            <th className="w-[220px] text-xs font-bold text-white/90 px-4 py-3 bg-amber-400/10 border-y border-amber-400/25">
                                Hari, Tanggal
                            </th>
                            <th className="text-xs font-bold text-white/90 px-4 py-3 bg-amber-400/10 border-y border-amber-400/25">
                                Materi
                            </th>
                            <th className="w-[180px] text-xs font-bold text-white/90 px-4 py-3 rounded-r-xl bg-amber-400/10 border-y border-amber-400/25">
                                Coach
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((it, idx) => (
                            <tr
                                key={idx}
                                className="bg-gradient-to-b from-[#131c2a] to-[#0f1724] outline outline-1 outline-amber-400/20 shadow-[0_16px_34px_rgba(0,0,0,0.55)]"
                            >
                                <td className="px-4 py-4 rounded-l-2xl align-top">
                                    <div className="inline-flex items-center gap-2">
                                        <span className="grid place-items-center w-9 h-9 rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-300 font-black">
                                            ▶
                                        </span>
                                        <div className="font-extrabold text-white">{it.session}</div>
                                    </div>
                                </td>

                                <td className="px-4 py-4 align-top">
                                    <span className="inline-block px-3 py-2 rounded-full text-xs font-bold tracking-wide text-amber-200 bg-amber-400/10 border border-amber-400/25">
                                        {it.dateLabel}
                                    </span>
                                </td>

                                <td className="px-4 py-4 align-top">
                                    <div className="text-amber-200 font-extrabold leading-snug break-words">
                                        {it.materi}
                                    </div>
                                </td>

                                <td className="px-4 py-4 rounded-r-2xl align-top">
                                    <div className="text-white font-bold">{it.coach}</div>
                                    <div className="text-xs text-white/60">Live Zoom</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </section>
    );
}
