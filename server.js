const { PORT, ALLOWED_ORIGINS, JWT_SECRET_KEY } = require('./config');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const connectToDb = require('./db/mongoose');
const kitRoutes = require('./api/routes/kitRoutes');
const userRoutes = require('./api/routes/userRoutes');
const searchRoutes = require('./api/routes/searchRoutes');
const pageRoutes = require('./api/routes/pageRoutes');
const authRoutes = require('./api/routes/authRoutes');

const { handleErrorMw, handleDbErrorMw, logRequestsMw } = require('./middleware');

connectToDb();

const app = express();
const corsOptions = { origin: { ALLOWED_ORIGINS }, credentials: true };

app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(cookieParser(JWT_SECRET_KEY));

app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.use('/views', express.static(path.join(__dirname, './views')));

app.use('/api/users', userRoutes);
app.use('/api/kits', kitRoutes);
app.use('/api/auth', authRoutes);
app.use(searchRoutes);
app.use(pageRoutes);

app.use(logRequestsMw);
app.use(handleDbErrorMw);
app.use(handleErrorMw);

// Catch-all requests return the React app, so it can handle further routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
