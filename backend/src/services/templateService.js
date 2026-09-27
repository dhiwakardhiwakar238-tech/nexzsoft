import axios from "axios";
import metaConfigService from "./metaConfigService.js";

import db from "../config/db.js";
import { v4 as uuidv4 } from "uuid";
import ffmpegPath from "ffmpeg-static";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

const execFileAsync = promisify(execFile);
const MAX_META_VIDEO_BYTES = 16 * 1024 * 1024;

/*
=====================================
NORMALIZE VIDEO FOR WHATSAPP / MOBILE
=====================================

Force uploaded MP4 videos into a format that WhatsApp/Android/iOS can
reliably decode: H.264 video + AAC audio + yuv420p + fast-start MP4.

The comma in min(1280,iw) and min(720,ih) MUST be escaped for FFmpeg's
filter parser. Because this is passed through execFile() (not a shell),
the JavaScript source must contain "\\," so FFmpeg receives "\,".
=====================================
*/
const normalizeVideoForWhatsApp = async (file) => {
    if (!ffmpegPath) {
        throw new Error(
            "FFmpeg binary is not available. Run npm install ffmpeg-static in the backend folder and restart the server."
        );
    }

    const workDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "nexzsoft-wa-video-")
    );

    const inputPath = path.join(
        workDir,
        `input-${crypto.randomUUID()}.mp4`
    );

    const outputPath = path.join(
        workDir,
        `output-${crypto.randomUUID()}.mp4`
    );

    try {
        await fs.writeFile(inputPath, file.buffer);

        const runFfmpeg = async (crf) => {
            await fs.rm(outputPath, { force: true });

            const args = [
                "-hide_banner",
                "-loglevel", "error",
                "-y",
                "-i", inputPath,
                "-map", "0:v:0",
                "-map", "0:a:0?",
                "-sn",
                "-dn",
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-profile:v", "main",
                "-level:v", "3.1",
                "-pix_fmt", "yuv420p",
                "-vf", "scale=w=trunc(min(1280\\,iw)/2)*2:h=trunc(min(720\\,ih)/2)*2:force_original_aspect_ratio=decrease",
                "-r", "30",
                "-c:a", "aac",
                "-b:a", "128k",
                "-ar", "48000",
                "-ac", "2",
                "-movflags", "+faststart",
                "-crf", String(crf),
                outputPath
            ];

            console.log("FFMPEG VIDEO NORMALIZE:", { crf });

            await execFileAsync(ffmpegPath, args, {
                windowsHide: true,
                maxBuffer: 10 * 1024 * 1024
            });
        };

        await runFfmpeg(23);

        let outputStat = await fs.stat(outputPath);

        if (outputStat.size > MAX_META_VIDEO_BYTES) {
            await runFfmpeg(28);
            outputStat = await fs.stat(outputPath);
        }

        if (outputStat.size > MAX_META_VIDEO_BYTES) {
            throw new Error(
                `Video is still too large after WhatsApp-compatible encoding (${(outputStat.size / 1024 / 1024).toFixed(2)} MB). Please use a shorter video.`
            );
        }

        const normalizedBuffer = await fs.readFile(outputPath);

        console.log("WHATSAPP VIDEO NORMALIZED:", {
            originalSize: `${(file.buffer.length / 1024 / 1024).toFixed(2)} MB`,
            outputSize: `${(normalizedBuffer.length / 1024 / 1024).toFixed(2)} MB`,
            outputMime: "video/mp4",
            codec: "H.264",
            audio: "AAC",
            pixelFormat: "yuv420p",
            maxResolution: "1280x720",
            maxFps: 30
        });

        return {
            buffer: normalizedBuffer,
            mimetype: "video/mp4",
            originalname: file.originalname || "video.mp4"
        };
    } finally {
        await fs.rm(workDir, { recursive: true, force: true });
    }
};


/*
=====================================
CREATE TEMPLATE
=====================================
*/

