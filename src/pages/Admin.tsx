import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LogOut, Users, Youtube, TrendingUp, Save, AlertCircle, CreditCard, Settings, Edit, Trash, CheckCircle } from "lucide-react";

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  status?: string;
  created_at: string;
  registration_token: string;
}

interface PaymentConfirmation {
  id: string;
  registration_token: string;
  sender_account_number: string;
  class_price: number;
  payment_proof_url: string;
  verification_status: string;
  created_at: string;
  registration?: Registration;
}

interface SiteSettings {
  youtube_url: string;
  account_holder_name: string;
  account_number: string;
  class_price: string;
  whatsapp_number: string;
  bank_name?: string;
  discount_percent?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [paymentConfirmations, setPaymentConfirmations] = useState<PaymentConfirmation[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    youtube_url: "",
    account_holder_name: "",
    account_number: "",
    class_price: "",
    whatsapp_number: "",
    bank_name: "",
    discount_percent: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingRegistrant, setEditingRegistrant] = useState<Registration | null>(null);
  const [isRegistrantDialogOpen, setIsRegistrantDialogOpen] = useState(false);
  const [editRegistrantForm, setEditRegistrantForm] = useState<Partial<Registration>>({});

  const [editingPayment, setEditingPayment] = useState<PaymentConfirmation | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editPaymentForm, setEditPaymentForm] = useState<Partial<PaymentConfirmation>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"registrations" | "payments" | "settings">("registrations");

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

    // Fetch payment confirmations
    const { data: payments, error: paymentsError } = await supabase
      .from("payment_confirmations")
      .select("*")
      .order("created_at", { ascending: false });

    if (paymentsError) {
      console.error("Error fetching payments:", paymentsError);
    } else {
      // Join with registrations data
      const paymentsWithRegistrations = (payments || []).map((payment) => {
        const registration = regs?.find(
          (r) => r.registration_token === payment.registration_token
        );
        return { ...payment, registration };
      });
      setPaymentConfirmations(paymentsWithRegistrations);
    }

    // Fetch site settings
    const { data: settingsData, error: settingsError } = await supabase
      .from("site_settings")
      .select("key, value");

    if (settingsError) {
      console.error("Error fetching settings:", settingsError);
    } else if (settingsData) {
      const settingsMap = settingsData.reduce((acc, item) => {
        acc[item.key as keyof SiteSettings] = item.value;
        return acc;
      }, {} as SiteSettings);
      setSettings(settingsMap);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Upsert settings so new keys (e.g. bank_name, discount_percent) are created if missing
    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      // Ensure values are stored as strings in site_settings.value
      value: String(value ?? ""),
      updated_at: new Date().toISOString(),
    }));

    // `upsert` with onConflict on `key` will insert if not exists, update otherwise
    const { error: upsertErr } = await supabase
      .from("site_settings")
      .upsert(entries, { onConflict: "key" });


    if (upsertErr) {
      console.error("Error upserting settings:", upsertErr);
      toast({ title: "Error", description: "Gagal menyimpan pengaturan", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    toast({
      title: "Berhasil!",
      description: "Pengaturan berhasil disimpan",
    });
    
    setIsSaving(false);
  };

  const handleUpdateVerificationStatus = async (paymentId: string, status: string) => {
    const { error } = await supabase
      .from("payment_confirmations")
      .update({ verification_status: status, updated_at: new Date().toISOString() })
      .eq("id", paymentId);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Berhasil!",
        description: "Status verifikasi berhasil diupdate",
      });
      fetchData();
    }
  };

  const handleOpenEditRegistrant = (reg: Registration) => {
    setEditingRegistrant(reg);
    setEditRegistrantForm({
      name: reg.name,
      email: reg.email,
      phone: reg.phone,
      experience: reg.experience,
    });
    setIsRegistrantDialogOpen(true);
  };

  const handleSaveRegistrant = async () => {
    if (!editingRegistrant) return;
    const payload: Partial<Registration> = {
      name: editRegistrantForm.name || editingRegistrant.name,
      email: editRegistrantForm.email || editingRegistrant.email,
      phone: editRegistrantForm.phone || editingRegistrant.phone,
      experience: editRegistrantForm.experience ?? editingRegistrant.experience,
      // updated_at handled server-side or can be set here
    };

    const { error } = await supabase
      .from("registrations")
      .update(payload)
      .eq("id", editingRegistrant.id);

    if (error) {
      toast({ title: "Error", description: "Gagal mengupdate pendaftar", variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Data pendaftar berhasil diupdate" });
      setIsRegistrantDialogOpen(false);
      setEditingRegistrant(null);
      fetchData();
    }
  };

  const handleDeleteRegistrant = async (id: string) => {
    const ok = window.confirm("Hapus pendaftar ini? Tindakan tidak dapat dibatalkan.");
    if (!ok) return;

    const { error } = await supabase.from("registrations").delete().eq("id", id);
    if (error) {
      console.error("Delete registration error:", error);
      toast({ title: "Error", description: error.message || "Gagal menghapus pendaftar", variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Pendaftar dihapus" });
      fetchData();
    }
  };

  const handleConfirmRegistrant = async (reg: Registration) => {
    const ok = window.confirm(`Konfirmasi pendaftar ${reg.name}?`);
    if (!ok) return;

    // Update registration status
    const { error } = await supabase
      .from("registrations")
      .update({ status: "confirmed", updated_at: new Date().toISOString() })
      .eq("id", reg.id);

    if (error) {
      console.error("Error confirming registrant (registrations update):", error);
      // Fallback: if registrations table doesn't have `status` or RLS blocks update, try to at least mark payment as verified
      toast({ title: "Perhatian", description: "Gagal mengubah status pendaftar. Mencoba menandai pembayaran sebagai terverifikasi saja.", variant: "destructive" });
      const { error: fallbackErr } = await supabase
        .from("payment_confirmations")
        .update({ verification_status: "verified", updated_at: new Date().toISOString() })
        .eq("registration_token", reg.registration_token);

      if (fallbackErr) {
        console.error("Fallback error updating payment confirmations:", fallbackErr);
        toast({ title: "Error", description: "Gagal mengkonfirmasi pendaftar atau menandai pembayaran. Periksa migrasi DB dan policy RLS.", variant: "destructive" });
        return;
      }

      toast({ title: "Berhasil sebagian", description: "Pembayaran ditandai terverifikasi. Tambahkan kolom `status` pada tabel `registrations` (ALTER TABLE) agar konfirmasi tersimpan pada pendaftar." });
      fetchData();
      return;
    }

    // Also mark any related payment confirmation as verified
    const { error: payErr } = await supabase
      .from("payment_confirmations")
      .update({ verification_status: "verified", updated_at: new Date().toISOString() })
      .eq("registration_token", reg.registration_token);

    if (payErr) {
      console.error("Error updating payment confirmations:", payErr);
      // not blocking
    }

    toast({ title: "Berhasil", description: "Pendaftar telah dikonfirmasi" });
    fetchData();
  };

  const handleOpenEditPayment = (p: PaymentConfirmation) => {
    setEditingPayment(p);
    setEditPaymentForm({
      sender_account_number: p.sender_account_number,
      class_price: p.class_price,
    });
    setIsPaymentDialogOpen(true);
  };

  const handleSavePayment = async () => {
    if (!editingPayment) return;

    const payload: Partial<PaymentConfirmation> = {
      sender_account_number: editPaymentForm.sender_account_number ?? editingPayment.sender_account_number,
      class_price: editPaymentForm.class_price ?? editingPayment.class_price,
    };

    const { error } = await supabase
      .from("payment_confirmations")
      .update(payload)
      .eq("id", editingPayment.id);

    if (error) {
      toast({ title: "Error", description: "Gagal mengupdate konfirmasi", variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Konfirmasi pembayaran berhasil diupdate" });
      setIsPaymentDialogOpen(false);
      setEditingPayment(null);
      fetchData();
    }
  };

  const handleDeletePayment = async (id: string) => {
    const ok = window.confirm("Hapus konfirmasi pembayaran ini? Tindakan tidak dapat dibatalkan.");
    if (!ok) return;

    const { error } = await supabase.from("payment_confirmations").delete().eq("id", id);
    if (error) {
      console.error("Delete payment error:", error);
      toast({ title: "Error", description: error.message || "Gagal menghapus konfirmasi", variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Konfirmasi pembayaran dihapus" });
      fetchData();
    }
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getExperienceLabel = (exp: string) => {
    const labels: Record<string, string> = {
      pemula: "Pemula",
      menengah: "Menengah (1-2 tahun)",
      mahir: "Mahir (>2 tahun)",
    };
    return labels[exp] || exp || "-";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      verified: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    const labels: Record<string, string> = {
      pending: "Menunggu",
      verified: "Terverifikasi",
      rejected: "Ditolak",
    };
    return (
      <span className={`px-2 py-1 text-xs font-bold border rounded ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getRegistrantStatusBadge = (status?: string) => {
    const st = status || "pending";
    const mapStyles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    const mapLabels: Record<string, string> = {
      pending: "Menunggu",
      confirmed: "Terkonfirmasi",
      cancelled: "Dibatalkan",
    };
    return (
      <span className={`px-2 py-1 text-xs font-bold border rounded ${mapStyles[st] || mapStyles.pending}`}>
        {mapLabels[st] || st}
      </span>
    );
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

      {/* Tabs */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("registrations")}
              className={`px-4 py-3 font-medium border-b-4 transition-colors ${
                activeTab === "registrations"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Pendaftar
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-4 py-3 font-medium border-b-4 transition-colors ${
                activeTab === "payments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="w-4 h-4 inline mr-2" />
              Konfirmasi Pembayaran
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-3 font-medium border-b-4 transition-colors ${
                activeTab === "settings"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Pengaturan
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* Registrations Tab */}
        {activeTab === "registrations" && (
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
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Tanggal Daftar</TableHead>
                      <TableHead className="font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-medium">{reg.name}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>{reg.phone}</TableCell>
                        <TableCell>{getExperienceLabel(reg.experience)}</TableCell>
                        <TableCell>{getRegistrantStatusBadge(reg.status)}</TableCell>
                        <TableCell>{formatDate(reg.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleOpenEditRegistrant(reg)}>
                              <Edit className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            {reg.status !== 'confirmed' && (
                              <Button size="sm" variant="outline" onClick={() => handleConfirmRegistrant(reg)}>
                                <CheckCircle className="w-4 h-4" />
                                <span className="sr-only">Confirm</span>
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteRegistrant(reg.id)}>
                              <Trash className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Payment Confirmations Tab */}
        {activeTab === "payments" && (
          <div className="bg-card border-4 border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Konfirmasi Pembayaran ({paymentConfirmations.length})
              </h2>
            </div>

            {paymentConfirmations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada konfirmasi pembayaran</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Nama</TableHead>
                      <TableHead className="font-bold">WhatsApp</TableHead>
                      <TableHead className="font-bold">Harga Kelas</TableHead>
                      <TableHead className="font-bold">No Rek Pengirim</TableHead>
                      <TableHead className="font-bold">Bukti</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentConfirmations.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.registration?.name || "-"}
                        </TableCell>
                        <TableCell>{payment.registration?.phone || "-"}</TableCell>
                        <TableCell>{formatPrice(payment.class_price)}</TableCell>
                        <TableCell className="font-mono">{payment.sender_account_number}</TableCell>
                        <TableCell>
                          <a
                            href={payment.payment_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Lihat Bukti
                          </a>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.verification_status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={payment.verification_status}
                              onValueChange={(value) => handleUpdateVerificationStatus(payment.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="verified">Terverifikasi</SelectItem>
                                <SelectItem value="rejected">Ditolak</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button size="sm" variant="ghost" onClick={() => handleOpenEditPayment(payment)}>
                              <Edit className="w-4 h-4" />
                              <span className="sr-only">Edit</span>
                            </Button>

                            <Button size="sm" variant="destructive" onClick={() => handleDeletePayment(payment.id)}>
                              <Trash className="w-4 h-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            {/* YouTube Settings */}
            <div className="bg-card border-4 border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Youtube className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Video YouTube</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Masukkan URL embed YouTube (format: https://www.youtube.com/embed/VIDEO_ID)
              </p>
              <Input
                value={settings.youtube_url || ""}
                onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
                className="h-12 border-2"
              />
            </div>

            {/* Payment Settings */}
            <div className="bg-card border-4 border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Pengaturan Pembayaran</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Nama Pemilik Rekening
                  </label>
                  <Input
                    value={settings.account_holder_name || ""}
                    onChange={(e) => setSettings({ ...settings, account_holder_name: e.target.value })}
                    placeholder="Nama Pemilik"
                    className="h-12 border-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Nomor Rekening
                  </label>
                  <Input
                    value={settings.account_number || ""}
                    onChange={(e) => setSettings({ ...settings, account_number: e.target.value })}
                    placeholder="1234567890"
                    className="h-12 border-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Nama Bank
                  </label>
                  <Input
                    value={settings.bank_name || ""}
                    onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                    placeholder="Contoh: BCA / Mandiri"
                    className="h-12 border-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Harga Kelas (Rp)
                  </label>
                  <Input
                    type="number"
                    value={settings.class_price || ""}
                    onChange={(e) => setSettings({ ...settings, class_price: e.target.value })}
                    placeholder="500000"
                    className="h-12 border-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Diskon (%)
                  </label>
                  <Input
                    type="number"
                    value={settings.discount_percent || ""}
                    onChange={(e) => setSettings({ ...settings, discount_percent: e.target.value })}
                    placeholder="20"
                    className="h-12 border-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Masukkan persentase diskon (angka saja, contoh: 20 untuk 20%).</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Nomor WhatsApp Admin
                  </label>
                  <Input
                    value={settings.whatsapp_number || ""}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    placeholder="6281234567890"
                    className="h-12 border-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: 62XXXXXXXXXX (tanpa tanda +)
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSaveSettings} disabled={isSaving} className="h-12 px-8">
              {isSaving ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Semua Pengaturan
                </>
              )}
            </Button>
          </div>
        )}
      </main>

      {/* Edit Registrant Dialog */}
      <Dialog open={isRegistrantDialogOpen} onOpenChange={setIsRegistrantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pendaftar</DialogTitle>
            <DialogDescription>Ubah data pendaftar di sini</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Nama</label>
              <Input value={editRegistrantForm.name || ""} onChange={(e) => setEditRegistrantForm({ ...editRegistrantForm, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Email</label>
              <Input value={editRegistrantForm.email || ""} onChange={(e) => setEditRegistrantForm({ ...editRegistrantForm, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">WhatsApp</label>
              <Input value={editRegistrantForm.phone || ""} onChange={(e) => setEditRegistrantForm({ ...editRegistrantForm, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Pengalaman</label>
              <select value={editRegistrantForm.experience || ""} onChange={(e) => setEditRegistrantForm({ ...editRegistrantForm, experience: e.target.value })} className="w-full h-10 bg-card border-2 border-border">
                <option value="">Pilih pengalaman</option>
                <option value="pemula">Pemula</option>
                <option value="menengah">Menengah (1-2 tahun)</option>
                <option value="mahir">Mahir (&gt;2 tahun)</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSaveRegistrant}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Konfirmasi</DialogTitle>
            <DialogDescription>Ubah data konfirmasi pembayaran</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">No Rek Pengirim</label>
              <Input value={editPaymentForm.sender_account_number || ""} onChange={(e) => setEditPaymentForm({ ...editPaymentForm, sender_account_number: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Harga Kelas (Rp)</label>
              <Input type="number" value={editPaymentForm.class_price ? String(editPaymentForm.class_price) : ""} onChange={(e) => setEditPaymentForm({ ...editPaymentForm, class_price: Number(e.target.value) })} />
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button onClick={handleSavePayment}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
