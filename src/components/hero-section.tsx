"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Star } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {/* Large stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Medium stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-med-${i}`}
            className="absolute w-0.5 h-0.5 bg-blue-200 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
            }}
            animate={{
              x: [0, 200],
              y: [0, 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 4 + Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Galaxy/Nebula effect */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-900/30 via-blue-900/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-indigo-900/40 via-purple-900/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Death Star silhouette */}
      <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-gradient-radial from-gray-400 to-gray-800 rounded-full relative">
          <div className="absolute top-4 right-4 w-4 h-4 bg-gray-600 rounded-full" />
          <div className="absolute top-8 left-6 w-2 h-2 bg-gray-500 rounded-full" />
          <div className="absolute bottom-6 right-8 w-1 h-1 bg-gray-400 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-200 mb-6 tracking-tight leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
            Starships
          </span>
          <br />
          from Star Wars
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
        >
          Compare models, crews, hyperdrives, and more from across the galaxy.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <Link href="/starships">
            <Button
              size="lg"
              className="relative px-12 py-6 text-lg font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black border-2 border-yellow-400/50 shadow-2xl shadow-yellow-400/25 transition-all duration-300 hover:shadow-yellow-400/40 hover:scale-105 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Starships
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </span>
              
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </motion.div>

        {/* Bottom decorative element */}

      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/20" />
    </div>
  );
}