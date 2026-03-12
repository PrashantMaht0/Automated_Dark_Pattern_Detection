const express = require('express');
const router = express.Router();

// Import your controller
const auditController = require('../controllers/controllers');

// 1. The route to START the background job (React POSTs here first)
router.post('/audit/start', auditController.startAudit);

// 2. The route to CHECK the status (React GETs this every 5 seconds)
router.get('/audit/status/:jobId', auditController.checkAuditStatus);

module.exports = router;