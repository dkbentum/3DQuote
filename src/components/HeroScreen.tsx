/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { UploadCloud, MapPin, Phone, MessageSquare, Compass, ShieldCheck } from 'lucide-react';
import Logo from './Logo.tsx';

interface HeroScreenProps {
  onStartUpload: () => void;
}

export default function HeroScreen({ onStartUpload }: HeroScreenProps) {
  return (
    <div className="flex flex-col h-full justify-between p-6 md:p-8">
      {/* Upper Navigation & Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center pt-4 md:pt-2"
      >
        <Logo size="lg" className="mb-2" />

        {/* Parent Company Label & Tagline */}
        <div className="text-center mt-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Triple Dimension Fabrication
          </p>
          <p className="text-[11px] font-medium text-emerald-600 tracking-wider italic mt-0.5">
            "Let's make something"
          </p>
        </div>
      </motion.div>

      {/* Hero Body / Action */}
      <div className="my-auto py-8 md:py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 lg:gap-24 max-w-5xl mx-auto w-full">
        {/* Left: Animated 3D Grid Placeholder Graphic */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center shrink-0"
        >
          {/* Glowing background circles */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl animate-pulse"></div>

          {/* Wireframe 3D look-alike using CSS borders */}
          <div className="absolute w-36 h-36 md:w-48 md:h-48 border border-slate-200/60 rounded-xl rotate-12 flex items-center justify-center animate-[spin_20s_linear_infinite]">
            <div className="w-24 h-24 md:w-32 md:h-32 border border-emerald-500/30 rounded-lg -rotate-45"></div>
          </div>

          <div className="absolute w-40 h-40 md:w-56 md:h-56 border border-dashed border-emerald-500/20 rounded-full animate-[spin_30s_linear_infinite]"></div>

          {/* Floating UI Elements */}
          <div className="z-10 p-6 md:p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
            <UploadCloud size={44} className="text-emerald-500 stroke-[1.5] md:w-12 md:h-12" />
            <span className="font-mono text-[10px] md:text-xs text-slate-400 mt-2">STL FILES ONLY</span>
          </div>

          {/* Visual print nozzle indicator */}
          <motion.div
            animate={{
              x: [0, 15, -15, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-emerald-500 text-white p-1.5 rounded-lg shadow-md"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          </motion.div>
        </motion.div>

        {/* Right: Messaging */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 leading-tight">
              Instant  <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                3D Printing
              </span>
            </h1>
            <p className="text-slate-600 text-sm md:text-base mt-3 font-medium leading-relaxed">
              Upload your model and leave the rest to us.
            </p>

            {/* Tagline pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold mt-4 border border-emerald-100">
              <span>Upload</span>
              <span className="text-slate-300">•</span>
              <span>Get Quote</span>
              <span className="text-slate-300">•</span>
              <span>Print</span>
            </div>
          </motion.div>

          {/* Primary CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full mt-8"
          >
            <button
              onClick={onStartUpload}
              id="btn_upload_design_start"
              className="w-full md:w-auto flex items-center justify-center gap-3 py-4 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer text-base"
            >
              <UploadCloud size={20} className="animate-bounce" />
              Upload Your Design
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer / Contact Details */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="border-t border-slate-100 pt-5 mt-4 text-xs text-slate-500"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 md:gap-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 text-[11px] md:text-xs">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-slate-700">Kumasi - Apemso</p>
              <p className="text-slate-400 text-[10px]">Ghana</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] md:text-xs">
            <Compass size={14} className="text-slate-400 shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-slate-700">Precision Fab</p>
              <p className="text-slate-400 text-[10px]">Quality Guaranteed</p>
            </div>
          </div>

          <a
            href="https://wa.me/233537090117"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[11px] md:text-xs hover:text-emerald-600 transition-colors"
          >
            <MessageSquare size={14} className="text-emerald-500 shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-slate-700">053 709 0117</p>
              <p className="text-slate-400 text-[10px]">WhatsApp Chat</p>
            </div>
          </a>

          <a
            href="tel:+233209115526"
            className="flex items-center gap-2 text-[11px] md:text-xs hover:text-emerald-600 transition-colors"
          >
            <Phone size={14} className="text-slate-400 shrink-0" />
            <div className="text-left">
              <p className="font-semibold text-slate-700">020 911 5526</p>
              <p className="text-slate-400 text-[10px]">Call Support</p>
            </div>
          </a>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-5 border-t border-slate-100/60 pt-3">
          © 2026 Triple Dimension Fabrication. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
