require('dotenv').config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`WatchOut backend ready on port ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log - let the error handler deal with it
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // In production, you might want to exit, but in dev, let's keep running
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

