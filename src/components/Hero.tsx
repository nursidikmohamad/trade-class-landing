import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToVideo = () => {
    document.getElementById("video")?.scrollIntoView({ behavior: "smooth" });
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
          Bongkar Sisi Gelap Trading Prop Firm <br />
          <span className="text-primary">Raih Profit Konsisten</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Belajar trading dari mentor berpengalaman dengan metode yang sudah teruji.
          Fokus pada manajemen risiko, psikologi, dan strategi yang realistis untuk
          performa jangka panjang.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            Daftar Sekarang
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={scrollToVideo}
            className="text-lg px-8 py-6 border-2 hover:-translate-y-1 transition-all"
          >
            Lihat Preview Kelas
          </Button>
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
