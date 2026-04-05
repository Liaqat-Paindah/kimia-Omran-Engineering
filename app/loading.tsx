"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#011b2b] transition-colors duration-300">
      <div className="relative">
        {/* Simple Spinner */}
        <motion.div
          className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700 border-t-[#00A3FF] dark:border-t-[#60C0FF] rounded-full shadow-sm dark:shadow-none"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Optional Text */}
        <motion.p
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[#00A3FF] dark:text-[#60C0FF]"></span> Loading...
        </motion.p>
      </div>
    </div>
  );
}