# Product Requirement Document (PRD) - NexusAI

NexusAI is an AI-powered ATS Resume Generator that automatically creates ATS-optimized resumes and cover letters for developers using data extracted from GitHub profiles, LinkedIn PDF exports, and targeted job descriptions.

---

## 1. Project Overview

### 1.1 Objective
Empower software developers and job seekers to build highly targeted, professional, and Applicant Tracking System (ATS) optimized resumes automatically, saving time and increasing job-application success rates.

### 1.2 Problem Statement
- **ATS Filter Failure**: Resumes are rejected by automated ATS parsers due to formatting errors or keyword gaps before a human recruiter even reviews them.
- **Under-Represented GitHub Contributions**: Developers struggle to effectively translate code contributions, repositories, stars, and languages into readable bullet points.
- **Inefficient Personalization**: Tailoring resumes and writing matching cover letters manually for every job application is tedious and time-consuming.

---

## 2. Core Features

### 2.1 GitHub Profile Integration & Parsing
- **Input**: GitHub Profile URL (e.g., `https://github.com/username`).
- **Processing**: Calls GitHub REST API v3 to retrieve repositories, stars, forks, commit activity, language metrics, and repository READMEs.
- **Output**: Structured developer metadata ready for resume bullet generation.

### 2.2 LinkedIn PDF Parsing
- **Input**: Uploaded LinkedIn profile export in PDF format.
- **Processing**: 
  - Parse raw text from PDF using `pdf-parse`.
  - Pass unstructured text to Gemini AI to structure into JSON (experience, education, skills, certifications, personal info).
- **Output**: JSON representation of professional history.

### 2.3 Job Description (JD) Analyzer
- **Input**: Copied job description text.
- **Processing**: Gemini AI identifies key technologies, soft skills, required qualifications, and core role responsibilities.
- **Output**: Extracted list of target keywords and required experience metrics.

### 2.4 Resume & Cover Letter Generator
- **Processing**:
  - Perform keyword gap analysis between developer profile (GitHub + LinkedIn) and Job Description.
  - Gemini AI compiles data, matches projects to the job description, and writes optimized resume sections (Summary, Experience, Projects, Skills) integrating key ATS terms.
  - Gemini AI writes a professional cover letter highlighting relevant project matching.
- **Output**: ATS-tailored resume draft (JSON format) and Cover Letter text.

### 2.5 ATS Score Calculation & Keyword Gap Analysis
- **Formula**: `ATS Score = (Matched Keywords / Total Keywords) * 100`
- **Output**: Visual comparison of ATS compatibility score "Before" vs "After" optimization, with a detailed list of missing and matched keywords.

### 2.6 Export System
- **PDF Export**: Generate single-column, clean, semantic PDF documents using Puppeteer.
- **DOCX Export**: Generate editable Word documents matching standard resume layouts using the `docx` library.
- **Upload & Storage**: Generated files are stored temporarily on Cloudinary and returned to the user via download links.

---

## 3. Target Audience
- Software Developers, Tech Leads, and Engineering Managers.
- Freshers, students, and job seekers aiming for tech roles.

---

## 4. Non-Functional & Technical Requirements
- **Performance**: High-speed AI responses with real-time UI step indicators.
- **UX/UI**: Modern, premium dark mode design with micro-animations and intuitive wizard steps.
- **Security**: NextAuth secure authentication, secure file upload middleware, and express rate limits to protect APIs.
