const { port } = require('./config');
const express = require('express');
const path = require('path');
const { handleDbErrorMw, logRequestsMw } = require('./middleware/middleware');

const connectToDb = require('./db/mongoose');
const categoryRoutes = require('./api/routes/categoryRoutes');
const userRoutes = require('./api/routes/userRoutes');
const searchRoutes = require('./api/routes/searchRoutes');
const pageRoutes = require('./api/routes/pageRoutes');

connectToDb();

const app = express();

app.use(logRequestsMw);
app.use(handleDbErrorMw);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend/dist')));
app.use('/views', express.static(path.join(__dirname, './views')));

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use(searchRoutes);
app.use(pageRoutes);

// Catch-all requests return the React app, so it can handle further routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
