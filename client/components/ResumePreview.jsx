'use client';

import React from 'react';
import { Mail, Phone, Link, Github, Linkedin, Briefcase, Code, GraduationCap } from 'lucide-react';

export default function ResumePreview({ resume = {} }) {
  const { personalInfo = {}, jobTitle = 'Software Engineer', summary = '', experience = [], projects = [], skills = [] } = resume;

  return (
    <div className="w-full bg-white text-neutral-800 rounded-3xl p-8 shadow-2xl border border-neutral-200 overflow-hidden font-sans select-text">
      
      {/* 1. Header (Centered Name and contact) */}
      <div className="text-center border-b border-neutral-200 pb-6 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1 uppercase">
          {personalInfo.name || 'Your Full Name'}
        </h2>
        <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">
          {jobTitle}
        </div>
        
        {/* Contact list info */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-neutral-500">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
              <Link className="w-3.5 h-3.5 text-neutral-400" />
              Portfolio
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
              <Github className="w-3.5 h-3.5 text-neutral-400" />
              GitHub
            </a>
          )}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
              <Linkedin className="w-3.5 h-3.5 text-neutral-400" />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* 2. Professional Summary */}
      {summary && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-neutral-100 pb-1 mb-2">
            Professional Summary
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed text-justify">
            {summary}
          </p>
        </div>
      )}

      {/* 3. Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-neutral-100 pb-1 mb-2">
            Technical Skills
          </h3>
          <div className="flex flex-wrap gap-x-2 gap-y-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Professional Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-neutral-100 pb-1 mb-3 flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
            Professional Experience
          </h3>
          
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between font-semibold text-neutral-900 mb-0.5">
                  <span>{exp.role || 'Software Developer'}</span>
                  <span className="text-[10px] text-neutral-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="italic text-neutral-500 mb-1.5">{exp.company || 'Company Name'}</div>
                
                {exp.description && (
                  <p className="text-neutral-600 mb-1.5 leading-relaxed text-justify">{exp.description}</p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600">
                    {exp.highlights.map((bullet, bIdx) => (
                      <li key={bIdx} className="leading-relaxed text-justify">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-neutral-100 pb-1 mb-3 flex items-center gap-1">
            <Code className="w-3.5 h-3.5 text-neutral-400" />
            Key Projects
          </h3>
          
          <div className="space-y-3.5">
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center justify-between font-semibold text-neutral-900 mb-1">
                  <span>{proj.title} {proj.stars > 0 && <span className="font-normal text-neutral-400">({proj.stars} ★)</span>}</span>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 font-normal hover:underline">
                      View Repository
                    </a>
                  )}
                </div>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[10px] text-neutral-500 font-semibold mb-1 uppercase tracking-wider">
                    Tech: {proj.technologies.join(', ')}
                  </div>
                )}
                <p className="text-neutral-600 leading-relaxed text-justify">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
