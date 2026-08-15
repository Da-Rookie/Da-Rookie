import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { profile } from "@/data/profile";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#research", label: "Research" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-[#E4E5DB]/90 backdrop-blur-md border-b border-[#152A38]/10 shadow-xs"
            : "bg-transparent"
          }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <nav
            className="flex items-center justify-between h-14"
            aria-label="Main navigation"
          >
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="font-mono text-sm font-medium tracking-widest text-[#152A38] hover:text-[#2F5241] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] rounded"
              aria-label="Eko Prasetyo Pratomo — Back to top"
            >
              {profile.logoBrand}
            </a>

            {/* Desktop nav */}
            <ul className="hidden md:flex items-center gap-7" role="list">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                      className={`relative text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] rounded px-1 ${isActive ? "text-[#152A38] font-semibold" : "text-[#4A5B52] hover:text-[#152A38]"
                        }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#2F5241]"
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNav("#contact"); }}
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[#152A38] border border-[#152A38]/20 bg-[#FAF8F2] px-4 py-1.5 hover:border-[#2F5241] hover:text-[#2F5241] hover:bg-[#D6CFB9]/30 transition-all rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241]"
              >
                Let&apos;s Talk
                <span aria-hidden="true">↗</span>
              </a>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-[#152A38] hover:text-[#2F5241] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] rounded"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#E4E5DB]/98 backdrop-blur-lg flex flex-col pt-20 px-6"
          >
            <ul className="flex flex-col gap-1" role="list">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                    className="block py-4 text-2xl font-display font-semibold text-[#152A38] border-b border-[#152A38]/10 hover:text-[#2F5241] transition-colors"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNav("#contact"); }}
              className="mt-8 inline-flex items-center gap-2 text-lg font-medium text-[#2F5241]"
            >
              Let&apos;s Talk <span aria-hidden="true">↗</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
