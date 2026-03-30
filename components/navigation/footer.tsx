"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

const CURRENT_YEAR = new Date().getFullYear();

const footerSections = [
  {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Our Projects", href: "/projects" },
      { title: "Services", href: "/services" },
      { title: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Services",
    links: [
      { title: "Commercial Construction", href: "/services" },
      { title: "Residential Projects", href: "/services" },
      { title: "Infrastructure", href: "/services" },
      { title: "Renovation", href: "/services" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/kimiaomran", icon: FaFacebook },
  { name: "LinkedIn", href: "https://linkedin.com/company/kimiaomran", icon: FaLinkedin },
  { name: "Instagram", href: "https://instagram.com/kimiaomran", icon: FaInstagram },
  { name: "YouTube", href: "https://youtube.com/@kimiaomran", icon: FaYoutube },
];

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 p-3 bg-nexus-teal-light text-nexus-navy
        shadow-lg transition-all duration-300
        hover:bg-nexus-teal-mid hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-nexus-teal-light focus:ring-offset-2"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
};

const Footer = () => {
  return (
    <>
      <footer className="bg-nexus-navy">
        {/* Top Line */}
        <div className="h-1 bg-nexus-teal-light" />

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.jpeg"
                  alt="Kimia Omran Construction Company"
                  width={180}
                  height={60}
                  className="h-auto w-auto max-h-12"
                />
              </Link>
              <p className="text-white/70 leading-relaxed">
                Building excellence since 2014. Kimia Omran Engineering and Construction
                Company delivers superior quality construction services with unwavering
                commitment to safety, innovation, and client satisfaction.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center border border-white/20
                      text-white/70 transition-all duration-300
                      hover:border-nexus-teal-light hover:bg-nexus-teal-light hover:text-nexus-navy"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-2">
                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                  {section.title}
                  <span className="mt-2 block h-0.5 w-8 bg-nexus-teal-light" />
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/60 transition-all duration-300
                          hover:text-nexus-teal-light hover:translate-x-1 inline-block"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact Info */}
            <div className="lg:col-span-3">
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-white">
                Contact Us
                <span className="mt-2 block h-0.5 w-8 bg-nexus-teal-light" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-nexus-teal-light mt-0.5" />
                  <p className="text-sm text-white/60">
                    Karte 4, next to the 3rd district, opposite Soltani Block,
                    Kabul, Afghanistan.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-nexus-teal-light" />
                  <a
                    href="tel:+93776437752"
                    className="text-sm text-white/60 transition-colors hover:text-nexus-teal-light"
                  >
                    +93 (0) 776-437-752
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-nexus-teal-light" />
                  <a
                    href="mailto:Abbasrahimi521@gmail.com"
                    className="break-all text-sm text-white/60 transition-colors hover:text-nexus-teal-light"
                  >
                    Abbasrahimi521@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-nexus-teal-light" />
                  <p className="text-sm text-white/60">
                    Sat - Thu: 8:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-center text-xs text-white/50 sm:text-left">
                &copy; {CURRENT_YEAR} Kimia Omran Engineering & Construction. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
                <Link
                  href="/privacy"
                  className="text-xs text-white/50 transition-colors hover:text-nexus-teal-light"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs text-white/50 transition-colors hover:text-nexus-teal-light"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ScrollToTop />
    </>
  );
};

export default Footer;
