import React, { useState, useEffect } from "react";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Copy } from "lucide-react";
import DiscountCountdown from "@/components/DiscountCountdown";

// payment upload constants removed — confirmation now sent without proof in this flow

const formSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi").max(100),
  email: z.string().trim().email("Format email tidak valid").max(255),
  whatsapp: z.string().trim().min(10, "Nomor WhatsApp minimal 10 digit").max(15),
  pengalaman: z.string().optional(),
});

type FormState = z.infer<typeof formSchema>;

const initialState: FormState = {
  nama: "",
  email: "",
  whatsapp: "",
  pengalaman: "",
};

interface SiteSettings {
  account_holder_name?: string;
  account_number?: string;
  class_price?: string;
  whatsapp_number?: string;
  bank_name?: string;
  discount_percent?: string;
}

const RegistrationForm = () => {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>(initialState);
  const [senderAccountNumber, setSenderAccountNumber] = useState("");
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = formSchema.safeParse(formData);
    if (!validation.success) {
      toast({
        title: "Error",
        description: validation.error.errors[0]?.message ?? "Data tidak valid",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const registrationToken =
        globalThis.crypto && "randomUUID" in globalThis.crypto
          ? globalThis.crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const payload = {
        name: formData.nama.trim(),
        email: formData.email.trim(),
        phone: formData.whatsapp.trim(),
        experience: formData.pengalaman ? formData.pengalaman : null,
        registration_token: registrationToken,
      };

      const { error } = await supabase.from("registrations").insert([payload]);

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Gagal menyimpan data. Silakan coba lagi.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // insert payment_confirmation with sender account and class price
      const classPrice = Number(settings?.class_price || 0);
      const { error: payErr } = await supabase
        .from("payment_confirmations")
        .insert({
          registration_token: registrationToken,
          sender_account_number: senderAccountNumber.trim() || null,
          class_price: classPrice,
          payment_proof_url: null,
        });

      if (payErr) {
        console.error("Error inserting payment confirmation:", payErr);
        toast({
          title: "Warning",
          description:
            "Pendaftaran tersimpan, namun konfirmasi pembayaran gagal disimpan.",
        });
      }

      // sukses insert — open WhatsApp and reset form
      setFormData(initialState);
      setSenderAccountNumber("");
      setIsLoading(false);

      const whatsappNumber = settings?.whatsapp_number || "6281234567890";
      const message = encodeURIComponent(
        `Halo, saya sudah mendaftar kelas trading.\n\nNama: ${payload.name}\nEmail: ${payload.email}\nNo WA: ${payload.phone}\nNo Rek Pengirim: ${senderAccountNumber
          .trim()}\nToken: ${registrationToken}`
      );

      window.open(
        `https://wa.me/${whatsappNumber}?text=${message}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan tak terduga. Silakan coba lagi.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // load site settings for class price and whatsapp
    let active = true;

    (async () => {
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
    })();

    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (price?: string) => {
    const num = Number(price || 0);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const getEffectivePrice = () => {
    const original = Number(settings?.class_price || 0);
    const discount = Number(settings?.discount_percent || 0);
    if (!original) return 0;
    const effective = Math.round(
      original * (1 - Math.min(Math.max(discount, 0), 100) / 100)
    );
    return effective;
  };

  return (
    <section id="daftar" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* CARD FORM (PARENT RELATIVE AGAR TIMER NEMPEL KE CARD) */}
          <div className="bg-secondary border-4 border-border p-8 shadow-xl relative">
            {/* TIMER DI TENGAH ATAS CARD (TIDAK MEPET) */}
            <div className="absolute inset-x-0 top-8 flex justify-center">
              <DiscountCountdown
                hours={48}
                label="Diskon berakhir"
                storageKey="register_discount_end"
                className="text-center"
              />
            </div>

            {/* SPACER BIAR JUDUL & ISI FORM TIDAK KETABRAK TIMER */}
            <div className="pt-28">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Formulir Pendaftaran
              </h3>

              {/* Informasi pembayaran / instruksi */}
              <div className="mb-6 p-4 bg-card border-2 border-border rounded-lg">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Silakan isi dengan data yang benar
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Masukkan nomor rekening pengirim pada kolom "No Rek Pengirim"
                  di bawah. Berikut adalah informasi rekening tujuan yang harus
                  Anda transfer:
                </p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="bg-secondary p-4 rounded border border-border">
                      <p className="text-xs text-muted-foreground">
                        No Rekening Tujuan
                      </p>

                      <div className="flex items-center gap-3">
                        <p className="font-mono text-lg font-bold text-foreground">
                          {settings?.account_number || "-"}
                        </p>

                        <button
                          type="button"
                          onClick={async () => {
                            const txt = settings?.account_number || "";
                            if (!txt) {
                              toast({
                                title: "Tidak ada nomor",
                                description:
                                  "Nomor rekening tujuan belum diset oleh admin",
                                variant: "destructive",
                              });
                              return;
                            }
                            try {
                              await navigator.clipboard.writeText(txt);
                              toast({
                                title: "Disalin",
                                description: "Nomor rekening disalin ke clipboard",
                              });
                            } catch (err) {
                              console.error("Clipboard copy failed:", err);
                              toast({
                                title: "Gagal",
                                description: "Tidak dapat menyalin ke clipboard",
                                variant: "destructive",
                              });
                            }
                          }}
                          className="inline-flex items-center justify-center p-2 rounded border hover:bg-card"
                          aria-label="Salin nomor rekening"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">
                          Nama Rekening
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          {settings?.account_holder_name || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-56">
                    <div className="bg-card p-3 rounded border border-border">
                      <p className="text-xs text-muted-foreground">Nama Bank</p>
                      <p className="text-sm font-semibold text-foreground">
                        {(settings as any)?.bank_name || "-"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Pastikan Anda mengetik nomor rekening dengan benar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
                    value={formData.pengalaman ?? ""}
                    onChange={handleChange}
                    className="w-full bg-card border-2 border-border focus:border-primary h-12 px-4 text-foreground"
                  >
                    <option value="">Pilih pengalaman Anda</option>
                    <option value="pemula">Pemula (belum pernah trading)</option>
                    <option value="menengah">Menengah (1-2 tahun)</option>
                    <option value="mahir">Mahir (lebih dari 2 tahun)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    Harga Kelas
                  </label>
                  <div className="p-3 bg-card border-2 border-border rounded">
                    <div className="text-sm text-muted-foreground">
                      Harga Normal
                    </div>
                    <div className="font-semibold text-foreground">
                      {formatPrice(settings?.class_price)}
                    </div>

                    {settings?.discount_percent ? (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground">
                          Harga setelah diskon ({settings.discount_percent}%)
                        </div>
                        <div className="text-lg font-bold text-primary">
                          {formatPrice(String(getEffectivePrice()))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">
                    No Rek Pengirim *
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
                  Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang
                  berlaku
                </p>
              </form>
              {/* confirmation moved into main form; no separate card */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
