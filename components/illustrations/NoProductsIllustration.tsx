"use client";

import { motion } from "framer-motion";

interface NoProductsIllustrationProps {
  className?: string;
}

export default function NoProductsIllustration({ className = "" }: NoProductsIllustrationProps) {
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
      {/* Box base */}
      <motion.path
        d="M40 100 L100 130 L160 100 L100 70 Z"
        stroke="#0066cc"
        strokeWidth="3"
        fill="#e8f4fd"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Box left side */}
      <motion.path
        d="M40 100 L40 140 L100 170 L100 130"
        stroke="#0066cc"
        strokeWidth="3"
        fill="#d1e5f7"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />
      
      {/* Box right side */}
      <motion.path
        d="M160 100 L160 140 L100 170 L100 130"
        stroke="#0066cc"
        strokeWidth="3"
        fill="#bfdbfe"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      />
      
      {/* Box flap left */}
      <motion.path
        d="M40 100 L70 80 L100 100 L100 70 L70 50 L40 70"
        stroke="#0066cc"
        strokeWidth="2"
        fill="#e8f4fd"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        style={{ transformOrigin: "40px 100px" }}
      />
      
      {/* Box flap right */}
      <motion.path
        d="M160 100 L130 80 L100 100 L100 70 L130 50 L160 70"
        stroke="#0066cc"
        strokeWidth="2"
        fill="#dbeafe"
        initial={{ rotateX: 90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        style={{ transformOrigin: "160px 100px" }}
      />
      
      {/* Plus sign floating */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <motion.circle
          cx="100"
          cy="45"
          r="18"
          fill="#0066cc"
          animate={{ 
            y: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M100 37 L100 53 M92 45 L108 45"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ 
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.g>
      
      {/* Floating particles */}
      <motion.circle
        cx="50"
        cy="60"
        r="3"
        fill="#f59e0b"
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, -15, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.circle
        cx="150"
        cy="55"
        r="2"
        fill="#0066cc"
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, -10, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="170"
        cy="130"
        r="2.5"
        fill="#0066cc"
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, -12, 0]
        }}
        transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
      />
      <motion.circle
        cx="30"
        cy="120"
        r="2"
        fill="#f59e0b"
        animate={{ 
          opacity: [0, 1, 0],
          y: [0, -8, 0]
        }}
        transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }}
      />
    </motion.svg>
  );
}
