// import express from "express";
// import metaEmbeddedController from "../controllers/metaEmbeddedController.js";

// const router = express.Router();


// // ======================================
// // CONNECT WHATSAPP
// // ======================================

// router.post(

//     "/connect",

//     metaEmbeddedController.connectWhatsApp

// );


// // ======================================
// // DISCONNECT WHATSAPP
// // ======================================

// router.post(

//     "/disconnect",

//     metaEmbeddedController.disconnectWhatsApp

// );


// export default router;





import express from "express";
import metaEmbeddedController from "../controllers/metaEmbeddedController.js";

const router = express.Router();

router.post(
    "/exchange",
    metaEmbeddedController.connectWhatsApp
);

router.post(
    "/connect",
    metaEmbeddedController.connectWhatsApp
);

router.post(
    "/disconnect",
    metaEmbeddedController.disconnectWhatsApp
);

export default router;