import dotenv from "dotenv";
import processSubscriptionLifecycle from "./jobs/subscriptionLifecycleJob.js";
import processConversationFlow from "./jobs/processConversationFlow.js";
import {
    processAgentHandoffs
} from "./jobs/agentHandoffJob.js";

dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";

import tenantRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import whatsappRoutes from "./routes/whatsappRoutes.js";
import metaTemplates from "./routes/metaTemplates.js";
import customerRoutes from "./routes/customerRoutes.js";
import companyPolicyRoutes from "./routes/companyPolicyRoutes.js";
import salesRoute from "./routes/salesRoute.js";
import docmanRotue from "./routes/docman/docmanRoute.js";
import testEmbedding from "./routes/testEmbedding.js";
import searchTest from "./routes/searchTest.js";
import ragTest from "./routes/ragTest.js";
import metaConfigRoutes from "./routes/metaConfigRoutes.js";
import broadcastRoutes from "./routes/broadcastRoutes.js";
import labelsRoutes from "./routes/labelsRoutes.js";
import metaEmbeddedRoutes from "./routes/metaEmbeddedRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import aiSettingsRoutes from "./routes/aiSettingsRoutes.js";
import ragRoutes from "./routes/rag.routes.js";
import whatsappFlowsRoutes from "./routes/whatsappFlowsRoutes.js";
import shopifyRoutes from "./routes/shopifyRoutes.js";

import {
    authenticateToken
} from "./middleware/requestAuthorizer.js";

import {
    notFoundHandler,
    globalErrorHandler
} from "./middleware/errorHandler.js";

import {
    initSocket
} from "./config/socket.js";

import ticketRoutes
    from "./routes/ticketRoutes.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";


/*
==================================================
APP
==================================================
*/

const app = express();

const server =
    http.createServer(app);


/*
==================================================
ALLOWED CORS ORIGINS
==================================================
*/

const allowedOrigins = [

    "http://localhost:5173",

    "https://localhost:5173",

    "http://localhost:3000",

    "https://www.nexzsoft.com",

    "https://nexzsoft.com",

    "https://nexzsoft-wa-apitest.vercel.app",

];

/*
==================================================
CORS
==================================================
*/

app.use(
    cors({

        origin: (origin, callback) => {

            /*
            ------------------------------------------
            Requests without Origin
            ------------------------------------------
            */

            if (!origin) {

                return callback(
                    null,
                    true
                );

            }


            /*
            ------------------------------------------
            Allowed origin
            ------------------------------------------
            */

            if (
                allowedOrigins.includes(
                    origin
                )
            ) {

                return callback(
                    null,
                    true
                );

            }


            console.warn(
                "⚠️ CORS blocked origin:",
                origin
            );


            return callback(
                new Error(
                    "Not allowed by CORS"
                )
            );

        },


        credentials: true,


        methods: [

            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",

        ],


        allowedHeaders: [

            "Content-Type",
            "Authorization",

        ],

    })
);


/*
==================================================
BODY PARSER
==================================================
*/

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended: true
    })
);


/*
==================================================
REQUEST LOGGER
==================================================
*/

app.use(
    (req, res, next) => {

        console.log(
            "REQUEST:",
            req.method,
            req.originalUrl,
            "ORIGIN:",
            req.headers.origin || "none"
        );

        next();

    }
);


/*
==================================================
SOCKET.IO
==================================================

IMPORTANT:

Socket.IO must be initialized using
the SAME HTTP server that Express uses.

==================================================
*/

initSocket(
    server
);


/*
==================================================
ROOT
==================================================
*/

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Nexzsoft Backend Running 🚀",

        });

    }
);


/*
==================================================
AUTH
==================================================

PUBLIC

POST /api/login
POST /api/register

==================================================
*/

app.use(
    "/api",
    tenantRoutes
);

/*=================================================
Ecosystem-Shopify
==================================================*/

app.use(
    "/api/shopify", 
    shopifyRoutes
);

/*
==================================================
SUBSCRIPTIONS
==================================================*/

app.use(
    "/api/subscriptions",
    authenticateToken,
    subscriptionRoutes
);


/*
==================================================
USERS
==================================================*/

app.use(
    "/api/users",
    authenticateToken,
    userRoutes
);

/*
==================================================
Tickets
==================================================*/

app.use(
    "/api/tickets",
    ticketRoutes
);


/*
==================================================
CUSTOMER LABELS
==================================================*/

app.use(
    "/api/customer-labels",
    authenticateToken,
    labelsRoutes
);


/*
==================================================
AI SETTINGS
==================================================*/

