"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-6"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.nav
        className={`flex items-center justify-between transition-all duration-500 ${
          scrolled 
            ? "bg-black/80 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10" 
            : ""
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group relative">
          <motion.span
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            B&T
            <span className="text-white/30">®</span>
          </motion.span>
          <motion.span
            className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <Link
                href={link.href}
                className="relative px-4 py-2 text-sm text-white/70 hover:text-white transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Location/Status */}
        <motion.div
          className="hidden lg:flex flex-col items-end text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-white/40">Available for projects</span>
          <span className="text-white/70 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </span>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          whileTap={{ scale: 0.95 }}
        >
          <span
            className={`w-6 h-[1.5px] bg-white rounded-full transition-transform ${
              mobileOpen ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] bg-white rounded-full transition-all ${
              mobileOpen ? "w-6 -translate-y-[4px] -rotate-45" : "w-4"
            }`}
          />
        </motion.button>
      </motion.nav>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-3 rounded-2xl bg-black/85 backdrop-blur-xl border border-white/10 overflow-hidden"
          >
            <ul className="flex flex-col py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-3 text-base text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}


