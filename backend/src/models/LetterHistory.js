const mongoose = require('mongoose');

const letterHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  employeeName: {
    type: String,
    required: [true, 'Employee name is required']
  },
  employeeEmail: {
    type: String,
    required: false
  },
  employeeId: {
    type: String,
    required: false
  },
  position: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: false
  },
  joiningDate: {
    type: Date,
    required: false
  },
  salary: {
    type: String,
    required: false
  },
  offerDate: {
    type: Date,
    required: false
  },
  signatoryName: {
    type: String,
    required: false
  },
  letterType: {
    type: String,
    required: [true, 'Letter type is required'],
    enum: ['internship', 'experience', 'completion', 'appreciation', 'offer']
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required']
  },
  companyAddress: {
    type: String,
    required: false
  },
  companyLogoPath: {
    type: String,
    required: false
  },
  companyCIN: {
    type: String,
    required: false
  },
  companyContact: {
    type: String,
    required: false
  },
  companyEmail: {
    type: String,
    required: false
  },
  companyWebsite: {
    type: String,
    required: false
  },
  companyRegisteredOffice: {
    type: String,
    required: false
  },
  signaturePath: {
    type: String,
    required: false
  },
  reason: {
    type: String,
    required: false
  },
  additionalDetails: {
    type: String,
    required: false
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  pdfFilePath: {
    type: String,
    required: [true, 'PDF file path is required']
  },
  serialNumber: {
    type: String,
    required: [true, 'Serial number is required'],
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LetterHistory', letterHistorySchema);
