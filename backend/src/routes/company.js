const express = require('express');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const CompanyProfile = require('../models/CompanyProfile');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
    }
  }
});

// All company routes will be protected
router.use(auth);

// Get company profile
router.get('/', async (req, res) => {
  try {
    const companyProfile = await CompanyProfile.findOne({ userId: req.user.id });
    
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    res.json(companyProfile);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Error fetching company profile' });
  }
});

// Create or update company profile
router.post('/', upload.fields([
  { name: 'companyLogo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), [
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('companyCIN').optional().trim(),
  body('companyContact').optional().trim(),
  body('companyEmail').optional().isEmail().withMessage('Valid email is required'),
  body('companyWebsite').optional().trim(),
  body('companyRegisteredOffice').optional().trim(),
  body('signatoryName').optional().trim(),
  body('signatoryDesignation').optional().trim()
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

    const profileData = {
      userId: req.user.id,
      companyName: req.body.companyName,
      companyCIN: req.body.companyCIN || '',
      companyContact: req.body.companyContact || '',
      companyEmail: req.body.companyEmail || '',
      companyWebsite: req.body.companyWebsite || '',
      companyRegisteredOffice: req.body.companyRegisteredOffice || '',
      signatoryName: req.body.signatoryName || '',
      signatoryDesignation: req.body.signatoryDesignation || ''
    };

    // Add file paths if uploaded
    if (req.files && req.files.companyLogo) {
      profileData.companyLogoPath = req.files.companyLogo[0].filename;
    }
    if (req.files && req.files.signature) {
      profileData.signaturePath = req.files.signature[0].filename;
    }

    // Check if profile exists and update or create
    const existingProfile = await CompanyProfile.findOne({ userId: req.user.id });
    
    let companyProfile;
    if (existingProfile) {
      // Delete old files if new ones are uploaded
      if (profileData.companyLogoPath && existingProfile.companyLogoPath) {
        const oldLogoPath = path.join(__dirname, '../../uploads', existingProfile.companyLogoPath);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      if (profileData.signaturePath && existingProfile.signaturePath) {
        const oldSignaturePath = path.join(__dirname, '../../uploads', existingProfile.signaturePath);
        if (fs.existsSync(oldSignaturePath)) {
          fs.unlinkSync(oldSignaturePath);
        }
      }
      
      companyProfile = await CompanyProfile.findOneAndUpdate(
        { userId: req.user.id },
        profileData,
        { new: true, runValidators: true }
      );
    } else {
      companyProfile = new CompanyProfile(profileData);
      await companyProfile.save();
    }

    res.status(201).json(companyProfile);
  } catch (error) {
    console.error('Error saving company profile:', error);
    res.status(500).json({ message: 'Error saving company profile' });
  }
});

// Delete company profile
router.delete('/', async (req, res) => {
  try {
    const companyProfile = await CompanyProfile.findOneAndDelete({ userId: req.user.id });

    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    // Delete associated files
    if (companyProfile.companyLogoPath) {
      const logoPath = path.join(__dirname, '../../uploads', companyProfile.companyLogoPath);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    if (companyProfile.signaturePath) {
      const signaturePath = path.join(__dirname, '../../uploads', companyProfile.signaturePath);
      if (fs.existsSync(signaturePath)) {
        fs.unlinkSync(signaturePath);
      }
    }

    res.json({ message: 'Company profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting company profile:', error);
    res.status(500).json({ message: 'Error deleting company profile' });
  }
});

module.exports = router;
