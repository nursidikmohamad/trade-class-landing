import { TrendingUp, Shield, Users, BookOpen, Headphones, Award } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Strategi Terbukti",
    description: "Pelajari strategi trading yang sudah teruji dan menghasilkan profit konsisten selama bertahun-tahun"
  },
  {
    icon: Shield,
    title: "Manajemen Risiko",
    description: "Kuasai teknik manajemen risiko untuk melindungi modal dan memaksimalkan keuntungan"
  },
  {
    icon: Users,
    title: "Komunitas Eksklusif",
    description: "Bergabung dengan komunitas trader aktif untuk berbagi insight dan peluang trading"
  },
  {
    icon: BookOpen,
    title: "Materi Komprehensif",
    description: "Dari analisis teknikal hingga fundamental, semua materi disusun secara sistematis"
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Tim support siap membantu menjawab pertanyaan dan kendala Anda kapan saja"
  },
  {
    icon: Award,
    title: "Sertifikat Kelulusan",
    description: "Dapatkan sertifikat resmi setelah menyelesaikan seluruh modul pembelajaran"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary font-mono text-sm uppercase tracking-widest mb-4">
            Mengapa Memilih Kami
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Fitur Kelas Trading Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk menjadi trader yang profitable dan konsisten
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-card border-2 border-border hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="w-14 h-14 bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
