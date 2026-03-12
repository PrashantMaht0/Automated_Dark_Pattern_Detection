const express = require('express');
const router = express.Router();

const auditController = require('../controllers/controllers');

router.post('/audit/start', auditController.startAudit);

router.get('/audit/status/:jobId', auditController.checkAuditStatus);

module.exports = router;