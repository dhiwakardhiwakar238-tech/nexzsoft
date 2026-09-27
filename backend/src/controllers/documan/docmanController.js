import documentService from "../../services/docman/docman.processor.js"

/*
Upload
*/
export const upload = async (req, res, next) => {
    try {
        const result = await documentService.uploadFile(
            req.file,
            req.user
        );

        return res.status(201).json(result);

    } catch (error) {

        console.error("UPLOAD ERROR:", error);
        return next(error);
    }
};


/*
=========================================================
LIST
=========================================================
*/

const getDocuments = async (req, res, next) => {

    try {

        const docs =

            await knowledgeService.getDocuments();

        res.json({

            success: true,

            documents: docs

        });

    }

    catch (err) {

        return next(err);

    }

};

/*
=========================================================
DELETE
=========================================================
*/

const removeDocument = async (req, res, next) => {

    try {

        await knowledgeService.deleteDocument(

            req.params.id

        );

        res.json({

            success: true

        });

    }

    catch (err) {

        return next(err);

    }

};

/*
=========================================================
REINDEX
=========================================================
*/

const reindex = async (req, res, next) => {

    try {

        await knowledgeService.reIndexDocument(

            req.params.id

        );

        res.json({

            success: true

        });

    }

    catch (err) {

        return next(err);

    }

};

export default {

    upload,

    getDocuments,

    removeDocument,

    reindex

};