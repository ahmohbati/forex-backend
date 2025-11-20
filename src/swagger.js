import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const host = process.env.SWAGGER_HOST || `http://localhost:${PORT}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Forex Backend API',
      version: '1.0.0',
      description: 'API documentation for the Forex Exchange Management System backend'
    },
    servers: [
      {
        url: host,
        description: 'Local server'
      }
    ]
  },
  // Look for JSDoc comments in routes and models for auto-generated docs
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
