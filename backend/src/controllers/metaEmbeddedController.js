import metaEmbeddedService
    from "../services/metaEmbeddedService.js";


// =====================================
// CONNECT WHATSAPP
// =====================================

const connectWhatsApp = async (req, res, next) => {

    try {

        const data =
            await metaEmbeddedService.connectWhatsApp(

                req.body

            );

        res.status(200).json({

            success: true,

            message:
                "WhatsApp Connected Successfully",

            data

        });

    }

    catch (err) {

        return next(err);

    }

};


// =====================================
// DISCONNECT WHATSAPP
// =====================================

const disconnectWhatsApp = async (req, res, next) => {

    try {

        const { tenantId } = req.body;


        const data =
            await metaEmbeddedService.disconnectWhatsApp(

                tenantId

            );


        res.status(200).json({

            success: true,

            message:
                "WhatsApp Disconnected",

            data

        });

    }

    catch (err) {

        return next(err);

    }

};


export default {

    connectWhatsApp,

    disconnectWhatsApp

};