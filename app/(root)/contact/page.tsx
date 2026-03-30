"use client";

import { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  Variants,
  AnimatePresence,
} from "framer-motion";

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

const Icons = {
  Mail: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Location: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Send: ({ className = "w-4 h-4" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Linkedin: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  ),
  Facebook: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  Instagram: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
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
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        borderColor: colors.quinary,
      }}
    />
  );
};

const ContactInfoCard = ({
  icon,
  title,
  content,
  link,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  link?: string;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <div
        className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur"
        style={{ background: colors.gradient }}
      />
      <div className="relative bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-5 h-full">
        <div className="relative mb-3">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-sm flex items-center justify-center border-2"
            style={{
              borderColor: colors.quinary,
              background: `${colors.quinary}10`,
            }}
          >
            <div className="text-[#00b3aa]">{icon}</div>
          </motion.div>
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
          {content}
        </p>
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cardContent}
      </a>
    );
  }
  return cardContent;
};

const FormInput = ({
  label,
  type,
  id,
  placeholder,
  required,
  textarea,
  value,
  onChange,
}: {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  required?: boolean;
  textarea?: boolean;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-[#00b3aa] ml-1">*</span>}
      </label>
      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            rows={4}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-2 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00b3aa] transition-colors resize-none font-light"
          />
        ) : (
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-2 text-sm bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00b3aa] transition-colors font-light"
          />
        )}
        <motion.div
          className="absolute -bottom-px left-0 h-0.5"
          style={{ background: colors.gradient }}
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const SuccessModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-[#011b2b] rounded-sm p-8 max-w-md w-full border border-gray-200 dark:border-[#064e78]"
        >
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#00b3aa]" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#00b3aa]" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00b3aa]" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00b3aa]" />
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#00b3aa]"
              style={{ background: `${colors.quinary}20` }}
            >
              <Icons.Check className="w-8 h-8 text-[#00b3aa]" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Message Sent!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Thank you for reaching out. Our team will respond within 24 hours.
            </p>
            <button onClick={onClose} className="relative group w-full">
              <div
                className="absolute -inset-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"
                style={{ background: colors.gradient }}
              />
              <div
                className="relative px-4 py-2 text-white rounded-sm font-semibold text-sm"
                style={{ background: colors.gradient }}
              >
                Close
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function KimiaOmranContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <>
      <DigitalCursor />
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ background: colors.gradient }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[40px_40px]" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            <motion.div
              custom={0}
              variants={textVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-sm mb-6"
              style={{
                background: `${colors.quinary}20`,
                border: `1px solid ${colors.quinary}`,
              }}
            >
              <span
                className="text-xs font-mono"
                style={{ color: colors.quinary }}
              >
                GET IN TOUCH
              </span>
            </motion.div>
            <motion.h1
              custom={1}
              variants={textVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Let`s Start Your{" "}
              <span style={{ color: colors.quinary }}>Project</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={textVariants}
              className="text-lg text-white/80 max-w-2xl mx-auto"
            >
              Ready to bring your vision to life? Contact us today for a
              consultation and discover how Kimia Omran can make your project a
              reality.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-[#010a12]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <ContactInfoCard
              index={0}
              icon={<Icons.Mail />}
              title="EMAIL"
              content="Abbasrahimi521@gmail.com"
              link="mailto:Abbasrahimi521@gmail.com"
            />
            <ContactInfoCard
              index={1}
              icon={<Icons.Phone />}
              title="PHONE"
              content="+93 (0) 776-437-752"
              link="tel:+93776437752"
            />
            <ContactInfoCard
              index={2}
              icon={<Icons.Location />}
              title="LOCATION"
              content="Karte 4, opposite Soltani Building, Kabul, Afg"
            />
            <ContactInfoCard
              index={3}
              icon={<Icons.Clock />}
              title="HOURS"
              content="Saturday - Thursday 8:00 AM - 4:00 PM"
            />
          </div>

          {/* Form & Map */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <FormInput
                    label="FULL NAME"
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="EMAIL ADDRESS"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="SUBJECT"
                    type="text"
                    id="subject"
                    placeholder="What is this regarding?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  <FormInput
                    label="MESSAGE"
                    type="text"
                    id="message"
                    placeholder="Tell us about your project..."
                    required
                    textarea
                    value={formData.message}
                    onChange={handleChange}
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group w-full"
                  >
                    <div
                      className="absolute -inset-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"
                      style={{ background: colors.gradient }}
                    />
                    <div
                      className="relative px-4 py-3 text-white rounded-sm font-semibold text-sm flex items-center justify-center gap-2"
                      style={{ background: colors.gradient }}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          <span>PROCESSING...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Icons.Send />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Map & Social */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-4 h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14428.456789012345!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0x2b5b3c4d5e6f7a8b!2sDubai%2C%20UAE!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  className="w-full h-full rounded-sm"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="bg-white dark:bg-[#011b2b] border border-gray-200 dark:border-[#064e78] rounded-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Connect With Us
                </h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Icons.Linkedin />, url: "https://linkedin.com" },
                    { icon: <Icons.Twitter />, url: "https://twitter.com" },
                    { icon: <Icons.Facebook />, url: "https://facebook.com" },
                    { icon: <Icons.Instagram />, url: "https://instagram.com" },
                  ].map((social, idx) => (
                    <motion.a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="w-10 h-10 rounded-sm flex items-center justify-center transition-all"
                      style={{
                        background: `${colors.quinary}10`,
                        color: colors.quinary,
                      }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
