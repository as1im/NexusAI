import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'DUMMY_KEY_FOR_DEV_INITIALIZATION'
});

const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Extracts list of technical keywords, required skills, and tools from a Job Description.
 * @param {string} jobDescription - Targeted job description
 * @returns {Promise<string[]>} List of lowercase keywords
 */
export const extractKeywordsFromJd = async (jobDescription) => {
  if (!process.env.GEMINI_API_KEY) {
    // Fallback if API key is not configured
    return ['javascript', 'react', 'node.js', 'html', 'css', 'git'];
  }

  const prompt = `
    Analyze the following Job Description and extract a list of core technical keywords, required skills, frameworks, tools, databases, and methodologies.
    Return ONLY a JSON array of strings in lowercase. Do not return any other text.
    
    Job Description:
    """
    ${jobDescription}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const keywords = JSON.parse(response.text);
    return Array.isArray(keywords) ? keywords.map(kw => kw.toLowerCase()) : [];
  } catch (error) {
    console.error('[ATS Service - extractKeywordsFromJd Error]:', error);
    // Return standard fallback keywords
    return ['javascript', 'react', 'node.js', 'git', 'api', 'html', 'css', 'typescript'];
  }
};

/**
 * Analyzes a resume against extracted job description keywords and calculates the ATS score.
 * @param {object} resumeData - Structured Resume data (skills, experience, projects, summary)
 * @param {string[]} jdKeywords - List of keywords extracted from Job Description
 * @returns {object} Analysis result containing score, matched keywords, and missing keywords
 */
export const analyzeAtsScore = (resumeData, jdKeywords = []) => {
  if (!jdKeywords || jdKeywords.length === 0) {
    return {
      score: 100,
      matched: [],
      missing: []
    };
  }

  // Compile all resume text to perform text search matches
  const skillsText = (resumeData.skills || []).join(' ').toLowerCase();
  const summaryText = (resumeData.summary || '').toLowerCase();
  const experienceText = (resumeData.experience || []).map(exp => 
    `${exp.company} ${exp.role} ${exp.description || ''} ${(exp.highlights || []).join(' ')}`
  ).join(' ').toLowerCase();
  const projectsText = (resumeData.projects || []).map(proj => 
    `${proj.title} ${proj.description || ''} ${(proj.technologies || []).join(' ')}`
  ).join(' ').toLowerCase();

  const fullResumeText = `${skillsText} ${summaryText} ${experienceText} ${projectsText}`;

  const matched = [];
  const missing = [];

  // Match each keyword
  jdKeywords.forEach(keyword => {
    const kw = keyword.toLowerCase().trim();
    if (!kw) return;
    
    // Exact or partial word boundary match helper
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'i');
    
    if (regex.test(fullResumeText) || fullResumeText.includes(kw)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const matchedCount = matched.length;
  const totalCount = jdKeywords.length;
  const score = totalCount > 0 ? Math.round((matchedCount / totalCount) * 100) : 0;

  return {
    score,
    matched,
    missing
  };
};
