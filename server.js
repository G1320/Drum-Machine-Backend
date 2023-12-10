const { PORT, ALLOWED_ORIGINS, JWT_SECRET_KEY, NODE_ENV } = require('./config/index.js');
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
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", ...ALLOWED_ORIGINS],
        workerSrc: ["'self'", 'blob:'],
        mediaSrc: ["'self'", ...ALLOWED_ORIGINS],
        // styleSec: ["'unsafe-inline'"],
        // styleSrc: ["'self'", "'unsafe-inline'"], // Add 'unsafe-inline' to allow inline styles
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
app.use('/api/auth', authRoutes);
app.use(searchRoutes);
app.use(pageRoutes);

app.use(logRequestsMw);
app.use(handleDbErrorMw);
app.use(handleErrorMw);

app.use(express.static('public'));
app.use(
  express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      } else if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
      }
    },
  })
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
