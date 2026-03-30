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
      className="fixed bottom-6 right-6 z-40 rounded-sm p-3 bg-[#6ABAE1] text-[#03396C]
        shadow-lg transition-all duration-300
        hover:bg-[#7CC8EB] hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-[#6ABAE1] focus:ring-offset-2
        focus:ring-offset-white dark:focus:ring-offset-gray-900"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
};

const Footer = () => {
  return (
    <>
      <footer className="border-t border-[#D8F0F4]/60 bg-white text-[#03396C] dark:border-[#6ABAE1]/20 dark:bg-gray-900 dark:text-[#D8F0F4]">
        {/* Top Line */}

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-6">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="Kimia Omran Construction Company"
                  width={280}
                  height={60}
                  className="h-auto w-auto max-h-12"
                />
              </Link>
              <p className="leading-relaxed text-[#03396C]/70 dark:text-[#D8F0F4]/70">
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
                    className="flex h-10 w-10 items-center justify-center border border-[#6ABAE1]/30
                      text-[#03396C]/80 transition-all duration-300
                      hover:border-[#6ABAE1] hover:bg-[#6ABAE1] hover:text-[#03396C]
                      dark:border-[#D8F0F4]/20 dark:text-[#D8F0F4]/70 dark:hover:border-[#6ABAE1] dark:hover:bg-[#6ABAE1] dark:hover:text-[#03396C]"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="lg:col-span-2">
                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#03396C] dark:text-[#D8F0F4]">
                  {section.title}
                  <span className="mt-2 block h-0.5 w-8 bg-[#6ABAE1]" />
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="inline-block text-sm text-[#03396C]/70 transition-all duration-300
                          hover:translate-x-1 hover:text-[#6ABAE1] dark:text-[#D8F0F4]/60 dark:hover:text-[#6ABAE1]"
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
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#03396C] dark:text-[#D8F0F4]">
                Contact Us
                <span className="mt-2 block h-0.5 w-8 bg-[#6ABAE1]" />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#6ABAE1]" />
                  <p className="text-sm text-[#03396C]/70 dark:text-[#D8F0F4]/60">
                    Karte 4, next to the 3rd district, opposite Soltani Block,
                    Kabul, Afghanistan.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-[#6ABAE1]" />
                  <a
                    href="tel:+93776437752"
                    className="text-sm text-[#03396C]/70 transition-colors hover:text-[#6ABAE1] dark:text-[#D8F0F4]/60 dark:hover:text-[#6ABAE1]"
                  >
                    +93 (0) 776-437-752
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[#6ABAE1]" />
                  <a
                    href="mailto:Abbasrahimi521@gmail.com"
                    className="break-all text-sm text-[#03396C]/70 transition-colors hover:text-[#6ABAE1] dark:text-[#D8F0F4]/60 dark:hover:text-[#6ABAE1]"
                  >
                    Abbasrahimi521@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 shrink-0 text-[#6ABAE1]" />
                  <p className="text-sm text-[#03396C]/70 dark:text-[#D8F0F4]/60">
                    Sat - Thu: 8:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#D8F0F4]/60 dark:border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-center text-xs text-[#03396C]/60 dark:text-[#D8F0F4]/50 sm:text-left">
                &copy; {CURRENT_YEAR} Kimia Omran Engineering & Construction. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
                <Link
                  href="/privacy"
                  className="text-xs text-[#03396C]/60 transition-colors hover:text-[#6ABAE1] dark:text-[#D8F0F4]/50 dark:hover:text-[#6ABAE1]"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-xs text-[#03396C]/60 transition-colors hover:text-[#6ABAE1] dark:text-[#D8F0F4]/50 dark:hover:text-[#6ABAE1]"
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
