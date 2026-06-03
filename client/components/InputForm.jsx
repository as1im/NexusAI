'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, FileText, Briefcase, ArrowRight, ArrowLeft, Upload, FileCheck, AlertCircle } from 'lucide-react';

export default function InputForm({ onSubmit, isLoading }) {
  const [step, setStep] = useState(1);
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinFile, setLinkedinFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Form Validations
  const validateStep = () => {
    setError('');
    
    if (step === 1) {
      if (!githubUrl.trim()) {
        setError('GitHub Profile URL is required.');
        return false;
      }
      const pattern = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/;
      if (!pattern.test(githubUrl.trim())) {
        setError('Please enter a valid GitHub Profile URL (e.g., https://github.com/username).');
        return false;
      }
    }

    if (step === 2) {
      if (!linkedinFile) {
        setError('LinkedIn PDF Export file is required.');
        return false;
      }
      if (linkedinFile.type !== 'application/pdf') {
        setError('File must be a valid PDF document.');
        return false;
      }
    }

    if (step === 3) {
      if (!jobDescription.trim()) {
        setError('Job Description text is required.');
        return false;
      }
      if (jobDescription.trim().length < 50) {
        setError('Job Description seems too short. Please paste a more detailed description.');
        return false;
      }
    }

    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onSubmit({
        githubUrl: githubUrl.trim(),
        linkedinPdf: linkedinFile,
        jobDescription: jobDescription.trim()
      });
    }
  };

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setLinkedinFile(file);
      } else {
        setError('Dropped file must be a PDF export.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLinkedinFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative">
      
      {/* Decorative Blur */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] pointer-events-none" />

      {/* Progress Dots */}
      <div className="flex justify-center items-center gap-2 mb-8">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === num 
                ? 'w-8 bg-indigo-500' 
                : num < step 
                  ? 'w-2 bg-emerald-500' 
                  : 'w-2 bg-neutral-700'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Github className="w-5 h-5 text-indigo-400" />
              GitHub Integration
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Enter your GitHub profile URL. We will extract repository summaries, star metrics, and language graphs.
            </p>

            <form onSubmit={handleNext}>
              <div className="mb-6">
                <label htmlFor="githubUrl" className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  id="githubUrl"
                  placeholder="https://github.com/username"
                  value={githubUrl}
                  onChange={(e) => {
                    setGithubUrl(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3.5 text-white placeholder-neutral-600 outline-none transition-all duration-300"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs mb-6 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Continue to LinkedIn
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              LinkedIn Profile Parsing
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Upload your LinkedIn profile exported as a PDF (More &gt; Save to PDF). We will extract experience, education, and credentials.
            </p>

            <form onSubmit={handleNext}>
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 mb-6 cursor-pointer relative ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : linkedinFile 
                      ? 'border-emerald-500/50 bg-emerald-500/5' 
                      : 'border-neutral-800 bg-neutral-950/20 hover:border-neutral-700'
                }`}
              >
                <input
                  type="file"
                  id="linkedinFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {linkedinFile ? (
                  <div className="flex flex-col items-center">
                    <FileCheck className="w-12 h-12 text-emerald-400 mb-3 animate-[pulse_2s_infinite]" />
                    <span className="text-white text-sm font-semibold truncate max-w-xs">{linkedinFile.name}</span>
                    <span className="text-neutral-500 text-xs mt-1">{(linkedinFile.size / 1024 / 1024).toFixed(2)} MB • PDF File</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-12 h-12 text-neutral-600 mb-3" />
                    <span className="text-neutral-300 text-sm font-semibold">Drag & Drop PDF export here</span>
                    <span className="text-neutral-500 text-xs mt-1.5">or click to browse your local files</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs mb-6 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-shrink-0 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-800/80 text-white font-semibold px-6 rounded-xl flex items-center justify-center transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Continue to Job Description
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Target Job Description
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Paste the job description you are targeting. Gemini will analyze core keywords and tailor your credentials.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="jobDescription" className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Job Description Text
                </label>
                <textarea
                  id="jobDescription"
                  placeholder="Paste the technical job description here... (skills, responsibilities, role specs)"
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    setError('');
                  }}
                  rows={8}
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-white placeholder-neutral-600 outline-none resize-none transition-all duration-300"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs mb-6 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-shrink-0 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-800/80 text-white font-semibold px-6 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                >
                  Generate Optimized Resume
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
