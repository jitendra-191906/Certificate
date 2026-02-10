const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const LetterHistory = require('../models/LetterHistory');
const CompanyProfile = require('../models/CompanyProfile');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const path = require('path');

const router = express.Router();

// All letter routes will be protected
router.use(auth);

// Get all letters for the authenticated user
router.get('/', async (req, res) => {
  try {
    const letters = await LetterHistory.find({ userId: req.user.id })
      .sort({ generatedDate: -1 });
    
    res.json(letters);
  } catch (error) {
    console.error('Error fetching letters:', error);
    res.status(500).json({ message: 'Error fetching letters' });
  }
});

// Generate new certificate
router.post('/generate', [
  body('employeeName').notEmpty().withMessage('Employee name is required'),
  body('certificateType').isIn(['experience', 'internship', 'completion', 'appreciation', 'offer']).withMessage('Invalid certificate type'),
  body('startDate').if(body('certificateType').not().equals('offer')).notEmpty().withMessage('Start date is required').isISO8601().withMessage('Valid start date is required'),
  body('endDate').if(body('certificateType').not().equals('offer')).notEmpty().withMessage('End date is required').isISO8601().withMessage('Valid end date is required'),
  body('designation').if(body('certificateType').not().equals('offer')).notEmpty().withMessage('Designation is required'),
  body('position').if(body('certificateType').equals('offer')).notEmpty().withMessage('Position is required for offer letter'),
  body('duration').if(body('certificateType').equals('offer')).notEmpty().withMessage('Duration is required for offer letter'),
  body('joiningDate').if(body('certificateType').equals('offer')).notEmpty().withMessage('Joining date is required for offer letter').isISO8601().withMessage('Valid joining date is required'),
  body('salary').if(body('certificateType').equals('offer')).notEmpty().withMessage('Salary is required for offer letter'),
  body('companyName').optional()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    // Get company profile for additional data
    const companyProfile = await CompanyProfile.findOne({ userId: req.user.id });
    
    const certificateData = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null,
      endDate: req.body.endDate ? new Date(req.body.endDate) : null,
      joiningDate: req.body.joiningDate ? new Date(req.body.joiningDate) : null,
      offerDate: req.body.offerDate ? new Date(req.body.offerDate) : null
    };

    // Merge company profile data
    if (companyProfile) {
      certificateData.companyLogoPath = companyProfile.companyLogoPath ? path.join(__dirname, '../../uploads', companyProfile.companyLogoPath) : null;
      certificateData.companyCIN = companyProfile.companyCIN;
      certificateData.companyContact = companyProfile.companyContact;
      certificateData.companyEmail = companyProfile.companyEmail;
      certificateData.companyWebsite = companyProfile.companyWebsite;
      certificateData.companyRegisteredOffice = companyProfile.companyRegisteredOffice;
      certificateData.signaturePath = companyProfile.signaturePath ? path.join(__dirname, '../../uploads', companyProfile.signaturePath) : null;
      certificateData.signatoryName = companyProfile.signatoryName;
      
      // Use company profile name if not provided in request
      if (!certificateData.companyName) {
        certificateData.companyName = companyProfile.companyName;
      }
    }

    // Generate PDF
    const pdfResult = await generateCertificatePDF(certificateData);
    
    if (!pdfResult.success) {
      return res.status(500).json({ message: 'Failed to generate PDF' });
    }

    // Generate serial number for regular certificates
    const serialNumber = certificateData.certificateType === 'offer' ? `OFFER-${Date.now().toString(36).toUpperCase()}` : `CERT-${Date.now().toString(36).toUpperCase()}`;

    // Save to database
    const letterHistory = new LetterHistory({
      userId: req.user.id,
      employeeName: certificateData.employeeName,
      employeeEmail: certificateData.employeeEmail || '',
      employeeId: certificateData.employeeId || '',
      position: certificateData.position || '',
      duration: certificateData.duration || '',
      joiningDate: certificateData.joiningDate || null,
      salary: certificateData.salary || '',
      offerDate: certificateData.offerDate || null,
      signatoryName: certificateData.signatoryName || '',
      designation: certificateData.designation || '',
      letterType: certificateData.certificateType,
      startDate: certificateData.startDate || null,
      endDate: certificateData.endDate || null,
      companyName: certificateData.companyName,
      companyAddress: certificateData.companyAddress || '',
      companyLogoPath: certificateData.companyLogoPath || '',
      companyCIN: certificateData.companyCIN || '',
      companyContact: certificateData.companyContact || '',
      companyEmail: certificateData.companyEmail || '',
      companyWebsite: certificateData.companyWebsite || '',
      companyRegisteredOffice: certificateData.companyRegisteredOffice || '',
      signaturePath: certificateData.signaturePath || '',
      reason: certificateData.reason || '',
      additionalDetails: certificateData.additionalDetails || '',
      pdfFilePath: pdfResult.fileName,
      serialNumber: serialNumber
    });

    await letterHistory.save();

    // Send the PDF file
    const filePath = path.join(__dirname, '../../uploads', pdfResult.fileName);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading certificate' });
        }
      }
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Error generating certificate' });
  }
});

// Download specific certificate
router.get('/download/:id', async (req, res) => {
  try {
    const letter = await LetterHistory.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!letter) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const filePath = path.join(__dirname, '../../uploads', letter.pdfFilePath);
    res.download(filePath, `${letter.employeeName.replace(/\s+/g, '_')}_certificate.pdf`, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error downloading certificate' });
        }
      }
    });

  } catch (error) {
    console.error('Error downloading certificate:', error);
    res.status(500).json({ message: 'Error downloading certificate' });
  }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
  try {
    const letter = await LetterHistory.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!letter) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Delete file from filesystem
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../uploads', letter.pdfFilePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await LetterHistory.findByIdAndDelete(req.params.id);

    res.json({ message: 'Certificate deleted successfully' });

  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ message: 'Error deleting certificate' });
  }
});

module.exports = router;
