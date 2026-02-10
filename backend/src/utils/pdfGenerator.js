const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateCertificatePDF = async (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const fileName = `${certificateData.employeeName.replace(/\s+/g, '_')}_${certificateData.certificateType === 'offer' ? 'OfferLetter' : 'Certificate'}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../../uploads', fileName);
      
      const uploadsDir = path.dirname(filePath);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.font('Helvetica');

      // Check if it's an offer letter or regular certificate
      if (certificateData.certificateType === 'offer') {
        // Generate Offer Letter
        generateOfferLetter(doc, certificateData);
      } else {
        // Generate Regular Certificate
        generateRegularCertificate(doc, certificateData);
      }

      // Finalize the PDF
      doc.end();

      stream.on('finish', () => {
        resolve({
          fileName,
          filePath,
          success: true
        });
      });

      stream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
};

const generateOfferLetter = (doc, certificateData) => {
  // Company Letterhead Section
  let currentY = 50;

  // Company Logo (if uploaded)
  if (certificateData.companyLogoPath && fs.existsSync(certificateData.companyLogoPath)) {
    doc.image(certificateData.companyLogoPath, 50, currentY, { width: 60 });
    currentY += 70;
  } else {
    // Placeholder for logo
    doc.strokeColor('#000000').lineWidth(1);
    doc.rect(50, currentY, 60, 60).stroke();
    doc.fontSize(8).fillColor('#666666');
    doc.text('LOGO', 65, currentY + 20, { width: 30, align: 'center' });
    currentY += 70;
  }

  // Company Details
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000');
  doc.text(certificateData.companyName || 'AXTRI SOFTWARE SERVICES PRIVATE LIMITED', 120, currentY - 60);
  
  doc.fontSize(9).font('Helvetica').fillColor('#333333');
  doc.text(`CIN: ${certificateData.companyCIN || 'U62013MH2025PTC448010'}`, 120, currentY - 45);
  doc.text(`${certificateData.companyContact || '+91-9001573639'} | ${certificateData.companyEmail || 'hello@axtri.in'} | ${certificateData.companyWebsite || 'www.axtri.in'}`, 120, currentY - 35);

  // Registered Office (Right aligned)
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000');
  doc.text('REGISTERED OFFICE:', 350, currentY - 60, { align: 'right' });
  doc.fontSize(8).font('Helvetica').fillColor('#333333');
  const registeredOffice = certificateData.companyRegisteredOffice || 'SH/806 Sanghvi Complex, Marvel Cts Ltd., Naya Ng, Miss Road, Thane- 401107, Maharashtra';
  doc.text(registeredOffice, 350, currentY - 50, { align: 'right', width: 200 });

  // Horizontal line after letterhead
  currentY += 20;
  doc.strokeColor('#000000').lineWidth(1);
  doc.moveTo(50, currentY).lineTo(550, currentY).stroke();

  // Date
  currentY += 20;
  doc.fontSize(11).font('Helvetica').fillColor('#000000');
  const offerDate = certificateData.offerDate || new Date();
  doc.text(offerDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }).toUpperCase(), 450, currentY, { align: 'right' });

  // Recipient Details
  currentY += 30;
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000');
  doc.text('To,', 50, currentY);
  
  currentY += 15;
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000');
  doc.text(certificateData.employeeName || 'Candidate Name', 50, currentY);
  
  if (certificateData.employeeEmail) {
    currentY += 12;
    doc.fontSize(10).font('Helvetica').fillColor('#333333');
    doc.text(`Email: ${certificateData.employeeEmail}`, 50, currentY);
  }

  // Subject
  currentY += 25;
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000');
  doc.text('Subject: Offer of Employment', 50, currentY);

  // Salutation
  currentY += 20;
  doc.fontSize(11).font('Helvetica').fillColor('#000000');
  doc.text('Dear ' + (certificateData.employeeName || 'Candidate'), 50, currentY);

  // Main Content
  currentY += 20;
  doc.fontSize(11).font('Helvetica').fillColor('#000000');
  
  const offerText = `We are pleased to offer you the position of ${certificateData.position || 'Data Analyst Intern'} at ${certificateData.companyName || 'Axtri Software Services Pvt. Ltd.'} for a duration of ${certificateData.duration || '6 Months'} with a joining date of ${certificateData.joiningDate ? new Date(certificateData.joiningDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '1 Dec 2025'} and a salary of ${certificateData.salary || '₹120000 per year'}.`;
  
  // Split long text into multiple lines
  const lines = doc.widthOfString(offerText, { fontSize: 11 }) > 450 ? offerText.match(/.{1,45}/g) : [offerText];
  lines.forEach((line, index) => {
    doc.text(line, 50, currentY + (index * 15));
  });
  
  currentY += (lines.length * 15) + 20;

  doc.text('Further details will be shared upon onboarding. We request your confirmation of acceptance.', 50, currentY);

  // Closing
  currentY += 30;
  doc.text('Regards', 50, currentY);

  // Signature Section
  currentY += 30;
  
  // Signature Image (if uploaded)
  if (certificateData.signaturePath && fs.existsSync(certificateData.signaturePath)) {
    doc.image(certificateData.signaturePath, 50, currentY, { width: 80 });
  } else {
    // Placeholder for signature
    doc.strokeColor('#000000').lineWidth(1);
    doc.moveTo(50, currentY + 40).lineTo(150, currentY + 40).stroke();
  }

  // Signatory Details
  currentY += 45;
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000');
  doc.text(certificateData.signatoryName || 'Jitendra Kumar', 50, currentY);
  
  currentY += 12;
  doc.fontSize(10).font('Helvetica').fillColor('#333333');
  doc.text('Authorized Signatory', 50, currentY);
  doc.text(`For ${certificateData.companyName || 'Axtri Software Services Pvt. Ltd.'}`, 50, currentY + 10);

  // Footer
  currentY = doc.page.height - 80;
  doc.strokeColor('#000000').lineWidth(1);
  doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
  
  currentY += 10;
  doc.fontSize(8).font('Helvetica').fillColor('#666666');
  doc.text(certificateData.companyName || 'Axtri Software Services Pvt. Ltd.', 50, currentY);
  doc.text(registeredOffice, 50, currentY + 8);
  doc.text(`${certificateData.companyContact || '+91-9001573639'} | ${certificateData.companyEmail || 'hello@axtri.in'}`, 50, currentY + 16);
};

const generateRegularCertificate = (doc, certificateData) => {
  // Generate simple serial number
  const serialNumber = `CERT-${Date.now().toString(36).toUpperCase()}`;

  // Simple border
  doc.strokeColor('#000000').lineWidth(1);
  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke();

  // Serial number at top
  doc.fontSize(10).fillColor('#000000');
  doc.text(`Serial No: ${serialNumber}`, 50, 50);

  // Title
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#000000');
  doc.text('CERTIFICATE', { align: 'center' });

  // Certificate type
  doc.fontSize(16).font('Helvetica').fillColor('#000000');
  const certificateTypeText = certificateData.certificateType.charAt(0).toUpperCase() + certificateData.certificateType.slice(1);
  doc.text(`OF ${certificateTypeText.toUpperCase()}`, { align: 'center' });

  doc.moveDown(2);

  // Main content
  doc.fontSize(12).font('Helvetica').fillColor('#000000');
  doc.text('This is to certify that', { align: 'center' });

  doc.moveDown(1);

  // Employee name
  doc.fontSize(18).font('Helvetica-Bold').fillColor('#000000');
  doc.text(certificateData.employeeName, { align: 'center' });

  doc.moveDown(1);

  doc.fontSize(12).font('Helvetica').fillColor('#000000');
  doc.text(`has worked with ${certificateData.companyName} as`, { align: 'center' });

  doc.moveDown(0.5);

  // Designation
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#000000');
  doc.text(certificateData.designation, { align: 'center' });

  doc.moveDown(0.5);

  // Duration
  doc.fontSize(12).font('Helvetica').fillColor('#000000');
  const startDate = new Date(certificateData.startDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const endDate = new Date(certificateData.endDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`from ${startDate} to ${endDate}`, { align: 'center' });

  doc.moveDown(1);

  // Additional details if provided
  if (certificateData.additionalDetails) {
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text(certificateData.additionalDetails, { align: 'center' });
    doc.moveDown(1);
  }

  // Reason if provided
  if (certificateData.reason) {
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text(`Purpose: ${certificateData.reason}`, { align: 'center' });
    doc.moveDown(1);
  }

  doc.moveDown(2);

  // Company details
  if (certificateData.companyAddress) {
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text(certificateData.companyAddress, { align: 'center' });
    doc.moveDown(0.5);
  }

  // Date of issue
  doc.fontSize(11).font('Helvetica').fillColor('#000000');
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Date of Issue: ${currentDate}`, { align: 'center' });

  // Signature lines
  doc.moveDown(3);
  
  doc.strokeColor('#000000').lineWidth(1);
  
  // Left signature line
  const signatureY = doc.y;
  doc.moveTo(100, signatureY).lineTo(250, signatureY).stroke();
  doc.fontSize(10).font('Helvetica').fillColor('#000000');
  doc.text('Authorized Signature', 100, signatureY + 5, { width: 150, align: 'center' });

  // Right signature line
  doc.moveTo(350, signatureY).lineTo(500, signatureY).stroke();
  doc.text('Company Seal', 350, signatureY + 5, { width: 150, align: 'center' });

  // Footer
  doc.fontSize(9).font('Helvetica').fillColor('#666666');
  doc.text('This certificate is generated electronically', { align: 'center' });
};

module.exports = { generateCertificatePDF };
