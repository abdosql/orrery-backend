const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const neoRoutes = require('./routes/neoRoutes');
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron');
const { storeNEOData } = require('./controllers/neoController');
const { getESANEOData } = require('./services/nasaService');
const NEO = require('./models/neo');

dotenv.config();

const app = express();
const port = process.env.PORT || 5090;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/neos', neoRoutes);

// Catch-all route for unmatched routes
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Server is configured to listen on 0.0.0.0:${port}`);
});

// Cron jobs
cron.schedule('0 0 * * *', async () => {
  // ... (keep your existing cron job code here)
});

console.log('NASA_API_KEY:', process.env.NASA_API_KEY);

console.log('Environment variables loaded:', process.env.NASA_API_KEY ? 'NASA_API_KEY is set' : 'NASA_API_KEY is not set');

module.exports = app;