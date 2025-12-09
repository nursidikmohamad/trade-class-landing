import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToVideo = () => {
    document.getElementById("video")?.scrollIntoView({ behavior: "smooth" });
  };

  const goToPayment = () => {
    // Placeholder: arahkan ke halaman pembayaran atau anchor pembayaran
    window.location.href = "/pembayaran";
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#050406] via-[#070708] to-[#0b0b0d]">
      {/* Decorative Dots */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-50"></div>
      <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 right-10 w-3 h-3 bg-yellow-500 rounded-full opacity-30"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <p className="text-primary font-mono text-sm md:text-base uppercase tracking-widest mb-4 animate-pulse">
          KELAS TRADING PROP FIRM TERBAIK DI INDONESIA
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground/90">Kamu sudah belajar, <span className="text-primary">disiplin</span>,</span>
          <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground/90">Kamu sudah belajar, <span className="text-primary">Psikologi Trading</span></span>
          <span className="block text-2xl md:text-3xl lg:text-4xl text-foreground/90">Kamu sudah kuasai semua pola</span>

          <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl text-amber-300">
            Tapi Funding Kamu Tetap <span className="underline decoration-amber-400 decoration-4">Gagal?</span>
          </span>
        </h1>

        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="bg-background/60 border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm text-lg md:text-xl text-muted-foreground">
            <div className="leading-relaxed space-y-2 text-center">
              <p className="text-white">Ketahuilah Bahwa Ini bukan</p>
              <p className="font-semibold text-white">Sistem Tradingmu Yang Salah</p>
              <p className="text-white">Tapi Karena Kamu Belum Tahu</p>
              <p className="font-semibold text-amber-200">Sisi Gelap Di Industri Prop Firm</p>
            </div>
          </div>

          <div className="bg-background/60 border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm text-lg md:text-xl text-muted-foreground">
            <p className="leading-relaxed text-center text-white">
              Di kelas ini, kita kupas tuntas <span className="italic">sisi gelap dunia funding</span>: pola psikologi
              yang digunakan profit firm, <span className="italic">jebakan aturan yang tak terlihat</span>, dan bagaimana
              mengubah mindset serta sistem Anda agar konsisten lolos dan menikmati payout.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Daftar & Bayar
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={scrollToVideo}
            className="text-lg px-8 py-6 border-2 hover:-translate-y-1 transition-all"
          >
            Pelajari Lebih Lanjut
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={goToPayment}
            className="text-lg px-6 py-4 border-2 hover:-translate-y-1 transition-all hidden sm:inline-flex"
          >
            Bayar Sekarang
          </Button>
        </div>

        {/* Benefits / Offer details (cards) */}
          <div className="mt-10 max-w-3xl mx-auto bg-muted/30 rounded-lg p-6 text-left text-sm md:text-base">
          <h3 className="mx-auto text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 bg-gradient-to-r from-amber-300 via-amber-200 to-white bg-clip-text text-transparent text-center">Apa yang Anda Dapatkan Saat Bergabung:</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/30 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center font-semibold text-lg">1</div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-amber-200">Rp 2.350.000</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center font-semibold text-lg">2</div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">Calculate Risk Management</p>
                <p className="text-base font-semibold text-amber-200">Rp 950.000</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center font-semibold text-lg">3</div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">Akses Tools Journal Trading</p>
                <p className="text-base font-semibold text-amber-200">Rp 450.000</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center font-semibold text-lg">4</div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">Akses Journal Strategi Scalping Gold</p>
                <p className="text-base font-semibold text-amber-200">Rp 850.000</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center font-semibold text-lg">5</div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">EA Copyer Dua Arah</p>
                <p className="text-base font-semibold text-amber-200">Rp 1.850.000</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 rounded-xl shadow-md border border-indigo-700 bg-indigo-900/25 hover:scale-105 transition-transform duration-200">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-indigo-900 flex items-center justify-center font-semibold text-lg">6</div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-semibold text-foreground">Akun Challenge Gratis ProFirm Two Step</p>
                <p className="text-base font-semibold text-amber-200">$5,000 (akun challenge)</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="font-extrabold text-2xl md:text-3xl">TOTAL VALUE: <span className="text-amber-200">Rp. 7.700.000</span></p>
            <p className="text-muted-foreground">Biaya Kelas: klik tombol <span className="font-semibold">Daftar & Bayar</span> atau <span className="font-semibold">Bayar Sekarang</span> untuk menuju pembayaran.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">5.000+</p>
            <p className="text-sm md:text-base text-muted-foreground">Siswa Terdaftar</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">Live</p>
            <p className="text-sm md:text-base text-muted-foreground">Sesi Mingguan</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
            <p className="text-sm md:text-base text-muted-foreground">Video Pembelajaran</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (clickable) */}
      <button
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
