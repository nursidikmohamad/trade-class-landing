import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <VideoSection />
      <Features />
      <Footer />
    </main>
  );
};

export default Index;
