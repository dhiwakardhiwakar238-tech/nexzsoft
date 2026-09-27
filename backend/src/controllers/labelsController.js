import labelsServices from "../services/labelsService.js";
import { badRequest } from "../utils/apiError.js";

/*
 * Returns all customer labels.
 */
export const getLabels = async (req, res, next) => {

    try {

        const { tenantId } = req.query;

        if (!tenantId) {

            throw badRequest("Tenant ID is required.");

        }

        const labels =
            await labelsServices.getLabels(tenantId);

        res.status(200).json({

            message: "Labels fetched successfully",

            data: labels

        });

    }

    catch (err) {

        return next(err);

    }

};

/*
 * Creates a new customer label.
 */
export const addLabel = async (req, res, next) => {

  try {

    const { tenantId, name } = req.body;

    const label = await labelsServices.addLabel(tenantId, name);

    res.status(201).json({

      message: "Label added successfully",

      data: label

    });

  }

  catch (err) {

    if (err.message === "Label already exists") {

      return next(
        badRequest("This label already exists.")
      );

    }

    return next(err);

  }

};

/*
 * Deletes a customer label.
 */
export const deleteLabel = async (req, res, next) => {

  try {

    const { id } = req.params;

    await labelsServices.deleteLabel(id);

    res.status(200).json({

      message: "Label deleted successfully"

    });

  }

  catch (err) {

    return next(err);

  }

};
