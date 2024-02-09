const { PORT, ALLOWED_ORIGINS, JWT_SECRET_KEY } = require('./config/index.js');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const connectToDb = require('./db/mongoose');

const userRoutes = require('./api/routes/userRoutes');
const kitRoutes = require('./api/routes/kitRoutes');
const searchRoutes = require('./api/routes/searchRoutes');
const pageRoutes = require('./api/routes/pageRoutes');
const authRoutes = require('./api/routes/authRoutes');
const soundRoutes = require('./api/routes/soundRoutes');
const songRoutes = require('./api/routes/songRoutes');

const { handleErrorMw, handleDbErrorMw, logRequestsMw } = require('./middleware');

connectToDb();

const app = express();

const corsOptions = { origin: { ...ALLOWED_ORIGINS }, credentials: true };
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(cookieParser(JWT_SECRET_KEY));
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        imgSrc: [
          "'self'",
          'https://www.googletagmanager.com/',
          'https://c.clarity.ms/',
          'https://c.bing.com/c.gif',
        ],
        defaultSrc: ["'self'", ...ALLOWED_ORIGINS],
        scriptSrc: ["'self'", "'unsafe-eval'", ...ALLOWED_ORIGINS],
        connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        workerSrc: ["'self'", 'blob:'],
        mediaSrc: ["'self'", ...ALLOWED_ORIGINS],
      },
    },
  })
);

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

app.use('/views', express.static(path.join(__dirname, './views')));

app.use('/api/users', userRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/sounds', soundRoutes);
app.use('/api/songs', songRoutes);

app.use('/api/auth', authRoutes);
app.use(searchRoutes);
app.use(pageRoutes);

app.use(logRequestsMw);
app.use(handleDbErrorMw);
app.use(handleErrorMw);

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
