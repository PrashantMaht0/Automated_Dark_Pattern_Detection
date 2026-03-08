const express = require('express');
const router = express.Router();

// Import your controller
const auditController = require('../controllers/controllers');

// When React sends a POST request to /api/audit, trigger the generateAudit function
router.post('/audit', auditController.generateAudit);

module.exports = router;