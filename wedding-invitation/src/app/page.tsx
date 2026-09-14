import Hero from "@/components/Hero";
import WeddingDetails from "@/components/WeddingDetails";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import RSVPForm from "@/components/RSVPForm";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WeddingDetails />
      <Countdown />
      <Gallery />
      <RSVPForm />
      <LocationSection />
      <Footer />
      <MusicPlayer />
    </main>
  );
}
