import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    hours?: number;           // default 7 jam
    label?: string;           // default "Diskon berakhir"
    storageKey?: string;      // supaya persist saat refresh
    className?: string;
};

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function formatHHMMSS(ms: number) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function DiscountCountdown({
    hours = 1,
    label = "Diskon berakhir",
    storageKey = "register_discount_end_48h",
    className = "",
}: Props) {
    const durationMs = useMemo(() => hours * 60 * 60 * 1000, [hours]);

    const makeNewEndAt = () => Date.now() + durationMs;

    const [endAt, setEndAt] = useState<number>(() => {
        if (typeof window === "undefined") return makeNewEndAt();

        const saved = window.localStorage.getItem(storageKey);
        const savedNum = saved ? Number(saved) : NaN;

        if (!Number.isFinite(savedNum)) {
            const next = makeNewEndAt();
            window.localStorage.setItem(storageKey, String(next));
            return next;
        }

        // kalau sudah lewat, AUTO RESET
        if (savedNum <= Date.now()) {
            const next = makeNewEndAt();
            window.localStorage.setItem(storageKey, String(next));
            return next;
        }

        return savedNum;
    });

    const [now, setNow] = useState(() => Date.now());
    const resetLockRef = useRef(false);

    // sinkron jika hours / storageKey berubah
    useEffect(() => {
        if (typeof window === "undefined") return;

        const saved = window.localStorage.getItem(storageKey);
        const savedNum = saved ? Number(saved) : NaN;

        if (!Number.isFinite(savedNum) || savedNum <= Date.now()) {
            const next = Date.now() + durationMs;
            window.localStorage.setItem(storageKey, String(next));
            setEndAt(next);
            resetLockRef.current = false;
            return;
        }

        setEndAt(savedNum);
        resetLockRef.current = false;
    }, [durationMs, storageKey]);

    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, []);

    const remaining = endAt - now;
    const expired = remaining <= 0;

    // AUTO RESET saat habis (sekali saja per expiry)
    useEffect(() => {
        if (!expired) {
            resetLockRef.current = false;
            return;
        }
        if (resetLockRef.current) return;

        resetLockRef.current = true;

        const next = Date.now() + durationMs;
        window.localStorage.setItem(storageKey, String(next));
        setEndAt(next);
    }, [expired, durationMs, storageKey]);

    return (
        <div className={["inline-flex flex-col items-center", className].join(" ")}>
            <span className="text-lg font-bold text-white/90 leading-none">
                {label}
            </span>

            <span className="font-mono text-4xl font-extrabold tracking-wider text-yellow-300 leading-none">
                {formatHHMMSS(remaining)}
            </span>
        </div>
    );



}