const createTemplate = async (payload) => {

    const {
        tenant_id,
        name,
        category,
        language,
        components,
        media_id
    } = payload;

    if (!tenant_id) {
        throw new Error(
            "TENANT ID IS REQUIRED"
        );
    }

    const metaConfig =
        await metaConfigService.getMetaConfig(
            tenant_id
        );

    if (
        !metaConfig.success ||
        !metaConfig.data
    ) {
        throw new Error(
            "META CONFIG NOT FOUND"
        );
    }

    const accessToken =
        metaConfig.data.access_token;

    const wabaId =
        metaConfig.data.waba_id;

    if (!accessToken || !wabaId) {
        throw new Error(
            "META CONFIGURATION IS INCOMPLETE"
        );
    }

    const graphPayload = {
        name,
        category,
        language,
        components
    };

    console.log(
        "====================================="
    );

    console.log(
        "META TEMPLATE CREATE PAYLOAD"
    );

    console.log(
        JSON.stringify(
            graphPayload,
            null,
            2
        )
    );

    console.log(
        "====================================="
    );

    const response = await axios.post(

        `https://graph.facebook.com/v24.0/${wabaId}/message_templates`,

        graphPayload,

        {
            headers: {

                Authorization:
                    `Bearer ${accessToken}`,

                "Content-Type":
                    "application/json"

            }
        }

    );

    const metaResponse =
        response.data;

    console.log(
        "META TEMPLATE RESPONSE:",
        metaResponse
    );


    /*
    =====================================
    SAVE TEMPLATE IN EXISTING DB
    =====================================
    */

    await db.query(

        `
        INSERT INTO whatsapp_templates
        (
            id,
            tenant_id,
            meta_template_id,
            name,
            category,
            language,
            status,
            components,
            media_id
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9
        )
        `,

        [

            uuidv4(),

            tenant_id,

            metaResponse.id,

            name,

            category,

            language,

            metaResponse.status,

            JSON.stringify(
                components || []
            ),

            media_id || null

        ]

    );

    return metaResponse;

};



/*
=====================================
UPLOAD TEMPLATE MEDIA TO META
=====================================

IMPORTANT:

This function performs TWO uploads.

1. /PHONE_NUMBER_ID/media
   -> returns media_id
   -> used later for broadcast sending

2. /APP_ID/uploads
   -> resumable upload
   -> returns header_handle
   -> used only while creating template
=====================================
*/

