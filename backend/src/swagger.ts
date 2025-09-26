import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pets Yu API',
      version: '1.0.0',
      description: 'Documentación de la API para la tienda de mascotas Pets Yu',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de desarrollo local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Rutas a los archivos de la API
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
