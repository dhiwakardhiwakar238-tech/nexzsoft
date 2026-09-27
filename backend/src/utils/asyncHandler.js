/*
==================================================
ASYNC HANDLER

Wrap any async controller with this and you NEVER
need a try/catch just to forward errors. Any throw
(including a thrown ApiError) is automatically
caught and sent to next(err) -> globalErrorHandler.

USAGE (new controllers):

    import { asyncHandler } from "../utils/asyncHandler.js";
    import { badRequest, notFound } from "../utils/apiError.js";

    export const getThing = asyncHandler(async (req, res) => {

        const { id } = req.params;

        if (!id) {
            throw badRequest("id is required.");
        }

        const row = await db.query(...);

        if (!row) {
            throw notFound("That record doesn't exist.");
        }

        return res.status(200).json({ success: true, data: row });

        // No catch block needed — asyncHandler does it.
    });

Then register the route exactly like any other:

    router.get("/thing/:id", authenticateToken, getThing);
==================================================
*/

export const asyncHandler = (fn) => {

    return (req, res, next) => {

        Promise.resolve(
            fn(req, res, next)
        ).catch(next);

    };

};