const uploadMediaToMeta = async (
    tenant_id,
    file
) => {

    if (!tenant_id) {

        throw new Error(
            "TENANT ID IS REQUIRED"
        );

    }


    if (
        !file?.buffer ||
        !file?.mimetype
    ) {

        throw new Error(
            "Media file is required."
        );

    }


    const metaConfig =
        await metaConfigService.getMetaConfig(
            tenant_id
        );


    if (
        !metaConfig.success ||
        !metaConfig.data
    ) {

        throw new Error(
            "META CONFIG NOT FOUND"
        );

    }


    const accessToken =
        metaConfig.data.access_token;

    const phoneNumberId =
        metaConfig.data.phone_number_id;


    /*
    =====================================
    APP ID
    =====================================
    
    Existing .env:
    
    APP_ID=xxxxxxxx
    
    DB app_id is also supported if available.
    */

    const appId =
        metaConfig.data.app_id ||
        process.env.APP_ID;


    if (!accessToken) {

        throw new Error(
            "META ACCESS TOKEN NOT FOUND"
        );

    }


    if (!phoneNumberId) {

        throw new Error(
            "META PHONE NUMBER ID NOT FOUND"
        );

    }


    if (!appId) {

        throw new Error(
            "META APP ID NOT FOUND. Add APP_ID to backend .env"
        );

    }


    let uploadFile = file;

    // Normalize MP4 before both Meta uploads so the media_id and
    // template header_handle point to the same mobile-compatible video.
    if (file.mimetype === "video/mp4") {
        uploadFile = await normalizeVideoForWhatsApp(file);
    }

    const fileLength =
        uploadFile.buffer.length;

    const fileType =
        uploadFile.mimetype;


    console.log(
        "====================================="
    );

    console.log(
        "META MEDIA UPLOAD START"
    );

    console.log(
        "File:",
        uploadFile.originalname
    );

    console.log(
        "Mime:",
        fileType
    );

    console.log(
        "Size:",
        fileLength
    );

    console.log(
        "Phone Number ID:",
        phoneNumberId
    );

    console.log(
        "App ID:",
        `${String(appId).slice(0, 6)}******`
    );

    console.log(
        "=====================================",
    );


    /*
    =========================================================
    STEP 1
    UPLOAD MEDIA TO WHATSAPP MEDIA API
    =========================================================

    This gives:

        media_id

    Example:

        1557411562850623

    This ID is used when actually sending the
    image/video/document in a WhatsApp message.
    */

    const form = new FormData();

    form.append(
        "messaging_product",
        "whatsapp"
    );

    form.append(
        "file",
        new Blob(
            [uploadFile.buffer],
            {
                type: fileType
            }
        ),
        uploadFile.originalname || "media"
    );

    form.append(
        "type",
        fileType
    );


    const mediaResponse =
        await fetch(

            `https://graph.facebook.com/v24.0/${phoneNumberId}/media`,

            {
                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${accessToken}`

                },

                body: form

            }

        );


    const mediaData =
        await mediaResponse
            .json()
            .catch(
                () => null
            );


    if (!mediaResponse.ok) {

        const error =
            new Error(

                mediaData?.error?.message ||
                mediaData?.message ||
                "Meta media upload failed."

            );

        error.response = {

            status:
                mediaResponse.status,

            data:
                mediaData

        };

        throw error;

    }


    const mediaId =
        mediaData?.id;


    if (!mediaId) {

        throw new Error(
            "Meta Media ID not received."
        );

    }


    console.log(
        "MEDIA ID RECEIVED:",
        mediaId
    );


    /*
    =========================================================
    STEP 2
    START META RESUMABLE UPLOAD
    =========================================================

    This is DIFFERENT from /PHONE_NUMBER_ID/media.

    This upload is required for WhatsApp template
    HEADER example.

    Response should contain:

        {
            id: "..."
        }
    */

    const uploadSessionUrl =
        new URL(

            `https://graph.facebook.com/v24.0/${appId}/uploads`

        );


    uploadSessionUrl.searchParams.set(
        "file_length",
        String(fileLength)
    );


    uploadSessionUrl.searchParams.set(
        "file_type",
        fileType
    );


    console.log(
        "STARTING RESUMABLE UPLOAD..."
    );


    const sessionResponse =
        await fetch(

            uploadSessionUrl.toString(),

            {

                method: "POST",

                headers: {

                    Authorization:
                        `Bearer ${accessToken}`

                }

            }

        );


    const sessionData =
        await sessionResponse
            .json()
            .catch(
                () => null
            );


    if (!sessionResponse.ok) {

        const error =
            new Error(

                sessionData?.error?.message ||
                sessionData?.message ||
                "Meta resumable upload session failed."

            );


        error.response = {

            status:
                sessionResponse.status,

            data:
                sessionData

        };


        throw error;

    }


    const uploadSessionId =
        sessionData?.id;


    if (!uploadSessionId) {

        throw new Error(
            "Meta upload session ID not received."
        );

    }


    console.log(
        "UPLOAD SESSION CREATED"
    );


    /*
    =========================================================
    STEP 3
    UPLOAD ACTUAL FILE BYTES TO SESSION
    =========================================================
    */


    console.log(
        "UPLOADING FILE BYTES..."
    );


    const fileUploadResponse =
        await fetch(

            `https://graph.facebook.com/v24.0/${uploadSessionId}`,

            {

                method: "POST",

                headers: {

                    Authorization:
                        `OAuth ${accessToken}`,

                    "file_offset":
                        "0",

                    "Content-Type":
                        fileType

                },

                body:
                    uploadFile.buffer

            }

        );


    const handleData =
        await fileUploadResponse
            .json()
            .catch(
                () => null
            );


    if (!fileUploadResponse.ok) {

        const error =
            new Error(

                handleData?.error?.message ||
                handleData?.message ||
                "Meta resumable file upload failed."

            );


        error.response = {

            status:
                fileUploadResponse.status,

            data:
                handleData

        };


        throw error;

    }


    /*
    =========================================================
    STEP 4
    GET TEMPLATE HEADER HANDLE
    =========================================================

    Meta returns:

        {
            "h": "...."
        }

    This is the value required by:

        example.header_handle
    */


    const headerHandle =
        handleData?.h;


    if (!headerHandle) {

        console.error(
            "RESUMABLE UPLOAD RESPONSE:",
            handleData
        );

        throw new Error(
            "Meta Header Handle not received."
        );

    }


    console.log(
        "HEADER HANDLE RECEIVED:",
        `${String(headerHandle).slice(0, 12)}...`
    );


    console.log(
        "====================================="
    );

    console.log(
        "TEMPLATE MEDIA UPLOAD SUCCESS"
    );

    console.log(
        "Media ID:",
        mediaId
    );

    console.log(
        "Header Handle:",
        `${String(headerHandle).slice(0, 12)}...`
    );

    console.log(
        "====================================="
    );


    /*
    =====================================
    RETURN BOTH IDs
    =====================================
    */

    return {

        success: true,

        /*
        Used for broadcast
        */

        mediaId,

        id:
            mediaId,

        /*
        Used ONLY for template creation
        */

        headerHandle,

        mimeType:
            fileType,

        filename:
            file.originalname || null

    };

};



/*
=====================================
GET TEMPLATES
=====================================
*/

const getTemplates = async (
    tenant_id
) => {

    const result =
        await db.query(

            `
            SELECT *
            FROM whatsapp_templates
            WHERE tenant_id=$1
            ORDER BY created_at DESC
            `,

            [tenant_id]

        );


    return result.rows.map(
        (template) => ({

            ...template,

            components:

                typeof template.components ===
                "string"

                    ? JSON.parse(
                        template.components
                    )

                    : template.components

        })
    );

};



/*
=====================================
SYNC META TEMPLATES
=====================================
*/

const syncTemplatesFromMeta = async (
    tenant_id
) => {

    if (!tenant_id) {

        throw new Error(
            "TENANT ID IS REQUIRED"
        );

    }


    const metaConfig =
        await metaConfigService.getMetaConfig(
            tenant_id
        );


    if (
        !metaConfig.success ||
        !metaConfig.data
    ) {

        throw new Error(
            "META CONFIG NOT FOUND"
        );

    }


    const accessToken =
        metaConfig.data.access_token;

    const wabaId =
        metaConfig.data.waba_id;


    if (!accessToken || !wabaId) {

        throw new Error(
            "META CONFIGURATION IS INCOMPLETE"
        );

    }


    const response =
        await axios.get(

            `https://graph.facebook.com/v24.0/${wabaId}/message_templates`,

            {

                headers: {

                    Authorization:
                        `Bearer ${accessToken}`

                }

            }

        );


    const templates =
        response.data.data || [];


    for (
        const template
        of templates
    ) {

        const languageCode =

            template.language?.code ||

            template.language ||

            "en_US";


        const existing =
            await db.query(

                `
                SELECT id
                FROM whatsapp_templates
                WHERE tenant_id=$1
                  AND meta_template_id=$2
                `,

                [tenant_id, template.id]

            );


        /*
        =====================================
        UPDATE EXISTING TEMPLATE
        =====================================
        */

        if (
            existing.rows.length > 0
        ) {

            await db.query(

                `
                UPDATE whatsapp_templates

                SET

                name=$1,
                category=$2,
                language=$3,
                status=$4,
                components=$5

                WHERE tenant_id=$6
                  AND meta_template_id=$7
                `,

                [

                    template.name,

                    template.category,

                    languageCode,

                    template.status,

                    JSON.stringify(
                        template.components || []
                    ),

                    tenant_id,
                    template.id

                ]

            );


            continue;

        }


        /*
        =====================================
        INSERT NEW TEMPLATE
        =====================================
        */

        await db.query(

            `
            INSERT INTO whatsapp_templates
            (
                id,
                tenant_id,
                meta_template_id,
                name,
                category,
                language,
                status,
                components
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8
            )
            `,

            [

                uuidv4(),

                tenant_id,

                template.id,

                template.name,

                template.category,

                languageCode,

                template.status,

                JSON.stringify(
                    template.components || []
                )

            ]

        );

    }


    return {

        success: true,

        total:
            templates.length

    };

};



export default {

    createTemplate,

    uploadMediaToMeta,

    getTemplates,

    syncTemplatesFromMeta

};