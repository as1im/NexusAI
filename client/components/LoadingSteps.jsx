'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

const stepsList = [
  { label: 'Extracting GitHub Repositories & Activity', description: 'Querying GitHub v3 API for repositories, languages, and details.' },
  { label: 'Parsing uploaded LinkedIn PDF', description: 'Extracting unstructured textual historical data.' },
  { label: 'Structuring parsed data via Gemini', description: 'Gemini AI cleanses and structures data into profile schemas.' },
  { label: 'Analyzing Job Description Keywords', description: 'Extracting targeted ATS metrics and tech terms from the role.' },
  { label: 'Generating ATS-Optimized Bullet Points', description: 'AI crafts tailored summaries and job accomplishment statements.' },
  { label: 'Compiling PDF & DOCX Assets', description: 'Puppeteer and Docx service generate downloadable files.' }
];

export default function LoadingSteps({ currentStep }) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Gradient glow behind */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center mb-8 relative">
        <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-indigo-200 via-violet-100 to-indigo-200 bg-clip-text text-transparent">
          Analyzing & Generating Your Resume
        </h3>
        <p className="text-neutral-400 text-sm">
          Please wait while our Gemini-powered engine crafts your optimized layout.
        </p>
      </div>

      <div className="space-y-6 relative">
        {stepsList.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-500/10 border-indigo-500/30' 
                  : isCompleted 
                    ? 'bg-neutral-900/40 border-neutral-800/50' 
                    : 'bg-transparent border-transparent opacity-40'
              }`}
            >
              {/* Icon State */}
              <div className="mt-0.5">
                {isCompleted && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/10" />
                )}
                {isActive && (
                  <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                )}
                {isPending && (
                  <Circle className="w-6 h-6 text-neutral-600" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className={`font-semibold text-base transition-colors duration-300 ${
                  isActive ? 'text-indigo-200' : isCompleted ? 'text-neutral-300' : 'text-neutral-500'
                }`}>
                  {step.label}
                </div>
                <div className={`text-xs mt-1 transition-colors duration-300 ${
                  isActive ? 'text-indigo-400/80' : isCompleted ? 'text-neutral-400/60' : 'text-neutral-600'
                }`}>
                  {step.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer loading quote */}
      <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
        <span className="text-xs text-neutral-500 italic animate-pulse">
          "A great resume opens the door; an ATS-optimized one keeps it open."
        </span>
      </div>
    </div>
  );
}
