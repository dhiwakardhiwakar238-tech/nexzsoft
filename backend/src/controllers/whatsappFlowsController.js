import * as whatsappFlowsService from "../services/whatsappFlowsService.js";

export const saveFlow = async (req, res) => {
    try {
        console.log("FLOW req.user:", req.user);
        console.log("FLOW req.auth:", req.auth);

        const tenantId =
            req.user?.tenant_id ||
            req.auth?.tenant_id;

        console.log("FLOW tenantId:", tenantId);

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant information not found",
            });
        }

        const flow = await whatsappFlowsService.saveFlow(
            req.body,
            tenantId
        );

        return res.status(201).json({
            success: true,
            data: flow,
        });

    } catch (error) {
        console.error("Error saving WhatsApp flow:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save WhatsApp flow",
            error: error.message,
        });
    }
};

export const getFlows = async (req, res) => {
    try {

        console.log("FLOW LIST req.user:", req.user);
        console.log("FLOW LIST req.auth:", req.auth);

        const tenantId =
            req.user?.tenant_id ||
            req.auth?.tenant_id;

        console.log("FLOW LIST tenantId:", tenantId);

        if (!tenantId) {
            return res.status(401).json({
                success: false,
                message: "Tenant information not found",
            });
        }

        const flows =
            await whatsappFlowsService.getFlows(
                tenantId
            );

        return res.status(200).json({
            success: true,
            data: flows,
        });

    } catch (error) {

        console.error(
            "Error fetching WhatsApp flows:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch WhatsApp flows",
            error: error.message,
        });
    }
};
