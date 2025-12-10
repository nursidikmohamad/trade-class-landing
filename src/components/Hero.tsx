import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050406] via-[#070708] to-[#0b0b0d]">
      {/* Decorative Dots */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-500 rounded-full opacity-60" />
      <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-50" />
      <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-40" />
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-400 rounded-full opacity-60" />
      <div className="absolute top-1/2 right-10 w-3 h-3 bg-yellow-500 rounded-full opacity-30" />

      {/* Subtle candlestick pattern animation (background) */}
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

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

        {/* Benefits / Offer details (cards) */}
        <div className="mt-10 max-w-3xl mx-auto bg-muted/30 rounded-lg p-6 text-left text-sm md:text-base">
          <h3 className="mx-auto text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 bg-gradient-to-r from-amber-300 via-amber-200 to-white bg-clip-text text-transparent text-center">
            Bonus Yg Anda Dapatkan Saat Mengikuti Kelas.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/30 hover:scale-105 transition-transform duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                1
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  Tools auto SnD
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                  Rp 2.350.000
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                2
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  Calculate Risk Management
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                  Rp 950.000
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                3
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  Akses Tools Journal Trading
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                  Rp 450.000
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                4
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  Akses Journal Strategi Scalping Gold
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                  Rp 850.000
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                5
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  EA Copyer Dua Arah
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                  Rp 1.850.000
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-9 h-9 rounded-full bg-gray-400/20 text-gray-300 flex items-center justify-center font-semibold text-base">
                6
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  Akun Challenge Gratis ProFirm Two Step
                </p>
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">
                  $5,000
                </p>
              </div>
            </div>
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

          {/* ✅ Mobile-safe navigation: render Link as the Button child to avoid nesting interactive elements */}
          <div className="mt-6 flex justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Link to="/register" className="inline-block">
                Daftar Sekarang
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">5.000+</p>
            <p className="text-sm md:text-base text-muted-foreground">
              Siswa Terdaftar
            </p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">Live</p>
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

      {/* Scroll Indicator (clickable) */}
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
