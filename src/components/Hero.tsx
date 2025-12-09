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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Decorative Dots */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
      <div className="absolute top-40 right-20 w-2 h-2 bg-yellow-400 rounded-full opacity-50"></div>
      <div className="absolute bottom-40 left-1/4 w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
      <div className="absolute top-1/2 right-10 w-3 h-3 bg-yellow-500 rounded-full opacity-30"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <p className="text-primary font-mono text-sm md:text-base uppercase tracking-widest mb-4 animate-pulse">
          KELAS TRADING PROP FIRM TERBAIK DI INDONESIA
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Bayangkan… Anda sudah belajar ke sana–sini, tapi Funding tetap gagal
          <br />
          <span className="text-primary">Pelajari Sisi Gelap Funding & Raih Payout</span>
        </h1>

        <div className="max-w-2xl mx-auto mb-10 space-y-4">
          <div className="bg-background/60 border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm text-lg md:text-xl text-muted-foreground">
            <p className="leading-relaxed">
              Anda menonton ratusan video, ikut berbagai kelas, membeli strategi,
              dan mencoba metode yang dianggap aman — namun setiap challenge hasilnya
              tetap sama: overtrade, mental hancur, atau akun hangus saat hampir payout.
            </p>
          </div>

          <div className="bg-background/60 border border-border rounded-xl p-6 shadow-lg backdrop-blur-sm text-lg md:text-xl text-muted-foreground">
            <p className="leading-relaxed">
              Di kelas ini, kita kupas tuntas sisi gelap dunia funding: pola psikologi
              yang digunakan profit firm, jebakan aturan yang tak terlihat, dan bagaimana
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

        {/* Benefits / Offer details */}
        <div className="mt-10 max-w-3xl mx-auto bg-muted/40 rounded-lg p-6 text-left text-sm md:text-base">
          <h3 className="text-foreground font-semibold mb-3">Apa yang Anda Dapatkan Saat Bergabung:</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-decimal ml-5">
            <li>Tools auto SnD — Rp 2.350.000</li>
            <li>Calculate Risk Management — Rp 950.000</li>
            <li>Akses Tools Journal Trading — Rp 450.000</li>
            <li>Akses Journal Strategi Scalping Gold — Rp 850.000</li>
            <li>EA Copyer Dua Arah — Rp 1.850.000</li>
            <li>Akun Challenge Gratis ProFirm Two Step $5000</li>
          </ul>
          <p className="mt-4 font-bold">TOTAL VALUE: Rp. 7.700.000</p>
          <p className="mt-2 text-muted-foreground">Biaya Kelas: klik tombol <span className="font-semibold">Daftar & Bayar</span> atau <span className="font-semibold">Bayar Sekarang</span> untuk menuju pembayaran.</p>
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
