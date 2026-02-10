const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  companyLogoPath: {
    type: String,
    required: false
  },
  companyCIN: {
    type: String,
    required: false,
    trim: true
  },
  companyContact: {
    type: String,
    required: false,
    trim: true
  },
  companyEmail: {
    type: String,
    required: false,
    lowercase: true,
    trim: true
  },
  companyWebsite: {
    type: String,
    required: false,
    trim: true
  },
  companyRegisteredOffice: {
    type: String,
    required: false,
    trim: true
  },
  signaturePath: {
    type: String,
    required: false
  },
  signatoryName: {
    type: String,
    required: false,
    trim: true
  },
  signatoryDesignation: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
