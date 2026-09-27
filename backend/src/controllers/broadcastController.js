import broadcastService from "../services/broadcastService.js";

/*
==================================================
GET ALL BROADCASTS
==================================================
*/

const getBroadcasts = async (req, res, next) => {

    try {

        const { tenantId } = req.params;

        const broadcasts =
            await broadcastService.getBroadcasts(
                tenantId
            );

        res.json({
            success: true,
            broadcasts
        });

    }

    catch (err) {

        return next(err);

    }

};


/*
==================================================
GET BROADCAST DETAILS
==================================================
*/

const getBroadcastDetails = async (

    req,
    res,
    next

) => {

    try {

        const {

            tenantId,
            id

        } = req.params;


        const data =
            await broadcastService.getBroadcastDetails(

                tenantId,
                id

            );


        res.json(data);

    }

    catch (err) {

        return next(err);

    }

};


export default {

    getBroadcasts,
    getBroadcastDetails

};
