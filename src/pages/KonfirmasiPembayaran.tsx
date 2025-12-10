import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Upload,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

/** =========================
 *  Schema
 *  ========================= */
const paymentSchema = z.object({
  senderAccountNumber: z
    .string()
    .trim()
    .min(5, "No rekening minimal 5 digit")
    .max(30),
});

type PaymentInput = z.infer<typeof paymentSchema>;

interface SiteSettings {
  account_holder_name?: string;
  account_number?: string;
  class_price?: string;
  whatsapp_number?: string;
}

/** =========================
 *  Helpers
 *  ========================= */
const BUCKET = "payment-proofs";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const formatPrice = (price?: string) => {
  const num = Number(price || 0);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const getFileExt = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "jpg") return "jpeg";
  if (ext === "jpeg") return "jpeg";
  if (ext === "png") return "png";
  return "png";
};

const KonfirmasiPembayaran = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const registrationToken = useMemo(
    () => searchParams.get("reg"),
    [searchParams]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /** Cleanup preview URL */
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /** Load token validity + site settings */
  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!registrationToken) {
        if (!active) return;
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // 1) Validasi token via RPC
      const { data: tokenOk, error: tokenErr } = await supabase.rpc(
        "check_registration_token" as any,
        { token: registrationToken }
      );

      if (!active) return;

      if (tokenErr || !tokenOk) {
        console.error("Token check error:", tokenErr);
        setIsValid(false);
        setIsLoading(false);
        return;
      }

      setIsValid(true);

      // 2) Ambil site settings
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (!active) return;

      if (error) {
        console.error("Error fetching settings:", error);
        setSettings({});
      } else {
        const map = (data || []).reduce((acc, item) => {
          (acc as any)[item.key] = item.value;
          return acc;
        }, {} as SiteSettings);

        setSettings(map);
      }

      setIsLoading(false);
    };

    run();

    return () => {
      active = false;
    };
  }, [registrationToken]);

  /** Handle file input */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Format tidak valid",
        description: "Hanya file JPG atau PNG yang diterima",
        variant: "destructive",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File terlalu besar",
        description: "Maksimal ukuran file 5MB",
        variant: "destructive",
      });
      return;
    }

    setPaymentProof(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  /** Submit flow */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationToken) {
      toast({
        title: "Error",
        description: "Token pendaftaran tidak ditemukan",
        variant: "destructive",
      });
      return;
    }

    const validation = paymentSchema.safeParse({
      senderAccountNumber,
    } satisfies PaymentInput);

    if (!validation.success) {
      toast({
        title: "Error",
        description: validation.error.errors[0]?.message ?? "Data tidak valid",
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

    try {
      // 1) Upload ke Storage
      const ext = getFileExt(paymentProof.name);
      const filePath = `${registrationToken}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, paymentProof, {
          cacheControl: "3600",
          upsert: false,
          contentType: paymentProof.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast({
          title: "Error",
          description:
            uploadError.message || "Gagal mengupload bukti pembayaran",
          variant: "destructive",
        });
        return;
      }

      // 2) Ambil public URL (bucket kamu harus public atau punya policy read)
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;

      if (!publicUrl) {
        toast({
          title: "Error",
          description: "Gagal mendapatkan URL bukti pembayaran",
          variant: "destructive",
        });
        return;
      }

      // 3) Insert konfirmasi pembayaran
      const classPrice = Number(settings?.class_price || 0);

      const { error: insertError } = await supabase
        .from("payment_confirmations")
        .insert({
          registration_token: registrationToken,
          sender_account_number: senderAccountNumber.trim(),
          class_price: classPrice,
          payment_proof_url: publicUrl,
        });

      if (insertError) {
        console.error("Insert error:", insertError);
        toast({
          title: "Error",
          description:
            insertError.message || "Gagal menyimpan konfirmasi pembayaran",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Berhasil!",
        description: "Konfirmasi pembayaran berhasil dikirim",
      });

      // 4) Buka WA Admin
      const whatsappNumber = settings?.whatsapp_number || "6281234567890";
      const message = encodeURIComponent(
        `Halo, saya sudah melakukan pembayaran untuk pendaftaran kelas trading.\n\n` +
        `No Rekening Pengirim: ${senderAccountNumber.trim()}\n` +
        `Token: ${registrationToken}`
      );

      window.open(
        `https://wa.me/${whatsappNumber}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );

      // Reset UI
      setSenderAccountNumber("");
      setPaymentProof(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (err: any) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Loading */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  /** Invalid token */
  if (!registrationToken || !isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Token Tidak Valid
          </h1>
          <p className="text-muted-foreground mb-6">
            Link konfirmasi pembayaran tidak valid atau sudah kadaluarsa.
          </p>
          <Link to="/#daftar" className="text-primary hover:underline">
            Kembali ke halaman pendaftaran
          </Link>
        </div>
      </div>
    );
  }

  /** UI */
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary border-2 border-border mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary uppercase tracking-widest">
              Konfirmasi Pembayaran
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            Selesaikan Pembayaran Anda
          </h1>
          <p className="text-muted-foreground">
            Upload bukti transfer dan isi nomor rekening pengirim.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Detail pembayaran */}
          <div className="bg-secondary border-4 border-border p-8 shadow-xl h-fit">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Detail Pembayaran
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-card border-2 border-border">
                <p className="text-sm text-muted-foreground">
                  Nama Pemilik Rekening
                </p>
                <p className="text-lg font-bold text-foreground">
                  {settings?.account_holder_name || "-"}
                </p>
              </div>

              <div className="p-4 bg-card border-2 border-border">
                <p className="text-sm text-muted-foreground">Nomor Rekening</p>
                <p className="text-lg font-bold text-foreground">
                  {settings?.account_number || "-"}
                </p>
              </div>

              <div className="p-4 bg-card border-2 border-border">
                <p className="text-sm text-muted-foreground">Harga Kelas</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(settings?.class_price)}
                </p>
              </div>

              <div className="p-4 bg-card border-2 border-border">
                <p className="text-sm text-muted-foreground">
                  Token Pendaftaran
                </p>
                <p className="font-mono text-foreground break-all">
                  {registrationToken}
                </p>
              </div>
            </div>
          </div>

          {/* Form konfirmasi */}
          <div className="bg-secondary border-4 border-border p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">
                Form Konfirmasi
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Nomor Rekening Pengirim *
                </label>
                <Input
                  value={senderAccountNumber}
                  onChange={(e) => setSenderAccountNumber(e.target.value)}
                  placeholder="Masukkan nomor rekening pengirim"
                  className="h-12 border-2"
                  maxLength={30}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Bukti Pembayaran *
                </label>

                <div className="border-2 border-dashed border-border p-6 text-center bg-card">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-proof"
                  />
                  <label
                    htmlFor="payment-proof"
                    className="cursor-pointer inline-flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Klik untuk upload (JPG/PNG, max 5MB)
                    </span>
                  </label>
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview bukti pembayaran"
                      className="w-full max-h-60 object-contain border-2 border-border bg-card"
                    />
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Klik area upload untuk ganti gambar
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                    Memproses...
                  </span>
                ) : (
                  "Konfirmasi Pembayaran"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Setelah terkirim, WhatsApp admin akan terbuka di tab baru.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiPembayaran;
