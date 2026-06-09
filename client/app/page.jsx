'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import InputForm from '../components/InputForm';
import LoadingSteps from '../components/LoadingSteps';
import { Sparkles, Terminal, Cpu, FileCheck, LogOut, History, User } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleGenerate = async (formData) => {
    setIsLoading(true);
    setCurrentStep(0); // GitHub parsing

    // Prepare auth headers if logged in
    const headers = { 'Content-Type': 'application/json' };
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    try {
      // Step 1: Parse GitHub Data
      setCurrentStep(0);
      const githubRes = await fetch('http://localhost:5000/api/parse/github', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ githubUrl: formData.githubUrl })
      });
      const githubData = await githubRes.json();
      if (!githubRes.ok) throw new Error(githubData.message || 'GitHub parsing failed.');

      // Step 2: Parse LinkedIn PDF
      setCurrentStep(1);
      const linkedinFormData = new FormData();
      linkedinFormData.append('linkedinPdf', formData.linkedinPdf);

      const linkedinHeaders = {};
      if (session?.accessToken) {
        linkedinHeaders['Authorization'] = `Bearer ${session.accessToken}`;
      }

      const linkedinRes = await fetch('http://localhost:5000/api/parse/linkedin', {
        method: 'POST',
        headers: linkedinHeaders,
        body: linkedinFormData
      });
      const linkedinData = await linkedinRes.json();
      if (!linkedinRes.ok) throw new Error(linkedinData.message || 'LinkedIn parsing failed.');

      // Step 3: Structure profile data
      setCurrentStep(2);
      // Combine GitHub repos and LinkedIn profile data
      const mergedProfile = {
        personalInfo: linkedinData.data.personalInfo,
        experience: linkedinData.data.experience,
        education: linkedinData.data.education || [],
        skills: [...new Set([...(linkedinData.data.skills || []), ...(githubData.data.repositories.map(r => r.language).filter(Boolean))])],
        projects: githubData.data.repositories.slice(0, 5).map(repo => ({
          title: repo.name,
          description: repo.description || 'Open source software project.',
          technologies: [repo.language].filter(Boolean),
          url: repo.url,
          stars: repo.stars
        }))
      };

      // Step 4: Analyze JD Keywords & Generate Optimized Resume
      setCurrentStep(3);
      setCurrentStep(4);
      const generateRes = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          profile: mergedProfile,
          jobDescription: formData.jobDescription
        })
      });
      const generateData = await generateRes.json();
      if (!generateRes.ok) throw new Error(generateData.message || 'Resume generation failed.');

      // Step 5: Compiling & saving outputs
      setCurrentStep(5);
      
      // Store output in localStorage for simple routing state management
      localStorage.setItem('generatedResume', JSON.stringify(generateData.data));
      
      // Short delay for visual transition satisfaction
      setTimeout(() => {
        setIsLoading(false);
        router.push('/result');
      }, 1000);

    } catch (err) {
      console.error(err);
      alert(err.message || 'An unexpected error occurred during generation.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Glassmorphic Navbar */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-md py-5 px-8 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            NexusAI
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold text-neutral-400">
          <a href="#" className="hover:text-white transition-colors duration-200">How it Works</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Templates</a>
          <span className="text-neutral-800">|</span>
          
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <Link href="/history" className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
                <History className="w-4 h-4" />
                History
              </Link>
              <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full pl-2 pr-4 py-1.5">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name} 
                    className="w-6 h-6 rounded-full border border-indigo-500/30"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {session.user.name ? session.user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                  </div>
                )}
                <span className="text-xs font-medium text-neutral-200">{session.user.name || session.user.email}</span>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 px-4 py-2 rounded-xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link 
              href="/login"
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 px-4 py-2 rounded-xl transition-all duration-300"
            >
              Login
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Content / Form Container */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-8 py-16 flex flex-col items-center justify-center relative z-10">
        {!isLoading ? (
          <>
            {/* Splash text */}
            <div className="text-center max-w-3xl mb-12">
              <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen ATS Optimizer
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-[1.15]">
                Get Past the ATS Screen <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
                  Automatically & Beautifully.
                </span>
              </h1>
              <p className="text-neutral-400 md:text-lg leading-relaxed max-w-2xl mx-auto">
                NexusAI analyzes job descriptions, extracts your rich contributions from GitHub & LinkedIn, and crafts a highly tailored resume with instant scoring.
              </p>
            </div>

            {/* Input Form wizard */}
            <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-16">
              <div className="bg-neutral-900/35 border border-neutral-900 p-5 rounded-2xl">
                <Terminal className="w-5 h-5 text-indigo-400 mb-3" />
                <h4 className="font-bold text-white mb-1.5 text-sm">GitHub Contributions</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Imports stars, specific languages, and repository details to showcase raw coding skills.
                </p>
              </div>
              <div className="bg-neutral-900/35 border border-neutral-900 p-5 rounded-2xl">
                <FileCheck className="w-5 h-5 text-indigo-400 mb-3" />
                <h4 className="font-bold text-white mb-1.5 text-sm">LinkedIn Profile Extractor</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Extracts and cleanses unstructured experience bullet points from your PDF exports.
                </p>
              </div>
              <div className="bg-neutral-900/35 border border-neutral-900 p-5 rounded-2xl">
                <Cpu className="w-5 h-5 text-indigo-400 mb-3" />
                <h4 className="font-bold text-white mb-1.5 text-sm">Tailored Gemini 1.5 Flash</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Injects targeted resume-safe action verbs and keywords directly matching the role.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Loading animation steps stepper */
          <div className="w-full flex items-center justify-center">
            <LoadingSteps currentStep={currentStep} />
          </div>
        )}
      </section>

      {/* Simple Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 bg-neutral-950/40 relative z-10">
        <span>© 2026 NexusAI. Built for developers.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </main>
  );
}
