const express = require('express');
const httpRoutes = require('./routes/routes');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());
app.use('/api', httpRoutes);

app.listen(8080, () => {
    logger.info('HTTP server running on port 8080');
});

require('./controllers/grpcController');
