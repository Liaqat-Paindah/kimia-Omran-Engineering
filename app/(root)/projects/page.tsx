"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import Image from "next/image";

import Loading from "@/app/loading";
import { UseGetProjects } from "@/hooks/useProject";
import {
  formatDashboardDate,
  type DashboardProject,
} from "@/lib/admin-dashboard";

const colors = {
  primary: "#033a6d",
  secondary: "#005c75",
  tertiary: "#007c8f",
  quaternary: "#009996",
  quinary: "#00b3aa",
  gradient:
    "linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)",
};

const Icons = {
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Location: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Building: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
      <path d="M9 21V11h6v10" />
      <path d="M18 21V3a2 2 0 0 1 2 2v16" />
      <path d="M7 8h2M7 12h2M13 8h2M13 12h2" />
    </svg>
  ),
  Close: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
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
    const moveCursor = (event: MouseEvent) => {
      cursorX.set(event.clientX - 16);
      cursorY.set(event.clientY - 16);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed z-50 hidden h-8 w-8 rounded-sm border-2 lg:block"
      style={{ x: cursorXSpring, y: cursorYSpring, borderColor: colors.quinary }}
    />
  );
};

function getProjectYear(project: DashboardProject) {
  const endDate = new Date(project.endDate);

  if (Number.isNaN(endDate.getTime())) {
    return "Ongoing";
  }

  return String(endDate.getFullYear());
}

const ProjectModal = ({
  project,
  onClose,
}: {
  project: DashboardProject | null;
  onClose: () => void;
}) => {
  if (!project) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 20 }}
          className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-sm bg-white dark:bg-[#011b2b]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          >
            <Icons.Close />
          </button>

          <div className="relative h-64 md:h-96">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          <div className="p-6">
            <span
              className="mb-3 inline-flex rounded-sm px-3 py-1 text-xs font-medium"
              style={{
                background: `${colors.quinary}20`,
                color: colors.quinary,
              }}
            >
              {project.constructionType}
            </span>
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {project.description}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-sm bg-gray-50 p-4 dark:bg-[#064e78]/30">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Location
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Icons.Location />
                  <span>{project.location}</span>
                </div>
              </div>
              <div className="rounded-sm bg-gray-50 p-4 dark:bg-[#064e78]/30">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Construction Type
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Icons.Building />
                  <span>{project.constructionType}</span>
                </div>
              </div>
              <div className="rounded-sm bg-gray-50 p-4 dark:bg-[#064e78]/30">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Start Date
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Icons.Calendar />
                  <span>{formatDashboardDate(project.startDate)}</span>
                </div>
              </div>
              <div className="rounded-sm bg-gray-50 p-4 dark:bg-[#064e78]/30">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  End Date
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <Icons.Calendar />
                  <span>{formatDashboardDate(project.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProjectCard = ({
  project,
  index,
  onClick,
}: {
  project: DashboardProject;
  index: number;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="relative cursor-pointer group"
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative h-80 overflow-hidden rounded-sm">
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

        <AnimatePresence>
          {isHovered ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: `${colors.primary}CC` }}
            >
              <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }}>
                <Icons.ArrowRight className="mx-auto mb-2 h-8 w-8 text-white" />
                <span className="text-sm font-medium text-white">
                  View Details
                </span>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="absolute right-4 bottom-4 left-4">
          <span className="mb-1 block text-xs font-mono text-[#00b3aa]">
            {project.constructionType}
          </span>
          <h3 className="mb-2 text-xl font-bold text-white">{project.name}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/75">
            <span className="flex items-center gap-1">
              <Icons.Location className="h-3 w-3" />
              {project.location}
            </span>
            <span className="flex items-center gap-1">
              <Icons.Calendar className="h-3 w-3" />
              {getProjectYear(project)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function KimiaOmranProjects() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] =
    useState<DashboardProject | null>(null);
  const { data: projects = [], isPending, error } = UseGetProjects();

  const categories = [
    "All",
    ...Array.from(
      new Set(
        projects
          .map((project) => project.constructionType)
          .filter(Boolean),
      ),
    ),
  ];

  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : "All";

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.constructionType === activeCategory,
        );

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

  if (isPending) {
    return <Loading />;
  }

  if (error) {
    return (
      <section className="bg-white py-20 dark:bg-[#010a12]">
        <div className="container mx-auto px-4 text-center text-red-500 sm:px-6 lg:px-8">
          Failed to load projects. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <>
      <DigitalCursor />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070"
            alt="Projects Hero"
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}CC, ${colors.secondary}CC)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.1)_1px,transparent_1px)] bg-size-[40px_40px]" />
        </div>
        <div className="relative container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="mx-auto max-w-3xl">
            <motion.div
              custom={0}
              variants={textVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-sm px-3 py-1"
              style={{
                background: `${colors.quinary}20`,
                border: `1px solid ${colors.quinary}`,
              }}
            >
              <span className="text-xs font-mono" style={{ color: colors.quinary }}>
                OUR PORTFOLIO
              </span>
            </motion.div>
            <motion.h1
              custom={1}
              variants={textVariants}
              className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            >
              Featured <span style={{ color: colors.quinary }}>Projects</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={textVariants}
              className="mx-auto max-w-2xl text-lg text-white/80"
            >
              Explore our current project portfolio across multiple construction
              sectors and locations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-[#010a12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-wrap justify-center gap-2"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                type="button"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-sm px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "text-white"
                    : "text-gray-600 hover:text-[#00b3aa] dark:text-gray-400"
                }`}
                style={activeCategory === category ? { background: colors.gradient } : {}}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id || project.slug || project.name}
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400">
                No projects found in this category.
              </p>
            </motion.div>
          ) : null}
        </div>
      </section>
    </>
  );
}
