import multer from "multer";
import express from "express";
import templateController
    from "../controllers/templateController.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});



/*
=====================================
UPLOAD TEMPLATE MEDIA
=====================================
*/

router.post(
    "/templates/media-upload",
    upload.single("media"),
    templateController.uploadMedia
);


/*
=====================================
CREATE TEMPLATE
=====================================
*/

router.post(
    "/templates",
    templateController.createTemplate
);



// sync 


router.post(

    "/templates/sync/:tenantId",

    templateController.syncTemplates

);

/*
=====================================
GET ALL TEMPLATES
=====================================
*/

router.get(
    "/templates/tenant/:tenantId",
    templateController.getTemplates
);


/*
=====================================
SYNC META TEMPLATES
=====================================
*/

router.get(
    "/templates/sync/:tenantId",
    templateController.syncTemplates
);


/*
=====================================
GET SINGLE TEMPLATE
=====================================
*/

router.get(
    "/templates/:id",
    templateController.getTemplate
);


/*
=====================================
DELETE TEMPLATE
=====================================
*/

router.delete(
    "/templates/:id",
    templateController.deleteTemplate
);

export default router;