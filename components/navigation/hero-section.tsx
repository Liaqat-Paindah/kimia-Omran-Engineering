'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useSpring, Variants } from 'framer-motion';

// Types
interface Slide {
  id: string;
  imgSrc: string;
  imgAlt: string;
  title: string;
  description: string;
  ctaUrl: string;
  ctaText: string;
  tag?: string;
  metrics?: {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];
  features?: string[];
  color: string;
}

interface CarouselProps {
  slides?: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  infinite?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

// Custom engineering-focused icons
const Icons = {
  Helmet: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3a8 8 0 0 0-8 8v4a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-4a8 8 0 0 0-8-8z" />
      <path d="M12 7v4" />
      <path d="M8 11h8" />
    </svg>
  ),
  Building: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M8 8V4h8v4" />
      <path d="M12 12v4" />
    </svg>
  ),
  Ruler: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16H3V8h18v8z" />
      <path d="M7 12h10" />
      <path d="M9 8v8" />
      <path d="M15 8v8" />
    </svg>
  ),
  Crane: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 20h12" />
      <path d="M12 4v16" />
      <path d="M4 8l8-4 8 4" />
      <path d="M4 12l8-4 8 4" />
    </svg>
  ),
  HardHat: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 15L12 4l10 11" />
      <path d="M5 15v5h14v-5" />
      <path d="M12 4v6" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Blueprint: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h6" />
      <path d="M8 16h4" />
      <path d="M16 8v8" />
    </svg>
  ),
};

