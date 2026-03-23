import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/landing/Hero';
import HowItWorks from '../../components/landing/HowItWorks';
import MarketplacePreview from '../../components/landing/MarketplacePreview';
import CTA from '../../components/landing/cta';
import Footer from '../../components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden font-sans">
      <Navbar />
      <Hero />
      <HowItWorks />
      <MarketplacePreview />
      <CTA />
      <Footer />
    </main>
  );
}
