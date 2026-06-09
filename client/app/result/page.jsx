'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AtsScoreCard from '../../components/AtsScoreCard';
import ResumePreview from '../../components/ResumePreview';
import { Cpu, ArrowLeft, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
      if (status !== 'authenticated') return;

      setLoading(true);
      const headers = {};
      if (session?.accessToken) {
        headers['Authorization'] = `Bearer ${session.accessToken}`;
      }

      fetch(`http://localhost:5000/api/resumes/${id}`, { headers })
        .then(res => {
          if (!res.ok) throw new Error('Failed to retrieve resume details');
          return res.json();
        })
        .then(resData => {
          if (resData.success) {
            setData(resData.data);
          } else {
            setError(resData.message || 'Failed to parse resume details');
          }
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'Error connecting to server');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Retrieve the generated resume payload from localStorage
      const savedData = localStorage.getItem('generatedResume');
      if (savedData) {
        try {
          setData(JSON.parse(savedData));
        } catch (err) {
          console.error('Failed to parse localStorage resume data:', err);
        }
      }
    }
  }, [status, session]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Loading Resume Details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Resume</h2>
          <p className="text-neutral-500 text-sm mb-6">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
          >
            Go to Generator Wizard
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4 animate-[pulse_2s_infinite]" />
          <h2 className="text-xl font-bold text-white mb-2">No Resume Data Found</h2>
          <p className="text-neutral-500 text-sm mb-6">
            Please fill in your GitHub details, LinkedIn profile, and job description to optimize your resume first.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
          >
            Start Generator Wizard
          </button>
        </div>
      </div>
    );
  }

  const { resume = {}, atsScore = 85, atsScoreBefore = 45, matchedKeywords = [], missingKeywords = [], pdfUrl, docxUrl } = data;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative Blur glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full border-b border-neutral-900 bg-neutral-950/70 backdrop-blur-md py-5 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            NexusAI
          </span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Start New Optimization
        </button>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto w-full px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Side: Score card and downloads */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          
          <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 p-6 rounded-3xl relative overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-2">Resume Tailoring Success!</h2>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Your resume bullet points and tech descriptors are now highly tuned to pass automated filters.
            </p>
          </div>

          {/* ATS Score Gauges */}
          <AtsScoreCard 
            beforeScore={atsScoreBefore} 
            afterScore={atsScore} 
            matchedKeywords={matchedKeywords} 
            missingKeywords={missingKeywords} 
          />

          {/* Download & Export widget */}
          <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-4">Export & Download Files</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* PDF button */}
              <a
                href={pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all duration-300 text-sm text-center"
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                Download PDF
              </a>

              {/* DOCX button */}
              <a
                href={docxUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-300 text-sm text-center"
              >
                <FileText className="w-4 h-4 flex-shrink-0" />
                Download DOCX
              </a>

            </div>
            <div className="mt-4 flex items-center gap-2 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/40 text-[10px] text-neutral-500 leading-normal">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Both file formats are optimized for parsing and compatible with Workday, Taleo, and Lever ATS schemas.
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Resume interactive preview */}
        <div className="lg:col-span-7">
          <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-2 shadow-2xl relative">
            <div className="bg-neutral-950 px-4 py-2 border-b border-neutral-900 rounded-t-2xl flex items-center justify-between text-xs text-neutral-500">
              <span>Optimized Layout Preview</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                A4 Dimensions Scale
              </span>
            </div>
            <div className="p-4 overflow-y-auto max-h-[85vh]">
              <ResumePreview resume={resume} />
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 bg-neutral-950/40 relative z-10">
        <span>© 2026 NexusAI. Generated tailormade developer formats.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
