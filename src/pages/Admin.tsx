import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, Users, Youtube, TrendingUp, Save, AlertCircle } from "lucide-react";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        } else {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    } else {
      setIsAdmin(!!data);
    }
    
    if (data) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch registrations
    const { data: regs, error: regsError } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (regsError) {
      console.error("Error fetching registrations:", regsError);
    } else {
      setRegistrations(regs || []);
    }

    // Fetch YouTube URL
    const { data: settings, error: settingsError } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "youtube_url")
      .maybeSingle();

    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
    } else if (settings) {
      setYoutubeUrl(settings.value);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSaveYoutubeUrl = async () => {
    setIsSaving(true);
    
    const { error } = await supabase
      .from("site_settings")
      .update({ value: youtubeUrl, updated_at: new Date().toISOString() })
      .eq("key", "youtube_url");

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan URL YouTube",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil!",
        description: "URL YouTube berhasil diperbarui",
      });
    }
    
    setIsSaving(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getExperienceLabel = (exp: string) => {
    const labels: Record<string, string> = {
      pemula: "Pemula",
      menengah: "Menengah (1-2 tahun)",
      mahir: "Mahir (>2 tahun)",
    };
    return labels[exp] || exp || "-";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Akses Ditolak</h1>
          <p className="text-muted-foreground mb-6">
            Anda tidak memiliki akses admin. Hubungi administrator untuk mendapatkan akses.
          </p>
          <div className="space-y-4">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <a href="/" className="block text-primary hover:underline text-sm">
              Kembali ke Landing Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-4 border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* YouTube Settings */}
        <div className="bg-card border-4 border-border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Youtube className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Pengaturan Video YouTube</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Masukkan URL embed YouTube (format: https://www.youtube.com/embed/VIDEO_ID)
          </p>
          <div className="flex gap-4">
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              className="flex-1 h-12 border-2"
            />
            <Button onClick={handleSaveYoutubeUrl} disabled={isSaving} className="h-12">
              {isSaving ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-card border-4 border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Data Pendaftar ({registrations.length})
            </h2>
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada pendaftar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Nama</TableHead>
                    <TableHead className="font-bold">Email</TableHead>
                    <TableHead className="font-bold">WhatsApp</TableHead>
                    <TableHead className="font-bold">Pengalaman</TableHead>
                    <TableHead className="font-bold">Tanggal Daftar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((reg) => (
                    <TableRow key={reg.id}>
                      <TableCell className="font-medium">{reg.name}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                      <TableCell>{reg.phone}</TableCell>
                      <TableCell>{getExperienceLabel(reg.experience)}</TableCell>
                      <TableCell>{formatDate(reg.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
