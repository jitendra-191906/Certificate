const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  logo: {
    type: String, // Path to uploaded logo file
    required: false
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  contactDetails: {
    type: String,
    required: [true, 'Contact details are required'],
    trim: true
  },
  authorizedSignature: {
    type: String, // Path to uploaded signature file
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
