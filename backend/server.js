const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const mongoose = require('mongoose');
const neoRoutes = require('./routes/neoRoutes');
console.log('neoRoutes imported:', neoRoutes);
const cron = require('node-cron');
const { storeNEOData } = require('./controllers/neoController');
const { getESANEOData } = require('./services/nasaService');
const NEO = require('./models/neo');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

const app = express();
const port = process.env.PORT || 5090;

app.use(cors());
app.use(bodyParser.json());

// Add this line to connect the NEO routes
app.use('/api/neos', neoRoutes);
console.log('neoRoutes middleware added');

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ username, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

// Add this just before module.exports = app;
app.use((req, res) => {
  console.log(`Unmatched route: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

// Move this line to the end of the file
module.exports = app;

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Server is configured to listen on 0.0.0.0:${port}`);
});

// Run the job every day at midnight
cron.schedule('0 0 * * *', async () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  try {
    // Update NASA NEO data
    await storeNEOData({ query: { start_date: yesterday, end_date: today } }, { json: () => {} });
    console.log('Daily NASA NEO data update completed');
    
    // Update ESA NEO data
    const esaData = await getESANEOData();
    // Process and store ESA data
    for (const neo of esaData) {
      await NEO.findOneAndUpdate(
        { neo_reference_id: neo.neo_reference_id },
        neo,
        { upsert: true, new: true }
      );
    }
    console.log('ESA NEO data update completed');
  } catch (error) {
    console.error('Error updating NEO data:', error);
  }
});