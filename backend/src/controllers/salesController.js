import db from "../config/db.js";
import { badRequest } from "../utils/apiError.js";

const salesLead = async (

    req, res, next

) =>

{ try
    {
        console.log("Received sales lead:", req.body);

        const {
            name,
            email,
            whatsapp,
            message,
            source = "website",
        } = req.body;

        // Basic validation

        if (!name || !email || !whatsapp) {

            throw badRequest("Name, email and WhatsApp number are required.");

        }

        const leadSource =
            source === "career"
                ? "career"
                : "website";

        console.log("Saving message to DB...");

        const result = await db.query( `
            INSERT INTO sales_leads
            (
                name,
                mobile_number,
                message,
                email,
                source,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
            )
            RETURNING *
            `,
            [
                name,
                whatsapp,
                message || null,
                email,
                leadSource,
                "New"
            ]
        );

        console.log("Sales lead saved to DB");

        return res.status(201).json({
            success: true,
            message: "Sales lead saved successfully",
            data: result.rows[0],
        });
    } catch (error) {
        return next(error);
    }
};

export default {
    salesLead,
};
