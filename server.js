const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authenticateToken = require('./_utils/jwtMiddleware');
// import routers
const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffMemberRoutes');
const setupRoutes = require('./routes/setupRoutes');

// Load environment variables
dotenv.config();

// Configure CORS options
const allowedOrigins = [
  'http://localhost:3000',
  'https://paysuite.netlify.app',
  'https://paysuiteerp.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`${origin} is not allowed by CORS`));
    }
  },
  methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOptions));
app.use((req, res, next) => {
  if (req.is('application/json')) {
    bodyParser.json()(req, res, next);
  } else {
    next();
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

app.use('/api', authenticateToken);
app.use('/api/auth', authRoutes);
app.use('/api/staff-members', staffRoutes);
app.use('/api/setup', setupRoutes);

const APP_PORT = process.env.APP_PORT || 5000;
app.listen(APP_PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${APP_PORT}`);
});
