ATS Resume Generator - Project Context
Project Overview

ATS Resume Generator is an AI-powered web application that automatically creates ATS-optimized resumes for developers.

The user provides:

GitHub Profile URL
LinkedIn PDF Export
Job Description

The system extracts information from GitHub and LinkedIn, analyzes the job description, generates an ATS-friendly resume using Gemini AI, calculates ATS scores, and exports PDF and DOCX files.

Problem Statement

Most developers face three major issues:

ATS systems reject resumes before recruiters see them.
GitHub projects and contributions are not properly showcased.
Tailoring resumes for each job application is time-consuming.

The project solves these problems by automatically generating job-specific resumes.

Core Features
1. GitHub Data Extraction

Extract:

Repositories
Languages
Stars
Forks
Commit counts
README content

Source:

GitHub REST API v3
2. LinkedIn PDF Parsing

Extract:

Personal information
Experience
Education
Skills
Certifications

Process:

PDF uploaded
Text extracted using pdf-parse
Gemini converts text into structured JSON
3. Job Description Analysis

Extract:

ATS keywords
Required skills
Technologies
Role requirements

Process:

User pastes job description
Gemini extracts keywords
System performs keyword gap analysis
4. Resume Generation

Gemini AI generates:

Professional summary
Experience section
Project section
Skills section
ATS keywords integration

Output:

Structured JSON
5. ATS Score Calculation

Formula:

ATS Score = (Matched Keywords / Total Keywords) × 100

Display:

Score Before Optimization
Score After Optimization
6. Cover Letter Generation

Generate:

Introduction
Skills Match
Closing Statement

Based on:

Resume data
Job description
7. Export System

Generate:

PDF
DOCX

Requirements:

ATS-friendly
Single-column layout
Semantic HTML

Tools:

Puppeteer
docx npm package
Target Users
Students
Freshers
Developers
Software Engineers
Job Seekers
Tech Stack
Frontend
Next.js 14
React
Tailwind CSS
React Hook Form
NextAuth
Backend
Node.js
Express.js
pdf-parse
Puppeteer
docx
express-fileupload
express-rate-limit
AI
Gemini 1.5 Flash
Database
MongoDB Atlas
Storage
Cloudinary
Deployment

Frontend:

Vercel

Backend:

Render
System Workflow

Step 1:
User enters GitHub URL

Step 2:
User uploads LinkedIn PDF

Step 3:
User pastes Job Description

Step 4:
Backend extracts GitHub data

Step 5:
Backend parses LinkedIn PDF

Step 6:
Gemini structures user profile

Step 7:
Gemini extracts ATS keywords

Step 8:
Gemini generates optimized resume

Step 9:
ATS score calculated

Step 10:
PDF and DOCX generated

Step 11:
Files uploaded to Cloudinary

Step 12:
Download links returned