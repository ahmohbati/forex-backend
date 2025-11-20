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
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', example: 'user@example.com' },
            firstName: { type: 'string', example: 'Ahmed' },
            lastName: { type: 'string', example: 'Mohammed' },
            created_at: { type: 'string', format: 'date-time', example: '2025-01-01T12:00:00Z' },
            updated_at: { type: 'string', format: 'date-time', example: '2025-01-02T12:00:00Z' }
          }
        },
        Currency: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            code: { type: 'string', example: 'USD' },
            name: { type: 'string', example: 'US Dollar' },
            symbol: { type: 'string', example: '$' },
            isActive: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time', example: '2025-01-01T12:00:00Z' }
          }
        },
        ExchangeRate: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            baseCurrency: { type: 'string', example: 'ETB' },
            targetCurrency: { type: 'string', example: 'USD' },
            rate: { type: 'number', format: 'float', example: 0.020 },
            timestamp: { type: 'string', format: 'date-time', example: '2025-11-20T12:00:00Z' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 123 },
            userId: { type: 'integer', example: 1 },
            fromCurrency: { type: 'string', example: 'ETB' },
            toCurrency: { type: 'string', example: 'USD' },
            amount: { type: 'number', example: 1000 },
            exchangeRate: { type: 'number', format: 'float', example: 0.02 },
            convertedAmount: { type: 'number', example: 19.8 },
            fee: { type: 'number', example: 0.198 },
            type: { type: 'string', example: 'CONVERT', enum: ['BUY','SELL','CONVERT'] },
            status: { type: 'string', example: 'COMPLETED' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' }
          },
          required: ['email', 'password']
        },
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['email', 'password']
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: { $ref: '#/components/schemas/User' }
          }
        },
        ConvertRequest: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            fromCurrency: { type: 'string' },
            toCurrency: { type: 'string' }
          },
          required: ['amount', 'toCurrency']
        },
        ConvertResponse: {
          type: 'object',
          properties: {
            originalAmount: { type: 'number' },
            convertedAmount: { type: 'number' },
            exchangeRate: { type: 'number' },
            fee: { type: 'number' },
            fromCurrency: { type: 'string' },
            toCurrency: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        TransactionCreateRequest: {
          type: 'object',
          properties: {
            fromCurrency: { type: 'string' },
            toCurrency: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string' }
          },
          required: ['fromCurrency', 'toCurrency', 'amount']
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
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
