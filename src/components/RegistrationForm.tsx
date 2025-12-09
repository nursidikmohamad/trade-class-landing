import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";

const RegistrationForm = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    whatsapp: "",
    pengalaman: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nama.trim() || !formData.email.trim() || !formData.whatsapp.trim()) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Format email tidak valid",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
    
    toast({
      title: "Pendaftaran Berhasil!",
      description: "Tim kami akan menghubungi Anda dalam 24 jam"
    });
  };

  if (isSubmitted) {
    return (
      <section id="daftar" className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center p-12 bg-secondary border-4 border-primary">
            <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pendaftaran Berhasil!
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Terima kasih telah mendaftar. Tim kami akan menghubungi Anda melalui WhatsApp dalam 24 jam ke depan.
            </p>
            <p className="text-primary font-mono">
              Cek email Anda untuk informasi lebih lanjut
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="daftar" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left Side - Info */}
          <div>
            <p className="text-primary font-mono text-sm uppercase tracking-widest mb-4">
              Daftar Sekarang
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Mulai Perjalanan Trading Anda
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Isi formulir di samping untuk mendaftar. Tim kami akan menghubungi Anda untuk informasi lebih lanjut tentang kelas dan jadwal pembelajaran.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-secondary border-2 border-border">
                <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-bold text-foreground">Isi Formulir</p>
                  <p className="text-sm text-muted-foreground">Lengkapi data diri Anda</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-secondary border-2 border-border">
                <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-bold text-foreground">Konfirmasi WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Tim kami akan menghubungi Anda</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-secondary border-2 border-border">
                <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-bold text-foreground">Mulai Belajar</p>
                  <p className="text-sm text-muted-foreground">Akses materi dan mulai trading</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="bg-secondary border-4 border-border p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Formulir Pendaftaran
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Nama Lengkap *
                </label>
                <Input
                  type="text"
                  name="nama"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full bg-card border-2 border-border focus:border-primary h-12"
                  maxLength={100}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-card border-2 border-border focus:border-primary h-12"
                  maxLength={255}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Nomor WhatsApp *
                </label>
                <Input
                  type="tel"
                  name="whatsapp"
                  placeholder="08xxxxxxxxxx"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-card border-2 border-border focus:border-primary h-12"
                  maxLength={15}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Pengalaman Trading
                </label>
                <select
                  name="pengalaman"
                  value={formData.pengalaman}
                  onChange={handleChange}
                  className="w-full bg-card border-2 border-border focus:border-primary h-12 px-4 text-foreground"
                >
                  <option value="">Pilih pengalaman Anda</option>
                  <option value="pemula">Pemula (belum pernah trading)</option>
                  <option value="menengah">Menengah (1-2 tahun)</option>
                  <option value="mahir">Mahir (lebih dari 2 tahun)</option>
                </select>
              </div>
              
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Daftar Sekarang
                  </span>
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang berlaku
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
