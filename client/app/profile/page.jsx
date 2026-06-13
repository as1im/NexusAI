'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, LogOut, User, Save, CheckCircle2, AlertCircle, ArrowLeft, Globe, Linkedin, Github, Phone, FileText } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [summary, setSummary] = useState('');
  const [skillsText, setSkillsText] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    if (status !== 'authenticated') return;

    const headers = {};
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    fetch('http://localhost:5000/api/profile', { headers })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load profile details');
        return res.json();
      })
      .then(resData => {
        if (resData.success) {
          const u = resData.data;
          setName(u.name || '');
          setEmail(u.email || '');
          setAvatarUrl(u.avatarUrl || '');
          
          const prof = u.profile || {};
          setPhone(prof.phone || '');
          setWebsite(prof.website || '');
          setLinkedin(prof.linkedin || '');
          setGithub(prof.github || '');
          setSummary(prof.summary || '');
          setSkillsText(prof.skills ? prof.skills.join(', ') : '');
        } else {
          setErrorMsg(resData.message || 'Error parsing profile info');
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg(err.message || 'Could not connect to backend api');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status, session]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const parsedSkills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      name,
      avatarUrl,
      profile: {
        phone,
        website,
        linkedin,
        github,
        summary,
        skills: parsedSkills
      }
    };

    const headers = { 'Content-Type': 'application/json' };
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save profile changes');
      }

      setSuccessMsg('Profile saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Modern Tech Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

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
          <Link href="/dashboard" className="hover:text-white transition-colors duration-200">Dashboard</Link>
          <Link href="/create-resume" className="hover:text-white transition-colors duration-200">Optimize Resume</Link>
          <Link href="/history" className="hover:text-white transition-colors duration-200">History</Link>
          <Link href="/profile" className="text-white hover:text-white transition-colors duration-200">Profile</Link>
          <span className="text-neutral-800">|</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-neutral-900/60 border border-neutral-800 rounded-full pl-2 pr-4 py-1.5">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={name} 
                  className="w-6 h-6 rounded-full border border-indigo-500/30"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                  {name ? name.charAt(0) : <User className="w-3.5 h-3.5" />}
                </div>
              )}
              <span className="text-xs font-medium text-neutral-200">{name || email}</span>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 px-4 py-2 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-8 py-12 relative z-10 flex-1 flex flex-col gap-6">
        
        {/* Navigation back and header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Developer Profile Settings</h2>
              <p className="text-neutral-500 text-xs mt-0.5">
                Manage your base coordinates for quicker portfolio resume optimization.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xs bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Message Notifications */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-4 rounded-xl flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-4 rounded-xl flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-20 bg-neutral-900/10 border border-neutral-900 rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4" />
            <span className="text-neutral-500 text-xs block font-semibold">Loading profile information...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Left Card: Avatar and Tab Navigation */}
            <div className="lg:col-span-4 bg-neutral-900/40 border border-neutral-900/80 p-6 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              
              {/* Large avatar circle */}
              <div className="relative mb-4 mt-2">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={name} 
                    className="w-24 h-24 rounded-full border-2 border-indigo-500/30 relative z-10 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-3xl font-extrabold text-white uppercase relative z-10 shadow-lg">
                    {name ? name.charAt(0) : <User className="w-10 h-10" />}
                  </div>
                )}
              </div>
              
              <h3 className="font-extrabold text-white text-lg leading-tight mt-1">{name || 'Developer'}</h3>
              <p className="text-neutral-500 text-xs mt-1 truncate w-full max-w-[200px]">{email}</p>
              
              {/* Tabs navigation list */}
              <div className="w-full flex flex-col gap-2 mt-8 z-10">
                {[
                  { id: 'account', label: 'Account Info', icon: User },
                  { id: 'links', label: 'Social Links', icon: Globe },
                  { id: 'skills', label: 'Skills & Bio', icon: FileText }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 font-bold text-xs transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                          : 'bg-neutral-950/40 border border-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Card: Tab-specific Forms */}
            <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-900/80 p-6 md:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
              
              <AnimatePresence mode="wait">
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-900 pb-3 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-400" /> Account Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          placeholder="e.g. Jane Doe"
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                          Email (Read-Only)
                        </label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className="w-full bg-neutral-900/60 border border-neutral-850 text-neutral-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                        Avatar Image URL
                      </label>
                      <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-neutral-600" /> Contact Phone
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-neutral-600" /> Personal Website
                        </label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://portfolio.me"
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'links' && (
                  <motion.div
                    key="links"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-900 pb-3 mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-400" /> Professional Connections
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                          <Linkedin className="w-3.5 h-3.5 text-neutral-600" /> LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                          <Github className="w-3.5 h-3.5 text-neutral-600" /> GitHub URL
                        </label>
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills' && (
                  <motion.div
                    key="skills"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 border-b border-neutral-900 pb-3 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" /> Skills & Summary
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                        Professional Summary
                      </label>
                      <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="A brief bio summarizing your engineering focus, key achievements, and target titles."
                        rows={5}
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none resize-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-500 mb-1.5 uppercase tracking-wider">
                        Technical Skills (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        placeholder="React, Next.js, Node.js, Python, AWS, MongoDB"
                        className="w-full bg-neutral-950 border border-neutral-850 focus:border-indigo-500/40 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                      />
                      
                      {/* Interactive Visual Tags */}
                      {skillsText.trim().length > 0 && (
                        <div className="mt-3">
                          <label className="block text-[10px] font-semibold text-neutral-600 uppercase tracking-widest mb-1.5">
                            Active Skills Tags Preview
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0).map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] px-2.5 py-1 rounded-full font-medium shadow-sm transition-all hover:bg-indigo-500/20"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons embedded inside form container */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-900 mt-6 relative z-10">
                <Link 
                  href="/dashboard"
                  className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-700 text-white text-xs font-semibold px-5 py-3 rounded-xl transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Tab Settings
                    </>
                  )}
                </button>
              </div>

            </div>

          </form>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-900 py-6 px-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-600 bg-neutral-950/40 relative z-10">
        <span>© 2026 NexusAI. Live Mongo sync protocol.</span>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
