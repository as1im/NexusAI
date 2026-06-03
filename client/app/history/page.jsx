'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Cpu, ArrowLeft, History, Calendar, FileText, ExternalLink, Award } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/resumes')
      .then(res => {
        if (!res.ok) throw new Error('Failed to retrieve history');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setResumes(data.data || []);
        } else {
          setError(data.message || 'Failed to load history');
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Could not connect to backend server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

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
          Back to Generator
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-8 py-12 relative z-10 flex-1">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl text-indigo-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Resume Generation History</h2>
            <p className="text-neutral-500 text-sm mt-0.5">
              Review and manage your previously optimized ATS-friendly resumes.
            </p>
          </div>
        </div>

        {/* Resumes Grid/List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4" />
              <span className="text-neutral-500 text-sm font-semibold block">Loading history...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-neutral-900/20 border border-rose-500/10 rounded-3xl">
              <span className="text-rose-400 text-sm font-semibold block mb-3">Error: {error}</span>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs bg-neutral-900 hover:bg-neutral-800 text-indigo-400 font-semibold px-4 py-2 rounded-xl border border-neutral-800 transition-all"
              >
                Retry Connection
              </button>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
              <FileText className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
              <span className="text-neutral-500 text-sm font-semibold block">No historical records found</span>
            </div>
          ) : (
            resumes.map((item) => (
              <div 
                key={item._id}
                className="bg-neutral-900/40 border border-neutral-850 hover:border-neutral-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300"
              >
                {/* Details */}
                <div className="flex items-start gap-3.5">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex-shrink-0">
                    <FileText className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-snug">{item.jobTitle}</h4>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                        {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-400">
                        <Award className="w-3.5 h-3.5 flex-shrink-0" />
                        ATS Score: {item.atsScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/result?id=${item._id}`)}
                    className="flex-1 sm:flex-initial text-xs bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-neutral-200 font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300"
                  >
                    View Details
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 bg-neutral-950/40 relative z-10">
        <span>© 2026 NexusAI. Historically tailored outputs.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
