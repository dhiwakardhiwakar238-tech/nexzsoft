
import authService from "../services/authService.js";
import {
    badRequest,
    unauthorized,
    forbidden
} from "../utils/apiError.js";

/*
 * Handles tenant registration requests.
 */
export const register = async (req, res, next) => {
    try {

        console.log("REGISTER HIT:", req.body);

        const {
            name,
            company_name,
            country,
            whatsapp,
            email,
            password
        } = req.body;

        /*
         * Map request field names to service field names.
         */
        const business_name = company_name;
        const whatsapp_number = whatsapp;

        const tenant = await authService.register(
            name,
            business_name,
            country,
            whatsapp_number,
            email,
            password
        );

        return res.status(201).json({
            success: true,
            message: "Tenant registered successfully",
            data: tenant
        });

    } catch (err) {

        if (err.message === "Email already exists") {
            return next(
                badRequest(
                    "This email is already registered. Try logging in instead."
                )
            );
        }

        return next(err);
    }
};


/*
 * Handles tenant login requests.
 */
export const login = async (req, res, next) => {
    try {

        const {
            email,
            password
        } = req.body;

        const result = await authService.login(
            email,
            password
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (err) {

        if (err.message === "Invalid email or password") {
            return next(
                unauthorized(
                    "Incorrect email or password."
                )
            );
        }

        if (
            err.message ===
            "Your account is inactive. Please contact support team."
        ) {
            return next(
                forbidden(
                    err.message
                )
            );
        }

        return next(err);
    }
};


/*
 * Handles tenant account deactivation requests.
 */
export const deactivateAccount = async (req, res, next) => {
    try {

        /*
         * Tenant ID comes from authenticated JWT.
         */
        const tenantId = req.user?.tenant_id;

        if (!tenantId) {
            return next(
                unauthorized(
                    "Authentication required."
                )
            );
        }

        /*
         * Deactivate tenant account.
         */
        const result =
            await authService.deactivateAccount(
                tenantId
            );

        return res.status(200).json({
            success: true,
            message: "Account deactivated successfully",
            data: result
        });

    } catch (err) {

        if (
            err.message ===
            "Tenant ID is required"
        ) {
            return next(
                unauthorized(
                    "Authentication required."
                )
            );
        }

        return next(err);
    }
};

