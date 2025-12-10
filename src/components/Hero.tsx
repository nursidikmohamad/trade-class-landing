import { useEffect, useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";


const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth" });
  };

  const navigate = useNavigate();

  const handleNavigateClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/register");
  };

  // ✅ SIMULASI popup (latihan, bukan data asli)
  const DEMO = [
    { name: "Adit  ", action: "Baru Saja Mendaftar" },
    { name: "Rio ", action: "Baru Saja Mendaftar" },
    { name: "Bayu", action: "Baru Saja Mendaftar" },
    { name: "Fikri", action: "Baru Saja Mendaftar" },
    { name: "Andre", action: "Baru Saja Mendaftar" },
    { name: "Hamdan", action: "Baru Saja Mendaftar" },
    { name: "Ismanto", action: "Baru Saja Mendaftar" },
    { name: "Anton", action: "Baru Saja Mendaftar" },
    { name: "David", action: "Baru Saja Mendaftar" },
  ];

  const [spOpen, setSpOpen] = useState(false);
  const [spText, setSpText] = useState("");

  useEffect(() => {
    const rand = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    let hideT: number | null = null;
    let loopT: number | null = null;

    const showOne = () => {
      const item = DEMO[rand(0, DEMO.length - 1)];
      setSpText(`${item.name}  ${item.action}`);
      setSpOpen(true);

      if (hideT) window.clearTimeout(hideT);
      hideT = window.setTimeout(() => setSpOpen(false), 4500);

      loopT = window.setTimeout(showOne, rand(8000, 14000));
    };

    loopT = window.setTimeout(showOne, rand(2000, 4000));

    return () => {
      if (hideT) window.clearTimeout(hideT);
      if (loopT) window.clearTimeout(loopT);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050406] via-[#070708] to-[#0b0b0d]">
      {/* Decorative Dots */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-500 rounded-full opacity-60" />
      <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-50" />
      <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-40" />
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-400 rounded-full opacity-60" />
      <div className="absolute top-1/2 right-10 w-3 h-3 bg-yellow-500 rounded-full opacity-30" />

      {/* Candlestick background */}
      <div className="candles-svg z-0" aria-hidden="true">
        <svg
          className="w-full h-full"
          viewBox="0 0 2000 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="candleGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#cfcfcf" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <g className="candles-track" transform="translate(0,60)">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = 40 + (i % 7) * 18;
              const body = Math.max(12, h - 12);
              const x = i * 58;
              return (
                <g
                  key={`c-${i}`}
                  className="candle"
                  transform={`translate(${x}, ${250 - h})`}
                >
                  <rect
                    x={10}
                    y={0}
                    width={6}
                    height={h}
                    rx={2}
                    fill="url(#candleGrad)"
                  />
                  <rect
                    x={12}
                    y={Math.max(0, (h - body) / 2)}
                    width={2}
                    height={body}
                    rx={1}
                    fill="#999"
                    opacity="0.9"
                  />
                </g>
              );
            })}

            {Array.from({ length: 30 }).map((_, i) => {
              const h = 40 + (i % 7) * 18;
              const body = Math.max(12, h - 12);
              const x = (i + 30) * 58;
              return (
                <g
                  key={`c-dup-${i}`}
                  className="candle"
                  transform={`translate(${x}, ${250 - h})`}
                >
                  <rect
                    x={10}
                    y={0}
                    width={6}
                    height={h}
                    rx={2}
                    fill="url(#candleGrad)"
                  />
                  <rect
                    x={12}
                    y={Math.max(0, (h - body) / 2)}
                    width={2}
                    height={body}
                    rx={1}
                    fill="#999"
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Overlay (FIX: backdrop-blur-sm, bukan backdrop-none-sm) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* ✅ Logo statis (posisi kiri atas, gak ganggu layout tengah) */}
      <div className="absolute top-10 left-10 z-20 flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-2 rounded-2xl bg-amber-400/15 blur-xl" />
          <img
            src="/logo.png"
            alt="Logo Markas Profirm"
            className="w-16 h-16 md:w-20 md:h-20 object-contain bg-transparent p-0 border-0 brightness-125 contrast-125 drop-shadow-[0_0_18px_rgba(255,214,102,0.60)]"
            onError={(e) => {
              // kalau logo belum ada di public/logo.png, jangan bikin crash
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-foreground font-bold leading-none">
            Markas Profirm
          </p>
          {/* <p className="text-sm text-muted-foreground">TradingClass</p> */}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <p className="text-primary font-mono text-sm md:text-base uppercase tracking-widest mb-4 animate-pulse">
          KELAS TRADING PROP FIRM TERBAIK DI INDONESIA
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground/90">
            Kamu sudah belajar, <span className="text-primary">disiplin</span>,
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground/90">
            Kamu sudah belajar,{" "}
            <span className="text-primary">Psikologi Trading</span>
          </span>
          <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground/90">
            Kamu sudah kuasai semua pola
          </span>

          <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl text-amber-300">
            Tapi Funding Kamu Tetap{" "}
            <span className="underline decoration-amber-400 decoration-4">
              Gagal?
            </span>
          </span>
        </h1>

        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="bg-background/60 border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm text-lg md:text-xl text-muted-foreground">
            <div className="leading-relaxed space-y-2 text-center">
              <p className="text-white">Ketahuilah Bahwa Ini bukan</p>
              <p className="font-semibold text-white">
                Sistem Tradingmu Yang Salah
              </p>
              <p className="text-white">Tapi Karena Kamu Belum Tahu</p>
              <p className="font-semibold text-amber-200">
                Sisi Gelap Di Industri Prop Firm
              </p>
            </div>
          </div>

          <div className="bg-background/60 border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm text-lg md:text-xl text-muted-foreground">
            <p className="leading-relaxed text-center text-white">
              Di kelas ini, saya bahas tuntas rahasia permainan di industri
              ProFirm. Saya juga akan mengungkap pola jebakan tak kasat mata
              yang diselipkan secara sistem. Karena hanya dengan mengetahui
              urutan permainan ini, lulus ProFirm dan payout bukan hal yang
              mustahil dicapai.
            </p>
          </div>
        </div>

        <div className="mt-10 max-w-3xl mx-auto bg-muted/30 rounded-lg p-6 text-left text-sm md:text-base">
          <h3 className="mx-auto text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 bg-gradient-to-r from-amber-300 via-amber-200 to-white bg-clip-text text-transparent text-center">
            Bonus Yg Anda Dapatkan Saat Mengikuti Kelas.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { no: 1, title: "Tools auto SnD", price: "Rp 2.350.000" },
              { no: 2, title: "Calculate Risk Management", price: "Rp 950.000" },
              { no: 3, title: "Akses Tools Journal Trading", price: "Rp 450.000" },
              { no: 4, title: "Akses Journal Strategi Scalping Gold", price: "Rp 850.000" },
              { no: 5, title: "EA Copyer Dua Arah", price: "Rp 1.850.000" },
              { no: 6, title: "Akun Challenge Gratis ProFirm Two Step", price: "$5,000" },
            ].map((item) => (
              <div
                key={item.no}
                className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200"
              >
                <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                  {item.no}
                </div>
                <div className="text-center">
                  <p className="text-lg md:text-xl font-semibold text-foreground">
                    {item.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center text-center gap-3">
            <p className="font-extrabold text-lg md:text-2xl">TOTAL VALUE:</p>
            <p className="text-amber-200">
              <span className="inline-block align-middle mr-2">Rp.</span>
              <span className="inline-block align-middle text-2xl md:text-3xl font-extrabold text-amber-200 line-through decoration-red-500 decoration-2">
                7.700.000
              </span>
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Link to="/register" className="inline-block" onClick={handleNavigateClick}>
                Daftar Sekarang
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">1427+</p>
            <p className="text-sm md:text-base text-muted-foreground">Bets 3</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              Live Zoom
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              Sesi Mingguan
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
            <p className="text-sm md:text-base text-muted-foreground">
              Video Pembelajaran
            </p>
          </div>
        </div>
      </div>

      <div
        className={[
          "fixed right-4 top-4 z-[9999] max-w-[320px]",
          "rounded-2xl border border-amber-400/40",
          "bg-black/70 backdrop-blur-md shadow-[0_18px_55px_rgba(0,0,0,0.55)]",
          "px-4 py-3 text-left",
          "transition-all duration-300",
          spOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none",
        ].join(" ")}
      >
        <div className="text-[11px] font-extrabold tracking-[0.14em] text-amber-300">
          UPDATE MEMBER
        </div>
        <div className="mt-1 text-sm text-white">{spText}</div>
      </div>


      <button
        type="button"
        onClick={scrollToForm}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-label="Scroll ke formulir pendaftaran"
      >
        <span className="text-primary text-3xl">↓</span>
      </button>
    </section>
  );
};

export default Hero;
