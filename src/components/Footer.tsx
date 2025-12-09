import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary border-t-4 border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">TradingClass</span>
            </div>
            <p className="text-muted-foreground">
              Platform pembelajaran trading online terbaik di Indonesia. Belajar dari mentor berpengalaman untuk meraih profit konsisten.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Link Cepat</h4>
            <ul className="space-y-2">
              <li>
                <a href="#video" className="text-muted-foreground hover:text-primary transition-colors">
                  Preview Kelas
                </a>
              </li>
              <li>
                <a href="#daftar" className="text-muted-foreground hover:text-primary transition-colors">
                  Daftar Sekarang
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin Login
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@tradingclass.id</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 TradingClass. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
