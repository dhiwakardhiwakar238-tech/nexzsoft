import templateService
    from "../services/templateService.js";
import * as broadcastService
    from "../services/broadcastService.js";
import { badRequest } from "../utils/apiError.js";

/*
===================================
CREATE TEMPLATE
===================================
*/

const createTemplate = async (

    req,
    res,
    next

) => {

    try {

        console.log(
            "TEMPLATE REQUEST =",
            {
                tenant_id: req.user?.tenant_id,
                name: req.body?.name,
                category: req.body?.category,
                language: req.body?.language,
                hasMediaId: Boolean(req.body?.media_id)
            }
        );

        const tenantId = req.user?.tenant_id;

        if (!tenantId) {
            throw badRequest("Your logged-in account is missing tenant information. Please log in again.");
        }

        if (
            req.body?.tenant_id &&
            String(req.body.tenant_id).trim() !== String(tenantId).trim()
        ) {
            throw badRequest("The selected account does not match your logged-in account.");
        }

        const payload = {
            ...req.body,
            tenant_id: tenantId
        };

        const result =
            await templateService.createTemplate(payload);

        return res.json({

            success: true,

            template: result

        });

    }

    catch (err) {

        console.log(
            "TEMPLATE ERROR",
            err.response?.data || err
        );

        return res.status(400).json({

            success: false,

            message:
                err.response?.data?.error?.message ||
                err.message,

            metaError:
                err.response?.data || null

        });

    }

};



/*
===================================
UPLOAD TEMPLATE MEDIA
===================================
*/

const uploadMedia = async (req, res, next) => {
    try {
        const tenantId = req.user?.tenant_id;

        if (!tenantId) {
            return res.status(400).json({
                success: false,
                message: "Your logged-in account is missing tenant information. Please log in again."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Media file is required."
            });
        }

        const allowedTypes = new Set([
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "application/pdf"
        ]);

        if (!allowedTypes.has(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: "Unsupported media type. Use JPG, PNG, WEBP, MP4 or PDF."
            });
        }

        const declaredType =
            String(req.body?.headerType || "").trim().toUpperCase();

        const declaredTypeMimeMap = {
            IMAGE: ["image/jpeg", "image/png", "image/webp"],
            VIDEO: ["video/mp4"],
            DOCUMENT: ["application/pdf"]
        };

        if (
            declaredType &&
            declaredTypeMimeMap[declaredType] &&
            !declaredTypeMimeMap[declaredType].includes(req.file.mimetype)
        ) {
            return res.status(400).json({
                success: false,
                message: `${declaredType} header requires a matching ${declaredType.toLowerCase()} file.`
            });
        }

        /*
        Meta Cloud API video uploads are limited to 16 MB.
        Keep the file in memory only; do not store it in S3
        or on the Nexzsoft server.
        */

        if (
            req.file.mimetype === "video/mp4" &&
            req.file.size > 16 * 1024 * 1024
        ) {
            return res.status(400).json({
                success: false,
                message: "Video size must be 16 MB or less."
            });
        }

        const result = await templateService.uploadMediaToMeta(
            tenantId,
            req.file
        );

        return res.json(result);
    } catch (err) {
        console.error(
            "TEMPLATE MEDIA UPLOAD ERROR:",
            err.response?.data || err.message || err
        );

        return res.status(400).json({
            success: false,
            message:
                err.response?.data?.error?.message ||
                err.message ||
                "Media upload failed."
        });
    }
};


/*
===================================
GET TEMPLATES
===================================
*/

const getTemplates = async (

    req,
    res,
    next

) => {

    try {

        const { tenantId } = req.params;

        if (!tenantId) {

            throw badRequest("Tenant ID is required.");

        }

        const templates =
            await templateService.getTemplates(
                tenantId
            );

        return res.json({

            success: true,

            templates

        });

    }

    catch (err) {

        return next(err);

    }

};



/*
===================================
SYNC META TEMPLATES
===================================
*/

const syncTemplates = async (

    req,
    res,
    next

) => {

    try {

        const { tenantId } = req.params;

        if (!tenantId) {

            throw badRequest("Tenant ID is required.");

        }

        // ==================================================
        // SYNC META TEMPLATES
        // ==================================================

        const result =

            await templateService
                .syncTemplatesFromMeta(
                    tenantId
                );

        // ==================================================
        // SYNC BROADCAST READ COUNTS
        // ==================================================

        await broadcastService
            .syncBroadcastReadCounts(
                tenantId
            );

        return res.json(result);

    }

    catch (err) {

        return next(err);

    }

};



/*
===================================
GET SINGLE TEMPLATE
===================================
*/

const getTemplate = async (

    req,
    res

) => {

    return res.json({

        success: true

    });

};



/*
===================================
DELETE TEMPLATE
===================================
*/

const deleteTemplate = async (

    req,
    res

) => {

    return res.json({

        success: true

    });

};



export default {

    createTemplate,
    uploadMedia,
    getTemplates,
    syncTemplates,
    getTemplate,
    deleteTemplate

};