// Engineering Company Slides with advanced imagery
const engineeringSlides: Slide[] = [
  {
    id: 'kimia-1',
    imgSrc: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop',
    imgAlt: 'Modern skyscraper construction site with tower cranes against sunset',
    title: 'Building Tomorrow\'s Landmarks',
    description: 'Kimia Omran delivers world-class engineering solutions with precision, innovation, and unmatched quality in every project.',
    ctaUrl: '#',
    ctaText: 'Explore Projects',
    tag: 'Since 1998',
    color: '#E67E22',
    metrics: [
      { icon: <Icons.Building />, label: 'Completed', value: '380+' },
      { icon: <Icons.Helmet />, label: 'Experts', value: '1,200+' },
      { icon: <Icons.Crane />, label: 'Active Sites', value: '45' },
    ],
    features: ['ISO 9001', 'LEED Certified', '24/7 Site Management'],
  },
  {
    id: 'kimia-2',
    imgSrc: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop',
    imgAlt: 'Architectural blueprint with modern office building in background',
    title: 'Engineering Excellence',
    description: 'From conceptual design to final delivery, our engineering team combines technical mastery with creative vision.',
    ctaUrl: '#',
    ctaText: 'Our Services',
    color: '#2980B9',
    metrics: [
      { icon: <Icons.Ruler />, label: 'Square Meters', value: '2.5M+' },
      { icon: <Icons.Building />, label: 'Projects', value: '450+' },
      { icon: <Icons.Helmet />, label: 'Awards', value: '32' },
    ],
    features: ['BIM Technology', 'Sustainable Design', 'Structural Analysis'],
  },
  {
    id: 'kimia-3',
    imgSrc: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
    imgAlt: 'Aerial view of massive infrastructure project with highways and bridges',
    title: 'Infrastructure for the Future',
    description: 'Leading the way in sustainable infrastructure development that connects communities and drives economic growth.',
    ctaUrl: '#',
    ctaText: 'View Portfolio',
    color: '#27AE60',
    metrics: [
      { icon: <Icons.Crane />, label: 'Bridges', value: '85' },
      { icon: <Icons.Ruler />, label: 'Highway KM', value: '620' },
      { icon: <Icons.Building />, label: 'Tunnels', value: '12' },
    ],
    features: ['Smart Cities', 'Green Infrastructure', 'Seismic Design'],
  },
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
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-8 w-8 rounded-sm border-2 border-[#E67E22] dark:mix-blend-difference hidden lg:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
};

// Navigation Button
const NavButton = ({ 
  direction, 
  onClick 
}: { 
  direction: 'previous' | 'next'; 
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      type="button"
      className={`
        absolute ${direction === 'previous' ? 'left-4' : 'right-4'} 
        top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center
        rounded-sm bg-black/30 backdrop-blur-md border border-white/30
        text-white shadow-lg transition-all hover:bg-black/50 hover:border-[#E67E22]/70
        focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:ring-offset-2
        md:h-10 md:w-10
      `}
      aria-label={`${direction} slide`}
      onClick={onClick}
    >
      <motion.div
        animate={{ x: isHovered ? (direction === 'previous' ? -2 : 2) : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="h-4 w-4 md:h-5 md:w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={direction === 'previous' 
              ? 'M15.75 19.5L8.25 12l7.5-7.5' 
              : 'M8.25 4.5l7.5 7.5-7.5 7.5'
            }
          />
        </svg>
      </motion.div>
    </motion.button>
  );
};

// Indicator
const Indicator = ({ 
  total, 
  current, 
  onSelect 
}: { 
  total: number; 
  current: number; 
  onSelect: (index: number) => void;
}) => (
  <div 
    className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2"
    role="group"
    aria-label="Slide navigation"
  >
    {Array.from({ length: total }).map((_, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="group relative"
        onClick={() => onSelect(index)}
      >
        <div className={`
          h-1.5 rounded-sm transition-all duration-300
          ${current === index 
            ? 'w-8 bg-[#E67E22]' 
            : 'w-1.5 bg-white/50 group-hover:bg-white/80'
          }
        `} />
        {current === index && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#E67E22]"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    ))}
  </div>
);

// Feature Chip
const FeatureChip = ({ text, index }: { text: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex items-center gap-1.5 rounded-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/20"
    >
      <motion.div
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5 }}
        className="text-[#E67E22]"
      >
        <Icons.CheckCircle />
      </motion.div>
      <span className="text-xs text-white/90">{text}</span>
    </motion.div>
  );
};

// Metric Card
const MetricCard = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex items-center gap-2 rounded-sm bg-black/40 backdrop-blur-sm px-3 py-1.5 border border-white/20"
    >
      <motion.div
        animate={{ 
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="text-[#E67E22]"
      >
        {icon}
      </motion.div>
      <div className="flex items-baseline gap-1">
        <span className="text-xs font-bold text-white">{value}</span>
        <span className="text-[10px] text-white/70">{label}</span>
      </div>
    </motion.div>
  );
};

// Main Carousel Component
export default function KimiaOmranCarousel({ 
  slides = engineeringSlides,
  autoPlay = true,
  autoPlayInterval = 6000,
  infinite = true,
  showControls = true,
  showIndicators = true,
  className = '',
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (currentIndex === slides.length - 1) {
      if (infinite) goToSlide(0);
    } else {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, slides.length, infinite, goToSlide]);

  const previousSlide = useCallback(() => {
    if (currentIndex === 0) {
      if (infinite) goToSlide(slides.length - 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, slides.length, infinite, goToSlide]);

  // Auto-play with pause on hover
  useEffect(() => {
    if (isAutoPlaying) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isAutoPlaying, autoPlayInterval, nextSlide]);

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2 + custom * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <>
      <DigitalCursor />
      <div 
        className={`relative w-full overflow-hidden bg-black ${className}`}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(autoPlay)}
        aria-roledescription="carousel"
        aria-label="Kimia Omran Engineering Projects"
      >
        <div className="relative h-115 w-full md:h-125 lg:h-135">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slides[currentIndex].imgSrc}
                  alt={slides[currentIndex].imgAlt}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  quality={90}
                />
                
                {/* Dark industrial overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-black/70" />
                
                {/* Subtle engineering grid pattern */}
                <div className="absolute inset-0 bg-[linear-linear(rgba(230,126,34,0.05)_1px,transparent_1px),linear-linear(90deg,rgba(230,126,34,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
                
                {/* Accent lighting effect */}
                <div className="absolute inset-0 bg-linear-to-t from-[#E67E22]/20 via-transparent to-transparent" />
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div 
                    custom={0}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl text-left mx-auto"
                  >
                    {/* Company Tag */}
                    <motion.div
                      custom={1}
                      variants={textVariants}
                      className="flex items-center gap-2 mb-4"
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-[#E67E22]"
                      >
                        <Icons.HardHat />
                      </motion.div>
                      <span className="text-xs font-mono text-[#E67E22] tracking-wider uppercase">
                        {slides[currentIndex].tag || 'Kimia Omran Group'}
                      </span>
                    </motion.div>
                    
                    {/* Title */}
                    <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl font-display leading-tight">
                      {slides[currentIndex].title}
                    </h2>
                    
                    {/* Description */}
                    <p className="mb-4 text-sm text-white/90 sm:text-base max-w-xl font-light leading-relaxed">
                      {slides[currentIndex].description}
                    </p>
                    
                    {/* Metrics Row */}
                    <motion.div
                      custom={2}
                      variants={textVariants}
                      className="flex flex-wrap gap-2 mb-4"
                    >
                      {slides[currentIndex].metrics?.map((metric, idx) => (
                        <MetricCard key={idx} {...metric} />
                      ))}
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      custom={3}
                      variants={textVariants}
                      className="flex flex-wrap gap-2 mb-5"
                    >
                      {slides[currentIndex].features?.map((feature, idx) => (
                        <FeatureChip key={idx} text={feature} index={idx} />
                      ))}
                    </motion.div>
                    
                    {/* CTA Button */}
                    <motion.a
                      custom={4}
                      variants={textVariants}
                      href={slides[currentIndex].ctaUrl}
                      className="
                        inline-flex items-center justify-center gap-2
                        rounded-sm bg-[#E67E22] px-6 py-3 text-sm font-semibold text-white
                        shadow-lg transition-all hover:bg-[#D35400] hover:shadow-xl
                        focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:ring-offset-2
                      "
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{slides[currentIndex].ctaText}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Icons.Blueprint />
                      </motion.div>
                    </motion.a>

                    {/* Industrial Pulse Effect */}
                    <motion.div
                      className="absolute -bottom-10 left-0 w-40 h-40 bg-[#E67E22]/20 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Industrial Edge Accents */}
              <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#E67E22] to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#E67E22] to-transparent" />
              <div className="absolute top-0 left-0 w-px h-full bg-linear-to-b from-transparent via-[#E67E22] to-transparent" />
              <div className="absolute top-0 right-0 w-px h-full bg-linear-to-b from-transparent via-[#E67E22] to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        {showControls && (
          <>
            <NavButton direction="previous" onClick={previousSlide} />
            <NavButton direction="next" onClick={nextSlide} />
          </>
        )}

        {/* Indicators */}
        {showIndicators && (
          <Indicator 
            total={slides.length}
            current={currentIndex}
            onSelect={goToSlide}
          />
        )}

        {/* Progress Bar */}
        {autoPlay && (
          <motion.div
            key={currentIndex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              duration: autoPlayInterval / 1000,
              ease: "linear",
            }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#E67E22] via-[#F39C12] to-[#E67E22] origin-left"
            style={{ transformOrigin: '0% 50%' }}
          />
        )}
      </div>
    </>
  );
}

// Export types
export type { Slide, CarouselProps };