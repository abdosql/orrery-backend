require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const neoRoutes = require('./routes/neoRoutes');
const userRoutes = require('./routes/userRoutes');
const cron = require('node-cron');
const { storeNEOData } = require('./controllers/neoController');
const { getESANEOData } = require('./services/nasaService');
const NEO = require('./models/neo');

const app = express();
const port = process.env.PORT || 5090;

// CORS middleware
app.use(cors({
  origin: ['https://astrolab-nasa.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Add body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

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

console.log('NASA_API_KEY:', process.env.NASA_API_KEY ? 'Set' : 'Not set');

module.exports = app;