app.use(
    "/api/ai-settings",
    authenticateToken,
    aiSettingsRoutes
);


/*
==================================================
WHATSAPP WEBHOOK
==================================================

IMPORTANT:

DO NOT PUT JWT HERE.

Meta calls this endpoint directly.

Webhook verification is handled
inside webhookRoutes/controller.

==================================================
*/

app.use(
    "/webhook",
    webhookRoutes
);


/*
==================================================
WHATSAPP DASHBOARD
==================================================*/

app.use(
    "/api/whatsapp",
    authenticateToken,
    whatsappRoutes
);


/*
==================================================
WHATSAPP READ
==================================================*/

app.use(
    "/api/whatsapp/read",
    authenticateToken,
    whatsappRoutes
);

/*
==================================================
WhatsappFlow
==================================================*/

app.use(
    "/api/whatsapp-flows", 
    whatsappFlowsRoutes
);


/*
==================================================
META TEMPLATES
==================================================*/

app.use(
    "/api/meta",
    authenticateToken,
    metaTemplates
);


/*
==================================================
CUSTOMERS
==================================================*/

app.use(
    "/api/customers",
    authenticateToken,
    customerRoutes
);


/*
==================================================
COMPANY POLICY
==================================================*/

app.use(
    "/api/company-policy",
    authenticateToken,
    companyPolicyRoutes
);


/*
==================================================
SALES LEAD
==================================================*/

app.use(
    "/api/sales-lead",
    salesRoute
);


/*
==================================================
DOCUMENT / KNOWLEDGE BASE
==================================================*/

app.use(
    "/api/document",
    authenticateToken,
    docmanRotue
);


/*
==================================================
TEST EMBEDDING
==================================================*/

app.use(
    "/api/test-embedding",
    authenticateToken,
    testEmbedding
);


/*
==================================================
SEARCH
==================================================*/

app.use(
    "/api/search",
    authenticateToken,
    searchTest
);


/*
==================================================
RAG TEST
==================================================*/

app.use(
    "/api/rag",
    authenticateToken,
    ragTest
);


/*
==================================================
TEMPLATES
==================================================*/

app.use(
    "/api",
    authenticateToken,
    templateRoutes
);


/*
==================================================
META CONFIG
==================================================*/

app.use(
    "/api/meta-config",
    authenticateToken,
    metaConfigRoutes
);


/*
==================================================
BROADCAST
==================================================*/

app.use(
    "/api",
    authenticateToken,
    broadcastRoutes
);


/*
==================================================
META EMBEDDED SIGNUP
==================================================*/

app.use(
    "/api/meta",
    authenticateToken,
    metaEmbeddedRoutes
);


/*
==================================================
RAG ROUTES
==================================================*/

app.use(
    "/api/rag",
    authenticateToken,
    ragRoutes
);


/*
==================================================
SWAGGER
==================================================
*/

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(
        swaggerSpec
    )
);


/*
==================================================
HEALTH CHECK
==================================================
*/

app.get(
    "/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            status: "OK",

        });

    }
);


/*
==================================================
COMMON API ERROR PAGE
==================================================

Register these LAST — after every route above,
before server.listen. Anything unmatched hits
notFoundHandler; anything that calls next(err)
or throws inside an async route handler lands in
globalErrorHandler, and always comes back in the
SAME { success:false, error:{...} } shape.
==================================================
*/

app.use(
    notFoundHandler
);

app.use(
    globalErrorHandler
);


/*
==================================================
START SERVER
==================================================
*/

const PORT =
    process.env.PORT || 3000;

/*
==================================================
SUBSCRIPTION BILLING JOB
==================================================
*/

console.log(
    "✅ Subscription billing job scheduled."
);

processSubscriptionLifecycle();

setInterval(
    processSubscriptionLifecycle,
   3 * 60 * 60 * 1000
);

/*
==================================================
CONVERSATION LIFECYCLE JOB
==================================================
*/

console.log(
    "✅ Conversation lifecycle job scheduled."
);

processConversationFlow();

setInterval(
    processConversationFlow,
    5 * 60 * 1000
);

/*
==================================================
Agent Handoff JOB
==================================================
*/

console.log(
    "✅ Agent Handoff job scheduled."
);

processAgentHandoffs();

setInterval(
    processConversationFlow,
    60 * 1000
);

/*
==================================================
START SERVER
==================================================
*/

server.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "==================================="
        );

        console.log(
            `🚀 Nexzsoft Server Running : ${PORT}`
        );

        console.log(
            "🟢 Socket.IO HTTP server attached"
        );

        console.log(
            "==================================="
        );

    }
);
