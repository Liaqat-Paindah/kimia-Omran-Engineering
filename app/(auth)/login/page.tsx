'use client';

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, Variants, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const Icons = {
  Eye: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Mail: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Lock: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Check: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  ArrowRight: ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Building: ({ className = "w-12 h-12" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M8 8V4h8v4" />
      <path d="M12 12v4" />
    </svg>
  ),
};

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

// Input Component
const FormInput = ({ 
  label, 
  type, 
  id, 
  placeholder, 
  icon, 
  value, 
  onChange,
  error 
}: { 
  label: string; 
  type: string; 
  id: string; 
  placeholder: string; 
  icon?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label 
        htmlFor={id} 
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 text-sm bg-white dark:bg-[#011b2b] 
            border rounded-sm text-gray-900 dark:text-white 
            placeholder-gray-400 focus:outline-none transition-all duration-300
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-500' : 'border-gray-200 dark:border-[#064e78]'}
            ${isFocused ? 'border-[#00b3aa]' : ''}
          `}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00b3aa] transition-colors"
          >
            {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
          </button>
        )}
        <motion.div
          className="absolute -bottom-px left-0 h-0.5"
          style={{ background: colors.gradient }}
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// Success Modal
const SuccessModal = ({ show, onClose, email }: { show: boolean; onClose: () => void; email: string }) => {
  const router = useRouter();

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-[#011b2b] rounded-sm p-8 max-w-md w-full border"
          style={{ borderColor: `${colors.quinary}20` }}
        >
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: colors.quinary }} />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: colors.quinary }} />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: colors.quinary }} />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: colors.quinary }} />
          
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
              style={{ borderColor: colors.quinary, background: `${colors.quinary}20` }}
            >
              <Icons.Check className="w-8 h-8"  />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Successfully signed in as <span className="font-medium" style={{ color: colors.quinary }}>{email}</span>
            </p>
            <button
              onClick={() => {
                onClose();
                router.push('/dashboard');
              }}
              className="relative group w-full"
            >
              <div className="absolute -inset-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" style={{ background: colors.gradient }} />
              <div 
                className="relative px-4 py-2.5 text-white rounded-sm font-semibold text-sm"
                style={{ background: colors.gradient }}
              >
                Go to Dashboard
              </div>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + custom * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowSuccess(true);
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', formData.email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
    }
  }, []);

  return (
    <>
      <DigitalCursor />
      <SuccessModal show={showSuccess} onClose={() => setShowSuccess(false)} email={formData.email} />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden ">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.03)_1px,transparent_1px)] bg-size-[32px_32px]"
          />
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `${colors.primary}20` }}
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `${colors.quinary}20` }}
            animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-white dark:bg-[#011b2b] border rounded-sm p-8"
              style={{ borderColor: `${colors.quinary}20` }}
            >
              {/* Corner Decorations */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: colors.quinary }} />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: colors.quinary }} />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: colors.quinary }} />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: colors.quinary }} />

              <div className="text-center mb-6">
                <motion.div
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-sm mb-4"
                  style={{ background: `${colors.quinary}10`, border: `1px solid ${colors.quinary}30` }}
                >
                  <Icons.Building className="w-4 h-4"  />
                  <span className="text-xs font-mono" style={{ color: colors.quinary }}>ADMIN PORTAL</span>
                </motion.div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sign in to access your dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                  label="Email Address"
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  icon={<Icons.Mail />}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <FormInput
                  label="Password"
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  icon={<Icons.Lock />}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-sm accent-[#00b3aa]"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs transition-colors hover:text-[#00b3aa]"
                    style={{ color: colors.quinary }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group w-full"
                >
                  <div className="absolute -inset-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur" style={{ background: colors.gradient }} />
                  <div 
                    className="relative px-4 py-2.5 text-white rounded-sm font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: colors.gradient }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>VERIFYING...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <Icons.ArrowRight />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Demo credentials: admin@kimiaomran.ae / demo123
                </p>
              </div>
            </motion.div>

            {/* Footer Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-gray-500 dark:text-gray-500">
                © {new Date().getFullYear()} Kimia Omran Engineering & Construction. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}