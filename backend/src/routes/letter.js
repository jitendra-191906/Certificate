const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// All letter routes will be protected
router.use(auth);

// Placeholder routes - will be implemented in next steps
router.get('/', (req, res) => {
  res.json({ message: 'Letter routes - Coming soon' });
});

module.exports = router;
