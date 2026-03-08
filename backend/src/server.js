// backend-node/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import your newly created routes
const apiRoutes = require('./routes/routes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Static File Hosting ---
// This ensures React can fetch the screenshot images using a URL
const exportsDir = path.join(__dirname, '../../exports');
if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
}
app.use('/exports', express.static(exportsDir));

app.use('/api', apiRoutes);

// --- Boot Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node.js Orchestrator running on http://localhost:${PORT}`);
    console.log(`API is listening for requests at http://localhost:${PORT}/api/audit`);
});