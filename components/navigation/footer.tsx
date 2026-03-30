'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
  ChevronRight,
} from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";

// Color palette matching your design
const colors = {
  primary: '#033a6d',
  secondary: '#005c75',
  tertiary: '#007c8f',
  quaternary: '#009996',
  quinary: '#00b3aa',
  gradient: 'linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)',
  accent: '#00b3aa',
};

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

// Digital Cursor Effect
const DigitalCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        borderColor: colors.quinary,
      }}
    />
  );
};

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
      className="fixed bottom-6 right-6 z-40 rounded-sm p-3 shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: colors.gradient,
        color: 'white',
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
};

const Footer = () => {
  return (
    <>
      <DigitalCursor />
      <footer className="relative bg-white dark:bg-[#010a12] border-t border-gray-200 dark:border-[#064e78] overflow-hidden">
        {/* Digital Grid Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.02)_1px,transparent_1px)] bg-size-[32px_32px]"
          />
        </div>

        {/* Top Accent Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: colors.gradient }}
        />

        {/* Main Footer Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-6"
            >
              <Link href="/" className="inline-block">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Kimia Omran Construction Company"
                    width={280}
                    height={70}
                    className="h-auto w-auto max-h-16 dark:brightness-90"
                  />
                </div>
              </Link>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400 text-sm">
                Building excellence since 1998. Kimia Omran Engineering and Construction
                Company delivers superior quality construction services with unwavering
                commitment to safety, innovation, and client satisfaction.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="relative"
                  >
                    <div 
                      className="relative flex h-10 w-10 items-center justify-center border rounded-sm"
                      style={{ 
                        borderColor: `${colors.quinary}30`,
                        color: colors.quinary,
                      }}
                    >
                      <social.icon className="h-4 w-4" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Footer Links */}
            {footerSections.map((section, sectionIdx) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIdx * 0.1 }}
                className="lg:col-span-2"
              >
                <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  {section.title}
                  <span 
                    className="mt-2 block h-0.5 w-8"
                    style={{ background: colors.gradient }}
                  />
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 transition-all duration-300 hover:text-[#00b3aa]"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Contact Us
                <span 
                  className="mt-2 block h-0.5 w-8"
                  style={{ background: colors.gradient }}
                />
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="mt-0.5">
                    <MapPin className="h-5 w-5 shrink-0 transition-colors group-hover:text-[#00b3aa]" style={{ color: colors.quinary }} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Karte 4, next to the 3rd district, opposite Soltani Block,
                    Kabul, Afghanistan.
                  </p>
                </div>
                <div className="flex items-center gap-3 group">
                  <Phone className="h-5 w-5 shrink-0 transition-colors group-hover:text-[#00b3aa]" style={{ color: colors.quinary }} />
                  <a
                    href="tel:+93776437752"
                    className="text-sm text-gray-600 dark:text-gray-400 transition-colors hover:text-[#00b3aa]"
                  >
                    +93 (0) 776-437-752
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <Mail className="h-5 w-5 shrink-0 transition-colors group-hover:text-[#00b3aa]" style={{ color: colors.quinary }} />
                  <a
                    href="mailto:Abbasrahimi521@gmail.com"
                    className="break-all text-sm text-gray-600 dark:text-gray-400 transition-colors hover:text-[#00b3aa]"
                  >
                    Abbasrahimi521@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <Clock className="h-5 w-5 shrink-0 transition-colors group-hover:text-[#00b3aa]" style={{ color: colors.quinary }} />
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    Sat - Thu: 8:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-gray-200 dark:border-[#064e78]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-center text-xs text-gray-500 dark:text-gray-500 sm:text-left">
                &copy; {CURRENT_YEAR} Kimia Omran Engineering & Construction. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end sm:gap-6">
                <Link
                  href="/privacy"
                  className="relative text-xs text-gray-500 dark:text-gray-500 transition-colors hover:text-[#00b3aa] group"
                >
                  Privacy Policy
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00b3aa] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link
                  href="/terms"
                  className="relative text-xs text-gray-500 dark:text-gray-500 transition-colors hover:text-[#00b3aa] group"
                >
                  Terms of Service
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00b3aa] transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Pulse Effect */}
        <motion.div
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: `${colors.quinary}10` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: `${colors.primary}20` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </footer>

      <ScrollToTop />
    </>
  );
};

export default Footer;
