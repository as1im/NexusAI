'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Cpu, History, User, LogOut, Sparkles, FileText, ArrowRight, Award, PlusCircle, Activity } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'authenticated') return;

    const headers = {};
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    fetch('http://localhost:5000/api/resumes', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to retrieve resumes');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setResumes(data.data || []);
        } else {
          setError(data.message || 'Failed to load dashboard data');
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Could not connect to backend server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status, session]);

  // Derive stats
  const totalResumes = resumes.length;
  const averageAts = totalResumes > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / totalResumes) 
    : 0;
  const highestAts = totalResumes > 0 
    ? Math.max(...resumes.map(r => r.atsScore || 0)) 
    : 0;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Modern Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Glassmorphic Navbar */}
      <header className="mx-auto my-4 max-w-5xl w-[92%] border border-neutral-900 bg-neutral-950/70 backdrop-blur-md py-4 px-6 rounded-2xl flex items-center justify-between sticky top-4 z-50 shadow-2xl shadow-black/80">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            NexusAI
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold text-neutral-400">
          <Link href="/dashboard" className="text-white hover:text-white transition-colors duration-200">Dashboard</Link>
          <Link href="/create-resume" className="hover:text-white transition-colors duration-200">Optimize Resume</Link>
          <Link href="/history" className="hover:text-white transition-colors duration-200">History</Link>
          <Link href="/profile" className="hover:text-white transition-colors duration-200">Profile</Link>
          <span className="text-neutral-800">|</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full pl-2 pr-4 py-1.5">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt={session.user.name} 
                  className="w-6 h-6 rounded-full border border-indigo-500/30"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {session?.user?.name ? session.user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
                </div>
              )}
              <span className="text-xs font-medium text-neutral-200">{session?.user?.name || session?.user?.email}</span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 px-4 py-2 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-8 py-12 relative z-10 flex-1 flex flex-col gap-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              SaaS Console
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Welcome Back, {session?.user?.name || 'Developer'}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Analyze, optimize, and build ATS-friendly resumes for your next career move.
            </p>
          </div>
          <div>
            <Link 
              href="/create-resume" 
              className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              Create Tailored Resume
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
              <FileText className="w-24 h-24" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Resumes Tailored</span>
              <h3 className="text-3xl font-black text-white mt-1">{loading ? '...' : totalResumes}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
              <Award className="w-24 h-24" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Average ATS Score</span>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">{loading ? '...' : `${averageAts}%`}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-900 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
              <Activity className="w-24 h-24" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Highest Score</span>
              <h3 className="text-3xl font-black text-violet-400 mt-1">{loading ? '...' : `${highestAts}%`}</h3>
            </div>
            <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Dashboard Control Banner */}
        <Link 
          href="/create-resume" 
          className="group relative bg-gradient-to-r from-neutral-900/60 to-indigo-950/20 border border-neutral-900 hover:border-indigo-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 shadow-2xl overflow-hidden"
        >
          {/* subtle inside glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Cpu className="w-8 h-8 animate-[pulse_3s_infinite]" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg mb-1 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                Resume Generator Workspace
                <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                Start tailoring credentials in real-time. Link GitHub repositories and upload your LinkedIn PDF export to generate templates matching target job specs.
              </p>
            </div>
          </div>

          <div className="relative z-10 bg-indigo-600 group-hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-1.5 transition-all duration-300 shadow-lg shadow-indigo-600/25 text-sm whitespace-nowrap active:scale-[0.98]">
            Launch Wizard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Recent Generations List */}
        <div className="bg-neutral-900/20 border border-neutral-900 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Recent Resume Optimizations
            </h3>
            {resumes.length > 3 && (
              <Link href="/history" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                View All History →
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-10 bg-neutral-900/25 rounded-2xl">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mx-auto mb-2" />
                <span className="text-xs text-neutral-500">Loading recent files...</span>
              </div>
            ) : error ? (
              <div className="text-center py-10 border border-rose-500/10 bg-rose-500/5 rounded-2xl">
                <span className="text-xs text-rose-400 font-medium block">Failed to load resumes history</span>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-800 bg-neutral-950/20 rounded-2xl">
                <FileText className="w-10 h-10 text-neutral-700 mx-auto mb-2" />
                <span className="text-xs text-neutral-500 block">No generated resumes found</span>
                <Link href="/create-resume" className="text-indigo-400 hover:underline text-xs font-bold mt-2 inline-block">
                  Tailor your first resume now
                </Link>
              </div>
            ) : (
              resumes.slice(0, 3).map((item) => (
                <div 
                  key={item._id}
                  className="bg-neutral-900/40 border border-neutral-850 hover:border-neutral-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                      <FileText className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-snug">{item.jobTitle}</h4>
                      <span className="text-[10px] text-neutral-500 mt-0.5 block">
                        {new Date(item.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10">
                      ATS: {item.atsScore}%
                    </span>
                    <button
                      onClick={() => router.push(`/result?id=${item._id}`)}
                      className="text-xs bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:text-white text-neutral-300 font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1 transition-all"
                    >
                      Details
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 bg-neutral-950/40 relative z-10">
        <span>© 2026 NexusAI. SaaS dashboard view.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
