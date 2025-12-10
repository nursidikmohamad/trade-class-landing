import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Upload, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { z } from "zod";

const paymentSchema = z.object({
  senderAccountNumber: z.string().trim().min(5, "No rekening minimal 5 digit").max(30),
});

interface SiteSettings {
  account_holder_name: string;
  account_number: string;
  class_price: string;
  whatsapp_number: string;
}

const KonfirmasiPembayaran = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const registrationToken = searchParams.get("reg");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!registrationToken) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      // Verify registration token exists
      const { data: registration, error: regError } = await supabase
        .from("registrations")
        .select("id")
        .eq("registration_token", registrationToken)
        .maybeSingle();

      if (regError || !registration) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      setIsValid(true);

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

    fetchData();
  }, [registrationToken]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast({
          title: "Format tidak valid",
          description: "Hanya file JPG atau PNG yang diterima",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Maksimal ukuran file 5MB",
          variant: "destructive",
        });
        return;
      }

      setPaymentProof(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = paymentSchema.safeParse({ senderAccountNumber });
    if (!validation.success) {
      toast({
        title: "Error",
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    if (!paymentProof) {
      toast({
        title: "Error",
        description: "Silakan upload bukti pembayaran",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Upload payment proof
    const fileExt = paymentProof.name.split(".").pop();
    const fileName = `${registrationToken}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(fileName, paymentProof);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast({
        title: "Error",
        description: "Gagal mengupload bukti pembayaran",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("payment-proofs")
      .getPublicUrl(fileName);

    // Insert payment confirmation
    const { error: insertError } = await supabase
      .from("payment_confirmations")
      .insert({
        registration_token: registrationToken,
        sender_account_number: senderAccountNumber.trim(),
        class_price: parseFloat(settings?.class_price || "0"),
        payment_proof_url: urlData.publicUrl,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      toast({
        title: "Error",
        description: "Gagal menyimpan konfirmasi pembayaran",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Berhasil!",
      description: "Konfirmasi pembayaran berhasil dikirim",
    });

    // Redirect to WhatsApp
    const whatsappNumber = settings?.whatsapp_number || "6281234567890";
    const message = encodeURIComponent(
      `Halo, saya sudah melakukan pembayaran untuk pendaftaran kelas trading.\n\nNo Rekening Pengirim: ${senderAccountNumber}\nToken: ${registrationToken}`
    );
    window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseFloat(price || "0"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!registrationToken || !isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Token Tidak Valid</h1>
          <p className="text-muted-foreground mb-6">
            Link konfirmasi pembayaran tidak valid atau sudah kadaluarsa.
          </p>
          <a href="/register" className="text-primary hover:underline">
            Kembali ke halaman pendaftaran
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-4 border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Trading Class</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Konfirmasi Pembayaran
            </h1>
            <p className="text-muted-foreground">
              Silakan transfer ke rekening di bawah ini dan upload bukti pembayaran
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-secondary border-4 border-border p-6 mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Informasi Rekening Tujuan</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Nama Pemilik</span>
                <span className="font-bold text-foreground">
                  {settings?.account_holder_name || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Nomor Rekening</span>
                <span className="font-bold text-foreground font-mono">
                  {settings?.account_number || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Total Pembayaran</span>
                <span className="font-bold text-primary text-xl">
                  {formatPrice(settings?.class_price || "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="bg-card border-4 border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-6">Form Konfirmasi</h2>

            <input type="hidden" value={registrationToken} />
            <input type="hidden" value={settings?.class_price || "0"} />

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Nomor Rekening Pengirim *
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan nomor rekening pengirim"
                  value={senderAccountNumber}
                  onChange={(e) => setSenderAccountNumber(e.target.value)}
                  className="w-full h-12 border-2"
                  maxLength={30}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Harga Kelas
                </label>
                <Input
                  type="text"
                  value={formatPrice(settings?.class_price || "0")}
                  className="w-full h-12 border-2 bg-secondary"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Upload Bukti Pembayaran *
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label htmlFor="payment-proof" className="cursor-pointer">
                    {previewUrl ? (
                      <div>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 mx-auto mb-4 rounded"
                        />
                        <p className="text-sm text-primary">Klik untuk ganti gambar</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-foreground font-medium mb-2">
                          Klik untuk upload bukti pembayaran
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Format: JPG, PNG (max 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                    Mengirim...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Konfirmasi Pembayaran
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default KonfirmasiPembayaran;
