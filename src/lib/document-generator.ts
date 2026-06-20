import { Document, Paragraph, TextRun, Packer, AlignmentType, BorderStyle } from 'docx';
import type { StructuredResume } from './types';

export async function generateDOCX(resumeData: StructuredResume, templateId: string): Promise<Buffer> {
  const children: Paragraph[] = [];

  // ─── Helper: Section heading with bottom border ───
  const sectionHeading = (text: string) =>
    new Paragraph({
      children: [
        new TextRun({ text: text.toUpperCase(), bold: true, size: 22, font: 'Calibri' }),
      ],
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: '999999' },
      },
    });

  // ─── Header: Name ───
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: resumeData.contactInfo?.name || 'Your Name',
          bold: true,
          size: 44,
          font: 'Calibri',
        }),
      ],
      spacing: { after: 40 },
    })
  );

  // ─── Header: Title ───
  if (resumeData.contactInfo?.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: resumeData.contactInfo.title,
            size: 24,
            color: '555555',
            font: 'Calibri',
          }),
        ],
        spacing: { after: 40 },
      })
    );
  }

  // ─── Header: Contact line ───
  const contactParts = [];
  if (resumeData.contactInfo?.email) contactParts.push(resumeData.contactInfo.email);
  if (resumeData.contactInfo?.phone) contactParts.push(resumeData.contactInfo.phone);
  if (resumeData.contactInfo?.location) contactParts.push(resumeData.contactInfo.location);
  if (resumeData.contactInfo?.linkedin) contactParts.push(resumeData.contactInfo.linkedin);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18,
            font: 'Calibri',
            color: '444444',
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // ─── Summary ───
  if (resumeData.summary) {
    children.push(sectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resumeData.summary, size: 20, font: 'Calibri' })],
        spacing: { after: 120 },
      })
    );
  }

  // ─── Experience ───
  if (resumeData.experience && resumeData.experience.length > 0) {
    children.push(sectionHeading('Experience'));

    resumeData.experience.forEach((exp) => {
      // Title | Company    Dates (right-aligned using tab stop)
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true, size: 22, font: 'Calibri' }),
            new TextRun({ text: ` | ${exp.company}`, italics: true, size: 22, font: 'Calibri' }),
          ],
          spacing: { before: 80 },
        })
      );

      // Date range + optional location
      const dateLine = `${exp.startDate} – ${exp.endDate}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: dateLine, size: 18, color: '666666', font: 'Calibri' }),
            ...(exp.location ? [new TextRun({ text: `  •  ${exp.location}`, size: 18, color: '666666', font: 'Calibri' })] : []),
          ],
          spacing: { after: 40 },
        })
      );

      // Bullets
      exp.bullets.forEach((bullet) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: bullet, size: 20, font: 'Calibri' })],
            spacing: { after: 20 },
          })
        );
      });
    });
  }

  // ─── Education ───
  if (resumeData.education && resumeData.education.length > 0) {
    children.push(sectionHeading('Education'));

    resumeData.education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.institution, bold: true, size: 22, font: 'Calibri' }),
          ],
          spacing: { before: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, size: 20, font: 'Calibri', italics: true }),
          ],
        })
      );
      const eduDetails: TextRun[] = [];
      if (edu.graduationDate) {
        eduDetails.push(new TextRun({ text: edu.graduationDate, size: 18, color: '666666', font: 'Calibri' }));
      }
      if (edu.gpa) {
        eduDetails.push(new TextRun({ text: `${edu.graduationDate ? '  •  ' : ''}GPA: ${edu.gpa}`, size: 18, color: '666666', font: 'Calibri' }));
      }
      if (eduDetails.length > 0) {
        children.push(
          new Paragraph({
            children: eduDetails,
            spacing: { after: 40 },
          })
        );
      }
    });
  }

  // ─── Skills ───
  if (resumeData.skills && resumeData.skills.length > 0) {
    children.push(sectionHeading('Skills'));

    resumeData.skills.forEach((skill) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${skill.category}: `, bold: true, size: 20, font: 'Calibri' }),
            new TextRun({ text: skill.items.join(', '), size: 20, font: 'Calibri' }),
          ],
          spacing: { after: 20 },
        })
      );
    });
  }

  // ─── Projects ───
  if (resumeData.projects && resumeData.projects.length > 0) {
    children.push(sectionHeading('Projects'));

    resumeData.projects.forEach((project) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.name, bold: true, size: 22, font: 'Calibri' }),
          ],
          spacing: { before: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.description, size: 20, font: 'Calibri' }),
          ],
          spacing: { after: 20 },
        })
      );
      if (project.tech && project.tech.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: 18, font: 'Calibri', color: '555555' }),
              new TextRun({ text: project.tech.join(', '), size: 18, font: 'Calibri', color: '555555' }),
            ],
            spacing: { after: 40 },
          })
        );
      }
    });
  }

  // ─── Certifications ───
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    children.push(sectionHeading('Certifications'));

    resumeData.certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 20, font: 'Calibri' }),
            ...(cert.issuer ? [new TextRun({ text: ` — ${cert.issuer}`, size: 20, font: 'Calibri', color: '555555' })] : []),
            ...(cert.date ? [new TextRun({ text: `  (${cert.date})`, size: 18, font: 'Calibri', color: '666666' })] : []),
          ],
          spacing: { after: 20 },
        })
      );
    });
  }

  // ─── Build document ───
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,    // 0.5 inch
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
