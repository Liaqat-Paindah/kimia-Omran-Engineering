'use client';

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  Variants,
  AnimatePresence,
} from "framer-motion";

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

// Icons for services
const Icons = {
  Construction: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 12v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4M12 2v12M8 6l4-4 4 4" />
      <path d="M4 12h16" />
    </svg>
  ),
  Engineering: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Architecture: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M8 8V4h8v4M12 12v4" />
      <path d="M6 20h12" />
    </svg>
  ),
  Infrastructure: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-8h6v8" />
    </svg>
  ),
  ProjectManagement: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 12h-4l-3 9-4-18-3 9H2" />
    </svg>
  ),
  Sustainability: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3v1M12 20v1M3 12h1M20 12h1M5.6 5.6l.7.7M17.7 17.7l.7.7" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 8c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z" />
    </svg>
  ),
  QualityControl: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      <path d="M12 12v6" />
    </svg>
  ),
  Consultation: ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </svg>
  ),
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
  Star: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// Digital Cursor Component
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

// Service Card Component
const ServiceCard = ({
  icon,
  title,
  description,
  features,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      {/* Digital Border Effect */}
      <div className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur"
        style={{ background: colors.gradient }}
      />

      {/* Card */}
      <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 h-full shadow-sm dark:shadow-sm transition-all duration-300">
        {/* Icon Container */}
        <div className="relative mb-4">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 rounded-sm flex items-center justify-center border-2"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.quinary}20)`,
              borderColor: colors.quinary,
            }}
          >
            <div className="text-[#00b3aa]">{icon}</div>
          </motion.div>

          {/* Digital Pulse */}
          <motion.div
            className="absolute inset-0 rounded-sm"
            style={{ background: `${colors.quinary}20` }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-light leading-relaxed">
          {description}
        </p>

        {/* Features List - Shown on hover or click for mobile */}
        <AnimatePresence>
          {(isExpanded || isHovered) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 space-y-1.5"
            >
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                >
                  <Icons.Check className="w-3 h-3 text-[#00b3aa]" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Learn More Link */}
        <motion.button
          className="mt-4 flex items-center gap-1 text-xs font-medium transition-colors group/link"
          style={{ color: colors.quinary }}
          whileHover={{ x: 5 }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? "Show Less" : "Learn More"}</span>
          <Icons.ArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Stat Card Component
const StatCard = ({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) => {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(targetValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetValue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center"
    >
      <div className="relative inline-block">
        <motion.div
          className="text-3xl md:text-4xl font-bold mb-1"
          style={{ color: colors.quinary }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {value.includes("+") ? `${count}+` : count}
        </motion.div>
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5"
          style={{ background: colors.gradient }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 font-light mt-2">
        {label}
      </p>
    </motion.div>
  );
};

// Process Step Component
const ProcessStep = ({
  number,
  title,
  description,
  index,
}: {
  number: number;
  title: string;
  description: string;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative flex gap-4"
    >
      {/* Step Number */}
      <div className="relative shrink-0">
        <motion.div
          className="w-10 h-10 rounded-sm flex items-center justify-center font-bold text-lg"
          style={{
            background: colors.gradient,
            color: 'white',
          }}
          whileHover={{ scale: 1.1 }}
        >
          {number}
        </motion.div>
        {index < 2 && (
          <div
            className="absolute top-10 left-1/2 w-px h-12 md:h-16"
            style={{ background: colors.gradient }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8 md:pb-12">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 font-light">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Main Services Component
export default function KimiaOmranServices() {
  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 + custom * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const services = [
    {
      icon: <Icons.Construction className="w-7 h-7" />,
      title: "General Contracting",
      description: "Full-service construction management from concept to completion with uncompromising quality standards.",
      features: ["Site Preparation & Excavation", "Structural Construction", "MEP Installation", "Finishing & Fit-out"],
    },
    {
      icon: <Icons.Engineering className="w-7 h-7" />,
      title: "Structural Engineering",
      description: "Advanced structural analysis and design using cutting-edge BIM technology and seismic-resistant solutions.",
      features: ["Seismic Design", "Load Analysis", "Foundation Engineering", "Steel & Concrete Structures"],
    },
    {
      icon: <Icons.Architecture className="w-7 h-7" />,
      title: "Architectural Design",
      description: "Innovative and sustainable architectural solutions that blend aesthetics with functionality.",
      features: ["Conceptual Design", "3D Visualization", "Sustainable Architecture", "Interior Design"],
    },
    {
      icon: <Icons.Infrastructure className="w-7 h-7" />,
      title: "Infrastructure Development",
      description: "Large-scale infrastructure projects that connect communities and drive economic growth.",
      features: ["Roads & Highways", "Bridges & Tunnels", "Water Systems", "Urban Development"],
    },
    {
      icon: <Icons.ProjectManagement className="w-7 h-7" />,
      title: "Project Management",
      description: "Comprehensive project oversight ensuring timely delivery within budget and specifications.",
      features: ["Budget Control", "Schedule Management", "Quality Assurance", "Risk Assessment"],
    },
    {
      icon: <Icons.Sustainability className="w-7 h-7" />,
      title: "Sustainable Solutions",
      description: "Eco-friendly construction methods and materials for environmentally responsible projects.",
      features: ["Green Building", "Energy Efficiency", "Waste Management", "LEED Certification"],
    },
    {
      icon: <Icons.QualityControl className="w-7 h-7" />,
      title: "Quality Control",
      description: "Rigorous testing and inspection protocols to ensure the highest construction standards.",
      features: ["Material Testing", "Site Inspections", "Compliance Audits", "ISO Standards"],
    },
    {
      icon: <Icons.Consultation className="w-7 h-7" />,
      title: "Engineering Consultation",
      description: "Expert technical consultation for complex engineering challenges and project optimization.",
      features: ["Feasibility Studies", "Technical Advisory", "Value Engineering", "Regulatory Compliance"],
    },
  ];

  const stats = [
    { value: "380+", label: "Projects Completed" },
    { value: "1,200+", label: "Expert Engineers" },
    { value: "45", label: "Active Sites" },
    { value: "32", label: "Industry Awards" },
  ];

  const processSteps = [
    {
      number: 1,
      title: "Initial Consultation",
      description: "Understanding your vision, requirements, and project goals through in-depth discussions.",
    },
    {
      number: 2,
      title: "Feasibility & Planning",
      description: "Comprehensive site analysis, budget planning, and project timeline development.",
    },
    {
      number: 3,
      title: "Design & Engineering",
      description: "Detailed architectural and structural design with advanced BIM technology.",
    },
    {
      number: 4,
      title: "Construction & Delivery",
      description: "Precision execution with continuous quality control and timely project completion.",
    },
  ];

  return (
    <>
      <DigitalCursor />

      <section className="relative w-full overflow-hidden bg-white dark:bg-[#010a12]">
        {/* Digital Grid Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.03)_1px,transparent_1px)] bg-size-[32px_32px]"
          />

          {/* Gradient Orbs with your colors */}
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `${colors.primary}20` }}
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `${colors.quinary}20` }}
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Header Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              custom={0}
              variants={textVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-sm mb-4"
              style={{ background: `${colors.quinary}10`, border: `1px solid ${colors.quinary}30` }}
            >
              <Icons.Star className="w-3 h-3"  />
              <span className="text-xs font-mono" style={{ color: colors.quinary }}>OUR EXPERTISE</span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={textVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Comprehensive{" "}
                Engineering
              Services
            </motion.h1>

            <motion.p
              custom={2}
              variants={textVariants}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light"
            >
              Delivering excellence across the entire construction spectrum with innovative solutions,
              cutting-edge technology, and unwavering commitment to quality.
            </motion.p>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-20">
            {stats.map((stat, index) => (
              <StatCard key={index} value={stat.value} label={stat.label} index={index} />
            ))}
          </div>

          {/* Services Grid */}
          <div className="mb-16 md:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  index={index}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                />
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Our Workflow
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                A systematic approach ensuring project success from concept to completion
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {processSteps.map((step, index) => (
                <ProcessStep
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-sm p-8 md:p-12 text-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}DD, ${colors.secondary}DD)`,
            }}
          >
            {/* Digital Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[32px_32px]" />

            <div className="relative z-10">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-bold text-white mb-3"
              >
                Ready to Start Your Project?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 text-sm md:text-base mb-6 max-w-2xl mx-auto"
              >
                Let`s discuss how Kimia Omran can bring your vision to life with our engineering expertise.
              </motion.p>
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-sm font-semibold text-sm transition-all"
                style={{
                  background: 'white',
                  color: colors.primary,
                }}
              >
                Get a Free Consultation
                <Icons.ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>

            {/* Digital Pulse Effect */}
            <motion.div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl"
              style={{ background: `${colors.quinary}40` }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}