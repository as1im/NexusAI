'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function AtsScoreCard({ beforeScore = 45, afterScore = 85, matchedKeywords = [], missingKeywords = [] }) {
  // Helper to get color values based on score levels
  const getScoreColors = (score) => {
    if (score >= 80) return { text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', stroke: '#10b981' };
    if (score >= 60) return { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10', stroke: '#f59e0b' };
    return { text: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/10', stroke: '#f43f5e' };
  };

  const beforeColors = getScoreColors(beforeScore);
  const afterColors = getScoreColors(afterScore);

  // SVG Circular progress math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <div className="w-full bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Decorative gradient glow */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-400" />
        ATS Feedback & Scoring
      </h3>

      {/* Circle Gauges Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Before Score */}
        <div className={`flex items-center gap-5 p-5 rounded-2xl border ${beforeColors.border} ${beforeColors.bg} relative`}>
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r={radius} className="stroke-neutral-800 fill-transparent" strokeWidth="8" />
              <motion.circle 
                cx="48" cy="48" r={radius} className="fill-transparent" strokeWidth="8" 
                stroke={beforeColors.stroke}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (beforeScore / 100) * circumference }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${beforeColors.text}`}>{beforeScore}%</span>
              <span className="text-[9px] text-neutral-400 font-semibold uppercase">Initial</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-300">Initial Match Score</h4>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Standard parsed format index prior to job optimization.
            </p>
          </div>
        </div>

        {/* After Score */}
        <div className={`flex items-center gap-5 p-5 rounded-2xl border ${afterColors.border} ${afterColors.bg} relative overflow-hidden`}>
          
          {/* Shine effect across optimized score */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r={radius} className="stroke-neutral-800 fill-transparent" strokeWidth="8" />
              <motion.circle 
                cx="48" cy="48" r={radius} className="fill-transparent" strokeWidth="8" 
                stroke={afterColors.stroke}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (afterScore / 100) * circumference }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${afterColors.text}`}>{afterScore}%</span>
              <span className="text-[9px] text-neutral-400 font-semibold uppercase">Optimized</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Optimized Score
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">
                +{afterScore - beforeScore}%
              </span>
            </h4>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Excellent! Resume bullet points have been optimized with targeted industry keywords.
            </p>
          </div>
        </div>

      </div>

      {/* Keywords Comparison Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-800/80">
        
        {/* Matched Keywords */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            Matched Keywords ({matchedKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-2">
            {matchedKeywords.length === 0 ? (
              <span className="text-xs text-neutral-600 italic">No keywords matched yet.</span>
            ) : (
              matchedKeywords.map((kw, idx) => (
                <span key={idx} className="text-xs bg-emerald-500/5 text-emerald-300 border border-emerald-500/10 px-2.5 py-1 rounded-lg">
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            Missing Keywords ({missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-2">
            {missingKeywords.length === 0 ? (
              <span className="text-xs text-neutral-500 italic">Excellent match! 0 gaps.</span>
            ) : (
              missingKeywords.map((kw, idx) => (
                <span key={idx} className="text-xs bg-amber-500/5 text-amber-300 border border-amber-500/10 px-2.5 py-1 rounded-lg">
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
