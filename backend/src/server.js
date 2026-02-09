const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Database Connection
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Letter Generator API is running on port ' + (process.env.PORT || 5000) });
});

// Import routes (will be created in next steps)
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/company');
const employeeRoutes = require('./routes/employee');
const letterRoutes = require('./routes/letter');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/letters', letterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
