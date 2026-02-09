const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// All employee routes will be protected
router.use(auth);

// Placeholder routes - will be implemented in next steps
router.get('/', (req, res) => {
  res.json({ message: 'Employee routes - Coming soon' });
});

module.exports = router;
