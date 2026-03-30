"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import menuData from "./menuData";
import ThemeToggler from "./providers/toggleMode";

// Color palette matching your design
const colors = {
  primary: "#033a6d",
  secondary: "#005c75",
  tertiary: "#007c8f",
  quaternary: "#009996",
  quinary: "#00b3aa",
  gradient:
    "linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)",
  accent: "#00b3aa",
};

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen((prev) => !prev);
  };

  const pathname = usePathname();

  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = useCallback(() => {
    setSticky(window.scrollY >= 40);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, [handleStickyNavbar]);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest(".group")) {
        setOpenIndex(-1);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 w-full z-9999 transition-all duration-500
          ${
            sticky
              ? "py-2 md:py-2.5 bg-white/95 dark:bg-[#010a12]/95 backdrop-blur-xl shadow-lg"
              : "py-3 md:py-4 bg-transparent"
          }
        `}
        style={{
          borderBottom: sticky ? `1px solid ${colors.quinary}20` : "none",
        }}
      >
        {/* Digital Grid Overlay - Only when sticky */}
        {sticky && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.02)_1px,transparent_1px)] bg-size-[32px_32px]" />
          </div>
        )}

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="relative group">
              <Link href="/" className="relative block ">
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-sm blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ background: colors.gradient }}
                />
                <Image
                  src="/logo.png"
                  alt="Kimia Omran Engineering & Construction"
                  width={180}
                  height={55}
                  className="h-auto w-auto max-h-10 md:max-h-12 relative z-10 dark:brightness-90"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center">
              <ul className="flex items-center space-x-1">
                {menuData.map((menuItem, index) => (
                  <li key={index} className="relative group">
                    {menuItem.path ? (
                      <Link
                        href={menuItem.path as string}
                        className={`
                          relative px-4 py-2.5 text-sm font-medium rounded-sm
                          transition-all duration-300 inline-flex items-center
                          ${
                            pathname === menuItem.path
                              ? "text-[#00b3aa]"
                              : "text-gray-700 hover:text-[#00b3aa] dark:text-gray-300 dark:hover:text-[#00b3aa]"
                          }
                        `}
                      >
                        {/* Active Indicator */}
                        {pathname === menuItem.path && (
                          <motion.span
                            layoutId="activeNav"
                            className="absolute inset-0 rounded-sm"
                            style={{ background: `${colors.quinary}10` }}
                            transition={{ type: "spring", duration: 0.5 }}
                          />
                        )}
                        <span className="relative z-10">{menuItem.title}</span>
                        {/* Underline Effect */}
                        <span
                          className={`absolute   ${
                            pathname === menuItem.path ? "w-1/2" : ""
                          }`}
                          style={{ background: colors.gradient }}
                        />
                      </Link>
                    ) : (
                      <div className="relative">
                        <button
                          onClick={() => handleSubmenu(index)}
                          className={`
                            relative px-4 py-2.5 text-sm font-medium rounded-sm
                            transition-all duration-300 inline-flex items-center gap-1.5
                            ${
                              openIndex === index
                                ? "text-[#00b3aa]"
                                : "text-gray-700 hover:text-[#00b3aa] dark:text-gray-300 dark:hover:text-[#00b3aa]"
                            }
                          `}
                        >
                          <span className="relative z-10">
                            {menuItem.title}
                          </span>
                          <motion.svg
                            animate={{ rotate: openIndex === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </motion.svg>
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {openIndex === index && menuItem.submenu && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute left-0 top-full mt-2 w-56 z-50"
                            >
                              <div
                                className="relative bg-white dark:bg-[#010a12] rounded-sm shadow-xl border overflow-hidden"
                                style={{ borderColor: `${colors.quinary}20` }}
                              >
                                {/* Gradient Top Border */}
                                <div
                                  className="absolute top-0 left-0 right-0 h-0.5"
                                  style={{ background: colors.gradient }}
                                />

                                {/* Digital Grid Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.02)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

                                <div className="relative p-1.5">
                                  {menuItem.submenu.map((subItem, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={subItem.path as string}
                                      onClick={() => setOpenIndex(-1)}
                                      className={`
                                        group/sub flex items-center justify-between px-3 py-2.5 rounded-sm
                                        transition-all duration-300
                                        ${
                                          pathname === subItem.path
                                            ? "text-[#00b3aa]"
                                            : "text-gray-600 hover:text-[#00b3aa] dark:text-gray-400 dark:hover:text-[#00b3aa]"
                                        }
                                      `}
                                    >
                                      <span className="text-sm font-medium">
                                        {subItem.title}
                                      </span>
                                      <motion.svg
                                        initial={{ x: -5, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                        className="w-3.5 h-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                      </motion.svg>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <ThemeToggler />

              <Link href="/login" className="relative group overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-4 py-2 text-sm font-medium text-white rounded-sm"
                  style={{ background: colors.gradient }}
                >
                  <span className="relative z-10">Sign In</span>
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{ filter: "blur(4px)" }}
                  />
                </motion.div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={navbarToggleHandler}
                aria-label="Toggle Mobile Menu"
                aria-expanded={navbarOpen}
                className="inline-flex items-center justify-center w-10 h-10 lg:hidden rounded-sm transition-all duration-300 hover:scale-110 active:scale-90"
                style={{
                  background: navbarOpen
                    ? `${colors.quinary}20`
                    : "transparent",
                  border: `1px solid ${colors.quinary}30`,
                }}
              >
                <div className="relative w-4.5 h-4.5">
                  <motion.span
                    animate={
                      navbarOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-0 w-full h-0.5 rounded-sm"
                    style={{ background: colors.quinary }}
                  />
                  <motion.span
                    animate={navbarOpen ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-2 left-0 w-full h-0.5 rounded-sm"
                    style={{ background: colors.quinary }}
                  />
                  <motion.span
                    animate={
                      navbarOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                    }
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 w-full h-0.5 rounded-sm"
                    style={{ background: colors.quinary }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {navbarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavbarOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-x-4 top-20 z-50 lg:hidden"
            >
              <div
                className="relative bg-white dark:bg-[#010a12] rounded-sm shadow-2xl border overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
                style={{ borderColor: `${colors.quinary}20` }}
              >
                {/* Gradient Top Border */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: colors.gradient }}
                />

                {/* Digital Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.02)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

                <div className="relative p-4">
                  <nav>
                    <ul className="space-y-1">
                      {menuData.map((menuItem, index) => (
                        <li key={index}>
                          {menuItem.path ? (
                            <Link
                              href={menuItem.path as string}
                              onClick={() => setNavbarOpen(false)}
                              className={`
                                flex items-center py-3 px-3 rounded-sm text-sm font-medium
                                transition-all duration-300
                                ${
                                  pathname === menuItem.path
                                    ? "text-[#00b3aa]"
                                    : "text-gray-700 hover:text-[#00b3aa] dark:text-gray-300 dark:hover:text-[#00b3aa]"
                                }
                              `}
                            >
                              {pathname === menuItem.path && (
                                <motion.div
                                  layoutId="mobileActive"
                                  className="absolute left-0 w-0.5 h-8"
                                  style={{ background: colors.gradient }}
                                />
                              )}
                              <span className="ml-2">{menuItem.title}</span>
                            </Link>
                          ) : (
                            <div>
                              <button
                                onClick={() => handleSubmenu(index)}
                                className={`
                                  flex w-full items-center justify-between py-3 px-3 rounded-sm
                                  text-sm font-medium transition-all duration-300
                                  ${
                                    openIndex === index
                                      ? "text-[#00b3aa]"
                                      : "text-gray-700 hover:text-[#00b3aa] dark:text-gray-300 dark:hover:text-[#00b3aa]"
                                  }
                                `}
                              >
                                <span>{menuItem.title}</span>
                                <motion.svg
                                  animate={{
                                    rotate: openIndex === index ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                >
                                  <polyline points="6 9 12 15 18 9" />
                                </motion.svg>
                              </button>

                              <AnimatePresence>
                                {openIndex === index && menuItem.submenu && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="ml-4 space-y-1 overflow-hidden"
                                  >
                                    {menuItem.submenu.map(
                                      (subItem, subIndex) => (
                                        <Link
                                          key={subIndex}
                                          href={subItem.path as string}
                                          onClick={() => {
                                            setNavbarOpen(false);
                                            setOpenIndex(-1);
                                          }}
                                          className={`
                                          flex items-center py-2.5 px-3 rounded-sm text-sm
                                          transition-all duration-300
                                          ${
                                            pathname === subItem.path
                                              ? "text-[#00b3aa]"
                                              : "text-gray-600 hover:text-[#00b3aa] dark:text-gray-400 dark:hover:text-[#00b3aa]"
                                          }
                                        `}
                                        >
                                          <span
                                            className="w-1.5 h-1.5 rounded-full mr-2"
                                            style={{
                                              background: colors.quinary,
                                            }}
                                          />
                                          {subItem.title}
                                        </Link>
                                      ),
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </li>
                      ))}

                      {/* Mobile Sign In Button */}
                      <li
                        className="pt-4 mt-2 border-t"
                        style={{ borderColor: `${colors.quinary}20` }}
                      >
                        <Link
                          href="/journey"
                          onClick={() => setNavbarOpen(false)}
                          className="flex w-full items-center justify-center px-4 py-3 rounded-sm text-sm font-medium text-white transition-all duration-300 hover:shadow-lg"
                          style={{ background: colors.gradient }}
                        >
                          Sign In
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Spacer */}
      <div
        className={`transition-all duration-500 ${
          sticky ? "h-17 md:h-18 lg:h-20" : "h-18 md:h-20 lg:h-23"
        }`}
      />
    </>
  );
};

export default Header;
