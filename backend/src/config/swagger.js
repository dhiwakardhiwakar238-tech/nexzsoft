import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "Nexsoft API",
            version: "1.0.0",
            description: "Nexsoft Backend API Documentation",
        },

        servers: [
            {
                url: "http://localhost:3000",
                description: "Local server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },

            responses: {
                BadRequest: {
                    description: "Bad request",
                },

                Unauthorized: {
                    description: "Unauthorized",
                },

                NotFound: {
                    description: "Resource not found",
                },

                InternalServerError: {
                    description: "Internal server error",
                },
            },
        },
    },

    apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;