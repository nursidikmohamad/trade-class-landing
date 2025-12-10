import { TrendingUp, Shield, Users, BookOpen, Headphones, Award } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Strategi Terbukti",
    description: "Ikuti pola dan sistem yang dipakai pro firm—biar kamu punya arah jelas sejak hari pertama dan makin yakin buat mulai bareng."
  },
  {
    icon: Shield,
    title: "Manajemen Risiko",
    description: "Pakai software canggih untuk mengontrol risiko dan menghadapi algoritma pro firm dengan lebih tenang—cocok buat kamu yang siap naik level."
  },
  {
    icon: Users,
    title: "Komunitas Eksklusif",
    description: "Masuk komunitas trader aktif yang saling dorong progres—sharing insight, evaluasi, sampai peluang entry bareng."
  },
  {
    icon: BookOpen,
    title: "Materi Komprehensif",
    description: "Materi tersusun rapi dari teknikal sampai fundamental—tinggal ikuti step-by-step dan rasakan progresnya."
  },
  {
    icon: Headphones,
    title: "Support 24/7",
    description: "Ada tim yang siap bantu kapan saja—biar kamu nggak stuck sendirian dan lebih cepat siap gabung."
  },
  {
    icon: Award,
    title: "Sertifikat Kelulusan",
    description: "Selesaikan modul dan dapatkan sertifikat resmi—jadi bukti komitmen sekaligus nilai plus saat kamu sudah siap melangkah lebih jauh."
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
            Visi Kami
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kami Membangun ekosistem belajar yang terstruktur dan eksklusif—dirancang Khusus Melawan Sistem Algoritma Profirm
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl p-8 bg-card/70 border border-primary/25 shadow-lg transition hover:-translate-y-1 hover:shadow-xl hover:border-primary/50"
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
