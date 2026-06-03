import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * Creates a clean, professional, ATS-optimized DOCX (Word Document) resume.
 * @param {object} resumeData - Structured resume details
 * @param {string} outputPath - Local path to write the DOCX file
 * @returns {Promise<void>}
 */
export const generateDocxFromData = async (resumeData, outputPath) => {
  try {
    const { personalInfo = {}, jobTitle = '', summary = '', experience = [], projects = [], skills = [] } = resumeData;

    // Helper for creating section dividers
    const createSectionHeader = (title) => {
      return new Paragraph({
        spacing: { before: 240, after: 120 },
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            font: 'Arial',
            color: '003366' // Dark blue accents
          })
        ]
      });
    };

    const docChildren = [
      // 1. Applicant Header (Centered name & contact info)
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: personalInfo.name || 'Developer Name',
            bold: true,
            size: 36, // 18pt
            font: 'Arial'
          })
        ]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: `${personalInfo.email || ''} | ${personalInfo.phone || ''} | ${personalInfo.linkedin || ''} | ${personalInfo.github || ''}`,
            size: 20, // 10pt
            font: 'Arial'
          })
        ]
      }),
      
      // Target Job Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: jobTitle.toUpperCase(),
            bold: true,
            italic: true,
            size: 24,
            font: 'Arial',
            color: '555555'
          })
        ]
      }),

      // 2. Professional Summary Section
      createSectionHeader('Professional Summary'),
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: summary || 'Results-oriented software developer with experience building web applications.',
            size: 22, // 11pt
            font: 'Arial'
          })
        ]
      }),

      // 3. Technical Skills Section
      createSectionHeader('Technical Skills'),
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: skills.join(', '),
            size: 22,
            font: 'Arial'
          })
        ]
      })
    ];

    // 4. Experience Section
    if (experience.length > 0) {
      docChildren.push(createSectionHeader('Professional Experience'));

      experience.forEach(exp => {
        // Company & Role Line
        docChildren.push(new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `${exp.role || 'Software Engineer'} `,
              bold: true,
              size: 22,
              font: 'Arial'
            }),
            new TextRun({
              text: `- ${exp.company || 'Company'} `,
              italic: true,
              size: 22,
              font: 'Arial'
            }),
            new TextRun({
              text: `(${exp.startDate || ''} - ${exp.endDate || ''})`,
              size: 22,
              font: 'Arial'
            })
          ]
        }));

        // Highlights Bullet points
        if (exp.highlights && exp.highlights.length > 0) {
          exp.highlights.forEach(bullet => {
            docChildren.push(new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 22,
                  font: 'Arial'
                })
              ]
            }));
          });
        }
      });
    }

    // 5. Projects Section
    if (projects.length > 0) {
      docChildren.push(createSectionHeader('Key Projects'));

      projects.forEach(project => {
        docChildren.push(new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({
              text: `${project.title || 'Project'} `,
              bold: true,
              size: 22,
              font: 'Arial'
            }),
            new TextRun({
              text: `| Technologies: ${project.technologies ? project.technologies.join(', ') : ''}`,
              italic: true,
              size: 20,
              font: 'Arial',
              color: '666666'
            })
          ]
        }));

        docChildren.push(new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: project.description || 'Developed interactive web applications.',
              size: 22,
              font: 'Arial'
            })
          ]
        }));
      });
    }

    // Build the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: docChildren
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);

  } catch (error) {
    console.error('[DOCX Service Error]:', error);
    throw new Error(`Failed to compile DOCX document: ${error.message}`);
  }
};
