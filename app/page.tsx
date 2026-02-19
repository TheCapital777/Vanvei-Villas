import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Apartments from "@/components/Apartments";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Apartments />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
