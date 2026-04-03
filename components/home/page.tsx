'use client';

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

// Color palette
const colors = {
  primary: '#033a6d',
  secondary: '#005c75',
  tertiary: '#007c8f',
  quaternary: '#009996',
  quinary: '#00b3aa',
  gradient: 'linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)',
  accent: '#00b3aa',
};

// Icons
const Icons = {
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Construction: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 12v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4M12 2v12M8 6l4-4 4 4" />
    </svg>
  ),
  Engineering: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Sustainability: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M17.7 17.7l.7.7" />
    </svg>
  ),
  Quality: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      <path d="M12 12v6" />
    </svg>
  ),
  Play: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
};

// Digital Cursor
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

// Feature Card
const FeatureCard = ({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) => {
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

// Project Card
const ProjectCard = ({ title, category, image, index }: { title: string; category: string; image: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden rounded-sm">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `${colors.primary}CC` }}
            >
              <motion.div className="text-center">
                <Icons.ArrowRight className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white text-sm font-medium">View Project</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-xs text-[#00b3aa] font-mono mb-1 block">{category}</span>
          <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

// Main Landing Page
export default function KimiaOmranLanding() {
  const features = [
    { icon: <Icons.Construction />, title: "General Contracting", description: "Full-service construction management with quality." },
    { icon: <Icons.Engineering />, title: "Structural Engineering", description: "Advanced seismic-resistant solutions using cutting-edge BIM technology." },
    { icon: <Icons.Sustainability />, title: "Sustainable Solutions", description: "Eco-friendly construction methods for responsible projects." },
    { icon: <Icons.Quality />, title: "Quality Control", description: "Rigorous testing and inspection to ensure highest standards." },
  ];

  const projects = [
    { title: "Central Business Tower", category: "Commercial", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" },
    { title: "Coastal Highway Bridge", category: "Infrastructure", image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2070" },
    { title: "Green Residential Complex", category: "Residential", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070" },
  ];

  return (
    <>
      <DigitalCursor />

      {/* Features Section */}
      <section className="relative py-20 bg-white dark:bg-[#010a12] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.02)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose <span style={{ color: colors.quinary }}>Kimia Omran</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Delivering excellence through innovation, expertise, and unwavering commitment to quality</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16" style={{ background: colors.gradient }}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "380+", label: "Projects Completed" },
              { value: "1,200+", label: "Expert Engineers" },
              { value: "45", label: "Active Sites" },
              { value: "32", label: "Industry Awards" },
            ].map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section id="projects" className="relative py-20 bg-white dark:bg-[#010a12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured <span style={{ color: colors.quinary }}>Projects</span></h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Showcasing our finest work across various sectors</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={index} title={project.title} category={project.category} image={project.image} index={index} />
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-10">
            <motion.a whileHover={{ scale: 1.05 }} href="/projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold" style={{ background: colors.gradient, color: 'white' }}>
              View All Projects <Icons.ArrowRight />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070" alt="CTA Background" fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: `${colors.primary}CC` }} />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Build Your Future?</h2>
            <p className="text-white/80 mb-8">Let`s discuss how Kimia Omran can bring your vision to life with our engineering expertise.</p>
            <motion.a whileHover={{ scale: 1.05 }} href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-sm font-semibold text-lg" style={{ background: 'white', color: colors.primary }}>
              Get a Free Consultation <Icons.ArrowRight />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
