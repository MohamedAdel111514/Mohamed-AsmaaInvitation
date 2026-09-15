import Hero from "@/components/Hero";
import WeddingDetails from "@/components/WeddingDetails";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import RSVPForm from "@/components/RSVPForm";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import CalendarSection from "@/components/CalendarSection";


export default function HomePage() {
  return (
    <main>
      <Hero />
      <CalendarSection />
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
