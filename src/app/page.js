import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import VerseBlock from "@/components/VerseBlock/VerseBlock";
import AboutSection from "@/components/AboutSection/AboutSection";
import Team from "@/components/Team/Team";
import VirtuesGrid from "@/components/VirtuesGrid/VirtuesGrid";
import Programs from "@/components/Programs/Programs";
import JourneyPath from "@/components/JourneyPath/JourneyPath";
import Testimonials from "@/components/Testimonials/Testimonials";
import ImpactStats from "@/components/ImpactStats/ImpactStats";
import FAQ from "@/components/FAQ/FAQ";
import JoinCommunity from "@/components/JoinCommunity/JoinCommunity";
import ArasProject from "@/components/ArasProject/ArasProject";
import Gallery from "@/components/Gallery/Gallery";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main id="main-content">
      <Header />
      <Hero />
      <VerseBlock />
      <AboutSection />
      <Team />
      <VirtuesGrid />
      <Programs />
      <JourneyPath />
      <ArasProject />
      <ImpactStats />
      <FAQ />
      <JoinCommunity />
      <Gallery />
      <Footer />
    </main>
  );
}
