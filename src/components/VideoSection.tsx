import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play } from "lucide-react";
import JadwalSession from "@/components/JadwalSession";

const VideoSection = () => {
  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  );

  useEffect(() => {
    const fetchYoutubeUrl = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "youtube_url")
        .maybeSingle();

      if (!error && data) {
        setYoutubeUrl(data.value);
      }
    };

    fetchYoutubeUrl();
  }, []);

  return (
    <section id="video" className="py-20 bg-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-primary font-mono text-sm uppercase tracking-widest mb-4">
            Preview Kelas
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Lihat Bagaimana Kami Mengajar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {/* Tonton video pengenalan untuk melihat kualitas materi dan metode */}
            {/* pembelajaran kami */}
          </p>
        </div>

        {/* YouTube Embed */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-secondary border-4 border-border shadow-xl overflow-hidden group">
            <iframe
              className="w-full h-full"
              src={youtubeUrl}
              title="Preview Kelas Trading"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary" />
          </div>
        </div>

        {/* Video Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="relative overflow-hidden rounded-2xl text-center p-6 bg-secondary/70 border border-primary/25 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <Play className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-2">Session I</h3>
            <p className="text-sm italic text-primary/90 drop-shadow-[0_0_10px_rgba(234,179,8,0.30)]">
              Uncovering the Dark Side of the ProFirm Industry
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl text-center p-6 bg-secondary/70 border border-primary/25 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <Play className="w-10 h-10 text-primary mx-auto mb-4" />
            <h1 className="font-bold text-foreground mb-2">Session II</h1>
            <p className="text-sm italic text-primary/90 drop-shadow-[0_0_10px_rgba(234,179,8,0.30)]">
              In-Depth Technical Analysis
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl text-center p-6 bg-secondary/70 border border-primary/25 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <Play className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-2">Session III</h3>
            <p className="text-sm italic text-primary/90 drop-shadow-[0_0_10px_rgba(234,179,8,0.30)]">
              Live Trading Using Advanced Tools for ProFirm System Algorithmic
              Protection
            </p>
          </div>
        </div>

        {/* ✅ Jadwal (setelah kotak Session III) */}
        <div className="max-w-5xl mx-auto mt-10">
          <JadwalSession />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
