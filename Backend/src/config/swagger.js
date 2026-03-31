const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WatchOut API',
      version: '1.0.0',
      description: 'API documentation for WatchOut Government Transparency Portal',
      contact: {
        name: 'WatchOut Support',
        email: 'support@watchout.gov.in'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'] // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
