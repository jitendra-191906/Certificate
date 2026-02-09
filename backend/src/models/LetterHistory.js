const mongoose = require('mongoose');

const letterHistorySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee ID is required']
  },
  letterType: {
    type: String,
    required: [true, 'Letter type is required'],
    enum: ['internship', 'experience']
  },
  generatedDate: {
    type: Date,
    default: Date.now
  },
  pdfFilePath: {
    type: String,
    required: [true, 'PDF file path is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LetterHistory', letterHistorySchema);
