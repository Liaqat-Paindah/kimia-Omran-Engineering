'use client';

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, Variants } from "framer-motion";
import Image from "next/image";

const colors = {
  primary: '#033a6d',
  secondary: '#005c75',
  tertiary: '#007c8f',
  quaternary: '#009996',
  quinary: '#00b3aa',
  gradient: 'linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)',
  accent: '#00b3aa',
};

const Icons = {
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Quote: ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 11h-4v-4h4v4zm8 0h-4v-4h4v4z" />
      <path d="M20 4h-4V2h-2v2H10V2H8v2H4v14h6v2h4v-2h6V4z" />
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Award: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="7" />
      <polygon points="12 2 14 7 19 7 15 11 17 16 12 13 7 16 9 11 5 7 10 7 12 2" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Target: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Heart: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
};

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
      style={{ x: cursorXSpring, y: cursorYSpring, borderColor: colors.quinary }}
    />
  );
};

const ValueCard = ({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur" style={{ background: colors.gradient }} />
      <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 text-center">
        <motion.div
          animate={{ rotate: isHovered ? 360 : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 rounded-sm flex items-center justify-center mx-auto mb-4 border-2"
          style={{ borderColor: colors.quinary, background: `${colors.quinary}10` }}
        >
          <div className="text-[#00b3aa]">{icon}</div>
        </motion.div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{description}</p>
      </div>
    </motion.div>
  );
};

export default function KimiaOmranAbout() {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + custom * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const values = [
    { icon: <Icons.Target />, title: "Excellence", description: "Striving for perfection in every project we undertake." },
    { icon: <Icons.Users />, title: "Integrity", description: "Building trust through transparency and honesty." },
    { icon: <Icons.Heart />, title: "Innovation", description: "Embracing cutting-edge technology and solutions." },
    { icon: <Icons.Award />, title: "Sustainability", description: "Committed to environmental responsibility." },
  ];

  return (
    <>
      <DigitalCursor />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070"
            alt="About Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.primary}CC, ${colors.secondary}CC)` }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.1)_1px,transparent_1px)] bg-size-[40px_40px]" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
            <motion.div custom={0} variants={textVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-sm mb-6" style={{ background: `${colors.quinary}20`, border: `1px solid ${colors.quinary}` }}>
              <span className="text-xs font-mono" style={{ color: colors.quinary }}>OUR STORY</span>
            </motion.div>
            <motion.h1 custom={1} variants={textVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Building Excellence Since <span style={{ color: colors.quinary }}>1998</span>
            </motion.h1>
            <motion.p custom={2} variants={textVariants} className="text-lg text-white/80 max-w-2xl mx-auto">
              Kimia Omran Engineering & Construction Company has been at the forefront of the industry,
              delivering innovative solutions and exceptional quality across the Middle East and beyond.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white dark:bg-[#010a12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Who We Are</h2>
              <div className="w-20 h-1 mb-6" style={{ background: colors.gradient }} />
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                Kimia Omran Engineering & Construction Company is a premier construction and engineering firm
                dedicated to transforming visions into reality. With over two decades of experience, we have
                established ourselves as a trusted partner for complex infrastructure, commercial, and residential projects.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Our commitment to excellence, innovation, and sustainability drives every project we undertake,
                ensuring that we not only meet but exceed our clients` expectations.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Projects Completed", value: "380+" },
                  { label: "Satisfied Clients", value: "250+" },
                  { label: "Expert Engineers", value: "1,200+" },
                  { label: "Years Experience", value: "26" },
                ].map((stat, index) => (
                  <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <div className="text-2xl font-bold" style={{ color: colors.quinary }}>{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative h-96 rounded-sm overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070" alt="Company" fill className="object-cover" />
              <div className="absolute inset-0 border-2 border-[#00b3aa] rounded-sm pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative overflow-hidden" style={{ background: `${colors.primary}08` }}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.02)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-8 relative group">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00b3aa]" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00b3aa]" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To deliver exceptional engineering and construction solutions that exceed client expectations,
                while maintaining the highest standards of quality, safety, and sustainability. We strive to
                build lasting relationships through integrity, innovation, and excellence in everything we do.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-8 relative group">
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#00b3aa]" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#00b3aa]" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To be the leading engineering and construction company recognized globally for our innovative
                solutions, sustainable practices, and unwavering commitment to excellence, shaping the future
                of infrastructure development.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-[#010a12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core <span style={{ color: colors.quinary }}>Values</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The principles that guide everything we do</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} icon={value.icon} title={value.title} description={value.description} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070" alt="Testimonial" fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: `${colors.primary}CC` }} />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <Icons.Quote className="w-12 h-12 text-white/30 mx-auto mb-6" />
            <p className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
              Kimia Omran exceeded our expectations in every way. Their professionalism, expertise, and commitment
              to quality resulted in a project delivered ahead of schedule and under budget.
            </p>
            <div className="w-12 h-0.5 mx-auto mb-4" style={{ background: colors.quinary }} />
            <p className="text-white font-semibold">Ahmed Al Mansouri</p>
            <p className="text-white/70 text-sm">CEO, Al Mansouri Group</p>
          </motion.div>
        </div>
      </section>
    </>
  );
}