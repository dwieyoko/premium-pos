"use client";

import { motion } from "framer-motion";

interface EmptyCartIllustrationProps {
  className?: string;
}

export default function EmptyCartIllustration({ className = "" }: EmptyCartIllustrationProps) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Cart body */}
      <motion.path
        d="M60 70 L75 70 L90 130 L160 130 L175 85 L85 85"
        stroke="#0066cc"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Cart handle */}
      <motion.path
        d="M50 70 L60 70"
        stroke="#0066cc"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      
      {/* Left wheel */}
      <motion.circle
        cx="100"
        cy="145"
        r="10"
        stroke="#0066cc"
        strokeWidth="4"
        fill="#e8f4fd"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      />
      
      {/* Right wheel */}
      <motion.circle
        cx="150"
        cy="145"
        r="10"
        stroke="#0066cc"
        strokeWidth="4"
        fill="#e8f4fd"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 1.1 }}
      />
      
      {/* Empty indicator - dashed circle */}
      <motion.circle
        cx="125"
        cy="100"
        r="20"
        stroke="#d1e5f7"
        strokeWidth="2"
        strokeDasharray="5 5"
        fill="none"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 360 }}
        transition={{ 
          opacity: { duration: 0.5, delay: 1.2 },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
      />
      
      {/* Question mark */}
      <motion.text
        x="125"
        y="107"
        textAnchor="middle"
        fill="#5a7a9a"
        fontSize="24"
        fontWeight="bold"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        ?
      </motion.text>
      
      {/* Floating sparkles */}
      <motion.circle
        cx="170"
        cy="65"
        r="3"
        fill="#f59e0b"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="45"
        cy="100"
        r="2"
        fill="#0066cc"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [0, -8, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
      />
      <motion.circle
        cx="180"
        cy="120"
        r="2.5"
        fill="#0066cc"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          y: [0, -12, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      />
    </motion.svg>
  );
}
