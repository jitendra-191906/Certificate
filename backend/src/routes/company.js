const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// All company routes will be protected
router.use(auth);

// Placeholder routes - will be implemented in next steps
router.get('/', (req, res) => {
  res.json({ message: 'Company routes - Coming soon' });
});

module.exports = router;
