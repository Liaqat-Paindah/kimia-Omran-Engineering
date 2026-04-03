"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const colors = {
  primary: "#033a6d",
  quinary: "#00b3aa",
  gradient:
    "linear-gradient(135deg, #033a6d 0%, #005c75 25%, #007c8f 50%, #009996 75%, #00b3aa 100%)",
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  AccessDenied: "You do not have permission to sign in.",
  Configuration:
    "Authentication is not configured correctly. Please check the server setup.",
  Default: "Unable to sign in right now. Please try again.",
};

const Icons = {
  Eye: ({ className = "h-5 w-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: ({ className = "h-5 w-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Mail: ({ className = "h-5 w-5" }) => (
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
  Lock: ({ className = "h-5 w-5" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Check: ({ className = "h-4 w-4" }) => (
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
  ArrowRight: ({ className = "h-4 w-4" }) => (
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
  Building: ({ className = "h-12 w-12" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="4" y="8" width="16" height="12" rx="1" />
      <path d="M8 8V4h8v4" />
      <path d="M12 12v4" />
    </svg>
  ),
};

function getAuthErrorMessage(error: string | null) {
  if (!error) {
    return "";
  }

  return AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.Default;
}

function DigitalCursor() {
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
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        borderColor: colors.quinary,
      }}
    />
  );
}

function FormInput({
  label,
  type,
  id,
  placeholder,
  icon,
  value,
  onChange,
  error,
}: {
  label: string;
  type: string;
  id: string;
  placeholder: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        ) : null}
        <input
          type={inputType}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full rounded-sm border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none dark:bg-[#011b2b] dark:text-white ${
            icon ? "pl-10" : "pl-4"
          } ${
            error
              ? "border-red-500"
              : "border-gray-200 dark:border-[#064e78]"
          } ${isFocused ? "border-[#00b3aa]" : ""}`}
        />
        {type === "password" ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#00b3aa]"
          >
            {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
          </button>
        ) : null}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          style={{ background: colors.gradient }}
          initial={{ width: "0%" }}
          animate={{ width: isFocused ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
      {error ? (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-xs text-red-500"
        >
          {error}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function SuccessModal({
  show,
  onClose,
  email,
  onContinue,
}: {
  show: boolean;
  onClose: () => void;
  email: string;
  onContinue: () => void;
}) {
  if (!show) {
    return null;
  }

  return (
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
        className="relative w-full max-w-md rounded-sm border bg-white p-8 dark:bg-[#011b2b]"
        style={{ borderColor: `${colors.quinary}20` }}
      >
        <div
          className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2"
          style={{ borderColor: colors.quinary }}
        />
        <div
          className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2"
          style={{ borderColor: colors.quinary }}
        />
        <div
          className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2"
          style={{ borderColor: colors.quinary }}
        />
        <div
          className="absolute right-3 bottom-3 h-4 w-4 border-r-2 border-b-2"
          style={{ borderColor: colors.quinary }}
        />

        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2"
            style={{
              borderColor: colors.quinary,
              background: `${colors.quinary}20`,
            }}
          >
            <Icons.Check className="h-8 w-8" />
          </motion.div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Welcome Back!
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Successfully signed in as{" "}
            <span className="font-medium" style={{ color: colors.quinary }}>
              {email}
            </span>
          </p>
          <button onClick={onContinue} className="relative w-full group">
            <div
              className="absolute -inset-1 rounded-sm opacity-0 blur transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: colors.gradient }}
            />
            <div
              className="relative rounded-sm px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: colors.gradient }}
            >
              Go to Dashboard
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rememberedEmail =
    typeof window === "undefined"
      ? ""
      : (localStorage.getItem("rememberedEmail") ?? "");
  const [formData, setFormData] = useState(() => ({
    email: rememberedEmail,
    password: "",
  }));
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const queryError = searchParams.get("error");
  const activeAuthError = authError || getAuthErrorMessage(queryError);

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

  const handleContinue = () => {
    setShowSuccess(false);
    router.push(searchParams.get("callbackUrl") ?? "/dashboard");
    router.refresh();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const response = await signIn("credentials", {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      redirect: false,
      redirectTo: searchParams.get("callbackUrl") ?? "/dashboard",
    });

    setIsLoading(false);

    if (!response?.ok) {
      setAuthError(getAuthErrorMessage(response?.error ?? "Default"));
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email.trim());
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    setShowSuccess(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFormData((current) => ({ ...current, [id]: value }));

    if (errors[id as keyof typeof errors]) {
      setErrors((current) => ({ ...current, [id]: "" }));
    }

    if (activeAuthError) {
      setAuthError("");
    }

    if (queryError) {
      router.replace("/login");
    }
  };

  return (
    <>
      <DigitalCursor />
      <SuccessModal
        show={showSuccess}
        onClose={() => setShowSuccess(false)}
        email={formData.email}
        onContinue={handleContinue}
      />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,179,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,179,170,0.03)_1px,transparent_1px)] bg-size-[32px_32px]" />
          <motion.div
            className="absolute top-20 left-10 h-96 w-96 rounded-full blur-3xl"
            style={{ background: `${colors.primary}20` }}
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl"
            style={{ background: `${colors.quinary}20` }}
            animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-12">
          <div className="mx-auto max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-sm border bg-white p-8 dark:bg-[#011b2b]"
              style={{ borderColor: `${colors.quinary}20` }}
            >
              <div
                className="absolute top-3 left-3 h-6 w-6 border-t-2 border-l-2"
                style={{ borderColor: colors.quinary }}
              />
              <div
                className="absolute top-3 right-3 h-6 w-6 border-t-2 border-r-2"
                style={{ borderColor: colors.quinary }}
              />
              <div
                className="absolute bottom-3 left-3 h-6 w-6 border-b-2 border-l-2"
                style={{ borderColor: colors.quinary }}
              />
              <div
                className="absolute right-3 bottom-3 h-6 w-6 border-r-2 border-b-2"
                style={{ borderColor: colors.quinary }}
              />

              <div className="mb-6 text-center">
                <motion.div
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 inline-flex items-center gap-2 rounded-sm px-3 py-1"
                  style={{
                    background: `${colors.quinary}10`,
                    border: `1px solid ${colors.quinary}30`,
                  }}
                >
                  <Icons.Building className="h-4 w-4" />
                  <span className="text-xs font-mono" style={{ color: colors.quinary }}>
                    ADMIN PORTAL
                  </span>
                </motion.div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
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

                {activeAuthError ? (
                  <p className="rounded-sm border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                    {activeAuthError}
                  </p>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded-sm accent-[#00b3aa]"
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <Link
                    href="/contact"
                    className="text-xs transition-colors hover:text-[#00b3aa]"
                    style={{ color: colors.quinary }}
                  >
                    Need help?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full group"
                >
                  <div
                    className="absolute -inset-0.5 rounded-sm opacity-0 blur transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: colors.gradient }}
                  />
                  <div
                    className="relative flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold text-white"
                    style={{ background: colors.gradient }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
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
                  Use your MongoDB user credentials to enter the admin dashboard.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500 dark:text-gray-500">
                &copy; {new Date().getFullYear()} Kimia Omran Engineering &
                Construction. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
