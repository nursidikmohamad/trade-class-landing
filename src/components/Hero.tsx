import heroBg from "@/assets/hero-bg.jpg";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const scrollToForm = () => {
    document.getElementById("daftar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <p className="text-primary font-mono text-sm md:text-base uppercase tracking-widest mb-4 animate-pulse">
         KELAS TRADING PROFIRM TEBAIK DI INDONESIA
        </p>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Bongkar Sisi Sisi Gelap Trading Profirm<br />
          <span className="text-primary">Raih Profit Konsisten</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Belajar trading dari mentor berpengalaman dengan metode yang sudah terbukti menghasilkan profit. 
          Mulai perjalanan finansial Anda hari ini.
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
            onClick={() => document.getElementById("video")?.scrollIntoView({ behavior: "smooth" })}
            className="text-lg px-8 py-6 border-2 hover:-translate-y-1 transition-all"
          >
            Lihat Preview
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">5000+</p>
            <p className="text-sm md:text-base text-muted-foreground">Siswa Terdaftar</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">85%</p>
            <p className="text-sm md:text-base text-muted-foreground">Tingkat Keberhasilan</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-bold text-primary">50+</p>
            <p className="text-sm md:text-base text-muted-foreground">Video Pembelajaran</p>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
