import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import CapabilityBento from "@/components/sections/CapabilityBento";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Publications from "@/components/sections/Publications";
import Skills from "@/components/sections/Skills";
import Achievements from "@/components/sections/Achievements";
import Education from "@/components/sections/Education";
import Contact from "@/components/sections/Contact";

export default function App() {
  return (
    <div className="min-h-screen bg-[#E4E5DB] text-[#152A38] overflow-x-hidden">
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#2F5241] focus:text-[#E4E5DB] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:border focus:border-[#152A38]"
      >
        Skip to main content
      </a>

      <Navbar />

      <main role="main">
        <Hero />
        <CapabilityBento />
        <About />
        <Projects />
        <Experience />
        <Publications />
        <Skills />
        <Achievements />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
