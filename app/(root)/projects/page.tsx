'use client';

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, Variants, AnimatePresence } from "framer-motion";
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
  Location: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Users: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Ruler: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16H3V8h18v8z" />
      <path d="M7 12h10" />
    </svg>
  ),
  Close: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  client: string;
  description: string;
  image: string;
  gallery: string[];
  features: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Central Business Tower",
    category: "Commercial",
    location: "Dubai, UAE",
    year: "2023",
    area: "85,000 sqm",
    client: "Dubai Properties",
    description: "A 45-story commercial tower featuring state-of-the-art office spaces, retail areas, and sustainable design elements. The project achieved LEED Gold certification.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070",
    ],
    features: ["LEED Gold Certified", "Smart Building Systems", "Green Roof", "Energy Efficient HVAC"],
  },
  {
    id: 2,
    title: "Coastal Highway Bridge",
    category: "Infrastructure",
    location: "Abu Dhabi, UAE",
    year: "2022",
    area: "3.2 km",
    client: "Abu Dhabi Municipality",
    description: "A landmark bridge project connecting key coastal areas with innovative design and seismic-resistant engineering.",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2070",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070",
    ],
    features: ["Seismic Resistant", "6-Lane Capacity", "Pedestrian Walkways", "Smart Lighting"],
  },
  {
    id: 3,
    title: "Green Residential Complex",
    category: "Residential",
    location: "Sharjah, UAE",
    year: "2023",
    area: "45,000 sqm",
    client: "Green Living Developers",
    description: "A sustainable residential community with 250 units, featuring solar panels, rainwater harvesting, and extensive green spaces.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070",
    ],
    features: ["Solar Panels", "Rainwater Harvesting", "Electric Vehicle Charging", "Community Gardens"],
  },
  {
    id: 4,
    title: "Industrial Logistics Park",
    category: "Industrial",
    location: "Jebel Ali, UAE",
    year: "2022",
    area: "120,000 sqm",
    client: "Logistics Hub LLC",
    description: "A state-of-the-art logistics facility with automated storage systems and sustainable operations.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
    ],
    features: ["Automated Systems", "Solar Power", "Rail Connectivity", "LEED Silver"],
  },
  {
    id: 5,
    title: "Cultural Center",
    category: "Cultural",
    location: "Abu Dhabi, UAE",
    year: "2024",
    area: "28,000 sqm",
    client: "Department of Culture",
    description: "A modern cultural hub featuring exhibition spaces, theater, and community facilities.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070",
    ],
    features: ["Acoustic Design", "Interactive Exhibits", "Rooftop Garden", "Accessible Design"],
  },
  {
    id: 6,
    title: "Healthcare Campus",
    category: "Healthcare",
    location: "Dubai, UAE",
    year: "2023",
    area: "65,000 sqm",
    client: "Dubai Health Authority",
    description: "A comprehensive healthcare facility with 300 beds, specialized clinics, and research centers.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2070",
    gallery: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=2070",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
    ],
    features: ["State-of-the-art Equipment", "Patient-Centered Design", "Helipad", "Research Facilities"],
  },
];

const categories = ["All", "Commercial", "Infrastructure", "Residential", "Industrial", "Cultural", "Healthcare"];

const ProjectModal = ({ project, onClose }: { project: Project | null; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-[#011b2b] rounded-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
            <Icons.Close />
          </button>

          {/* Gallery */}
          <div className="relative h-64 md:h-96">
            <Image src={project.gallery[currentImage] || project.image} alt={project.title} fill className="object-cover" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {project.gallery.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${currentImage === idx ? 'w-6 bg-[#00b3aa]' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2 py-1 rounded-sm" style={{ background: `${colors.quinary}20`, color: colors.quinary }}>{project.category}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Location</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><Icons.Location /> {project.location}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Year</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><Icons.Calendar /> {project.year}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Area</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><Icons.Ruler /> {project.area}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Client</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1"><Icons.Users /> {project.client}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded-sm bg-gray-100 dark:bg-[#064e78] text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Icons.Check className="w-3 h-3 text-[#00b3aa]" /> {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProjectCard = ({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative group cursor-pointer"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-80 overflow-hidden rounded-sm">
        <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `${colors.primary}CC` }}
            >
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
                <Icons.ArrowRight className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white text-sm font-medium">View Details</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-xs text-[#00b3aa] font-mono mb-1 block">{project.category}</span>
          <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
          <div className="flex items-center gap-2 text-white/70 text-xs">
            <Icons.Location className="w-3 h-3" />
            <span>{project.location}</span>
            <Icons.Calendar className="w-3 h-3 ml-2" />
            <span>{project.year}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function KimiaOmranProjects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === "All" ? projects : projects.filter(p => p.category === selectedCategory);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + custom * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <>
      <DigitalCursor />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
            alt="Projects Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colors.primary}CC, ${colors.secondary}CC)` }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.1)_1px,transparent_1px)] bg-size-[40px_40px]" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto">
            <motion.div custom={0} variants={textVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-sm mb-6" style={{ background: `${colors.quinary}20`, border: `1px solid ${colors.quinary}` }}>
              <span className="text-xs font-mono" style={{ color: colors.quinary }}>OUR PORTFOLIO</span>
            </motion.div>
            <motion.h1 custom={1} variants={textVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Featured <span style={{ color: colors.quinary }}>Projects</span>
            </motion.h1>
            <motion.p custom={2} variants={textVariants} className="text-lg text-white/80 max-w-2xl mx-auto">
              Showcasing our finest work across various sectors, demonstrating our commitment to excellence and innovation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white dark:bg-[#010a12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${selectedCategory === category
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-[#00b3aa]'
                }`}
                style={selectedCategory === category ? { background: colors.gradient } : {}}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} onClick={() => setSelectedProject(project)} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}