import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Google Gen AI client
// It will automatically use the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Uses Gemini to parse raw text (from LinkedIn) into structured JSON profile schema.
 * @param {string} rawText - Unstructured text from LinkedIn PDF
 * @returns {Promise<object>} Structured JSON profile
 */
export const structureProfile = async (rawText) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined. AI operations are unavailable.');
  }

  const prompt = `
    You are an expert AI parser. Analyze the following unstructured text from a LinkedIn PDF profile export.
    Extract the information and structure it into a clean, standard JSON format.
    
    The resulting JSON must match this structure exactly:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "website": "",
        "linkedin": "",
        "github": ""
      },
      "experience": [
        {
          "company": "",
          "role": "",
          "startDate": "",
          "endDate": "",
          "description": "",
          "highlights": ["bullet point 1", "bullet point 2"]
        }
      ],
      "education": [
        {
          "school": "",
          "degree": "",
          "fieldOfStudy": "",
          "startDate": "",
          "endDate": ""
        }
      ],
      "skills": ["skill1", "skill2", "skill3"],
      "certifications": ["cert1", "cert2"]
    }

    Ensure dates are formatted cleanly (e.g., "Jan 2022" or "Present"). If some details are missing, leave them as empty strings or empty arrays. Do not invent details.
    
    Unstructured Text:
    """
    ${rawText}
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

    const parsedJson = JSON.parse(response.text);
    return parsedJson;
  } catch (error) {
    console.error('[Gemini Service - structureProfile Error]:', error);
    throw new Error(`Failed to structure profile using Gemini AI: ${error.message}`);
  }
};

/**
 * Optimizes a user profile against a specific Job Description to generate tailored resume content
 * @param {object} profile - Structured profile data (GitHub + LinkedIn details combined)
 * @param {string} jobDescription - Targeted job description
 * @returns {Promise<object>} Tailored Resume data containing optimized summary, experience bullets, and projects
 */
export const generateTailoredResume = async (profile, jobDescription) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined. AI operations are unavailable.');
  }

  const prompt = `
    You are an expert ATS Resume Coach and writer. Your job is to optimize the developer's profile to align perfectly with the target Job Description.
    Integrate key terms, required technologies, and matching projects naturally while maintaining absolute truth and accuracy (do not invent experiences the developer doesn't have, but highlight matching aspects).
    
    The resulting JSON must match this structure exactly:
    {
      "personalInfo": {
        "name": "",
        "email": "",
        "phone": "",
        "website": "",
        "linkedin": "",
        "github": ""
      },
      "jobTitle": "Target job title matching the role",
      "summary": "Vibrant, metrics-driven professional summary optimized for the job description.",
      "experience": [
        {
          "company": "",
          "role": "",
          "startDate": "",
          "endDate": "",
          "description": "Short overview of role",
          "highlights": [
            "Tailored high-impact accomplishment statement starting with strong action verbs and including metrics where possible, embedding relevant ATS keywords.",
            "Another tailored highlight bullet point."
          ]
        }
      ],
      "projects": [
        {
          "title": "",
          "description": "Optimized project description showcasing the skills, libraries, and design patterns requested in the Job Description.",
          "technologies": ["React", "Express"],
          "url": "",
          "stars": 0
        }
      ],
      "skills": ["SkillA", "SkillB", "SkillC"],
      "atsScore": 85
    }

    Developer Profile Data:
    ${JSON.stringify(profile, null, 2)}

    Target Job Description:
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

    const parsedJson = JSON.parse(response.text);
    return parsedJson;
  } catch (error) {
    console.error('[Gemini Service - generateTailoredResume Error]:', error);
    throw new Error(`Failed to generate optimized resume: ${error.message}`);
  }
};

/**
 * Generates a tailored Cover Letter based on developer resume data and job description.
 * @param {object} resume - Tailored resume JSON
 * @param {string} jobDescription - Targeted job description
 * @returns {Promise<string>} Plaintext or markdown-formatted Cover Letter
 */
export const generateCoverLetter = async (resume, jobDescription) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined. AI operations are unavailable.');
  }

  const prompt = `
    Write a modern, elegant, and persuasive Cover Letter matching the developer's resume to the target Job Description.
    Highlight:
    1. Key projects from GitHub that demonstrate specific tech stacks mentioned in the JD.
    2. Professional summary and why the developer is a perfect cultural and technical fit.
    3. Action-oriented tone, keeping it under 400 words.

    Optimized Resume:
    ${JSON.stringify(resume, null, 2)}

    Target Job Description:
    """
    ${jobDescription}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt
    });

    return response.text;
  } catch (error) {
    console.error('[Gemini Service - generateCoverLetter Error]:', error);
    throw new Error(`Failed to generate cover letter: ${error.message}`);
  }
};
