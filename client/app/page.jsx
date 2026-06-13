'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Sparkles, Terminal, Cpu, FileCheck, ArrowRight, Github, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Modern Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Glassmorphic Navbar */}
      <header className="mx-auto my-4 max-w-5xl w-[92%] border border-neutral-900 bg-neutral-950/70 backdrop-blur-md py-4 px-6 rounded-2xl flex items-center justify-between sticky top-4 z-50 shadow-2xl shadow-black/80">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            NexusAI
          </span>
        </Link>
        
        <nav className="flex items-center gap-6 text-sm font-semibold text-neutral-400">
          <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors duration-200">How it Works</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-8 py-20 md:py-28 flex flex-col items-center justify-center relative z-10 text-center">
        
        {/* Sparkles badge */}
        <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Next-Gen AI Resume Optimizer for Developers
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.15] max-w-4xl">
          Get Past the ATS Screen <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
            Automatically & Beautifully.
          </span>
        </h1>

        {/* Description */}
        <p className="text-neutral-400 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          NexusAI analyzes job descriptions, extracts your rich contributions from GitHub & LinkedIn, and crafts a highly tailored, hiring-manager-friendly resume with instant ATS scoring.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link 
            href="/signup"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-300 text-sm"
          >
            Sign Up
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/login"
            className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:-translate-y-0.5 text-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full mt-24 border-t border-neutral-900 pt-12 text-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">98%</h3>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">ATS Bypass Rate</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">&lt; 60s</h3>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Processing Time</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">10k+</h3>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Resumes Optimized</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Gemini</h3>
            <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-semibold">Powered Abstractions</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="bg-neutral-900/15 border-y border-neutral-900/60 py-20 px-8 relative z-10">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Tailored for Software Engineers
            </h2>
            <p className="text-neutral-400 text-sm">
              We extract and structure data from the places you actually keep it, formatting them to pass both robotic ATS filters and strict technical screening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-2xl relative overflow-hidden group hover:border-neutral-850 transition-colors">
              <Terminal className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="font-bold text-white mb-2 text-base">GitHub Repositories Extract</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Imports star metrics, popular languages, and repository descriptions. Automatically highlights open source contributions on your resume.
              </p>
            </div>
            
            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-2xl relative overflow-hidden group hover:border-neutral-850 transition-colors">
              <FileCheck className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="font-bold text-white mb-2 text-base">LinkedIn Profile Parser</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Extracts raw experience descriptions and educational records directly from your exported profile PDF, saving you hours of manual typing.
              </p>
            </div>

            <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-2xl relative overflow-hidden group hover:border-neutral-850 transition-colors">
              <Zap className="w-8 h-8 text-indigo-400 mb-4" />
              <h4 className="font-bold text-white mb-2 text-base">Gemini 1.5 Flash Optimization</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tailors bullet points, adds keyword densities matching the job description, and provides a comparative ATS score feedback panel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-8 relative z-10">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Simple 4-Step Process
            </h2>
            <p className="text-neutral-400 text-sm">
              From GitHub profile URL to tailored PDF/DOCX templates in less than a minute.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900/20 border border-neutral-900/80 p-5 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Authenticate your account</h4>
                <p className="text-neutral-400 text-xs mt-1">
                  Log in securely using your credentials or standard GitHub OAuth to manage resume histories.
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/20 border border-neutral-900/80 p-5 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Provide Profile Coordinates</h4>
                <p className="text-neutral-400 text-xs mt-1">
                  Paste your GitHub profile URL and upload your exported LinkedIn PDF.
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/20 border border-neutral-900/80 p-5 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Submit Target Job Specs</h4>
                <p className="text-neutral-400 text-xs mt-1">
                  Paste the requirements of the job description you are applying for.
                </p>
              </div>
            </div>

            <div className="bg-neutral-900/20 border border-neutral-900/80 p-5 rounded-2xl flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold shrink-0 text-sm">
                4
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Review score and export</h4>
                <p className="text-neutral-400 text-xs mt-1">
                  Compare ATS scores, see matched and missing keywords, and download formatted PDF/DOCX templates instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security CTA Banner */}
      <section className="bg-neutral-900/20 border-t border-neutral-900 py-16 px-8 relative z-10 text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          <ShieldCheck className="w-10 h-10 text-indigo-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Secure & Private Data Encryption</h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-lg mb-6">
            We store credentials and histories using secured MongoDB sessions and never share your details with external databases.
          </p>
          <Link
            href="/signup"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl hover:-translate-y-0.5 transition-all text-xs"
          >
            Create Your Account Today
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 bg-neutral-950/40 relative z-10">
        <span>© 2026 NexusAI. Designed for developer ATS optimization.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </main>
  );
}
