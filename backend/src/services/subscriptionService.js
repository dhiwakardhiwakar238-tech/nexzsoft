import pool from "../config/db.js";
import metaConfigService from "./metaConfigService.js";

/*
==================================================
ACTIVATE PAY AS YOU GROW
==================================================
*/

export const activateUsageSubscription = async (tenantId) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        /*
        --------------------------------------------------
        Get current trial subscription
        --------------------------------------------------
        */

        const existingResult = await client.query(
            `
            SELECT *
            FROM tenant_subscriptions
            WHERE tenant_id = $1
              AND subscription_status IN ('trialing', 'active')
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [tenantId]
        );


        if (existingResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return {
                success: false,
                status: 404,
                message: "No active subscription or trial account found."
            };

        }


        /*
        --------------------------------------------------
        Activate Pay As You Grow
        --------------------------------------------------

        trial_started_at is intentionally preserved.

        trial_ends_at is set to the activation time because
        the tenant is leaving the trial immediately.

        started_at is set to the same activation timestamp.

        billing_status changes to Paid
        --------------------------------------------------
        */

        const result = await client.query(
            `
            UPDATE tenant_subscriptions
            SET
                subscription_status = 'active',
                billing_status = 'Paid',
        
                trial_ends_at = NOW(),
                started_at = NOW(),
        
                current_period_start = NOW(),
                current_period_end = NOW() + INTERVAL '1 month',
                next_billing_at = NOW() + INTERVAL '1 month',
                last_billed_at = NOW(),
                amt = 0,
                grace_period_started_at = NULL,
                grace_period_ends_at = NULL,
                ended_at = NULL,
                updated_at = NOW()
        
            WHERE subscription_id = $1
            RETURNING *
            `,
            [existingResult.rows[0].subscription_id]
        );

        const currentYear = new Date().getFullYear();

        const tenantPrefix = tenantId
            .replace(/-/g, "")
            .substring(0, 8)
            .toUpperCase();

        const invoiceSequenceResult = await client.query(
            `
            SELECT
                COALESCE(
                    MAX(
                        CAST(
                            RIGHT(invoice_id, 3)
                            AS INTEGER
                        )
                    ),
                    0
                ) + 1 AS next_sequence
            FROM subscription_payment_history
            WHERE invoice_id LIKE $1
                `,
                [`${tenantPrefix}INV${currentYear}%`]
            );
        
        const nextSequence =
            invoiceSequenceResult.rows[0].next_sequence;
       
        const invoiceId =
            `${tenantPrefix}INV${currentYear}${String(nextSequence).padStart(3, "0")}`;

        await client.query(
            `
            INSERT INTO subscription_payment_history (
                tenant_id,
                subscription_id,
                invoice_id,
                billed_at,
                amount,
                currency,
                billing_status
            )
            VALUES (
                $1,
                $2,
                $3,
                NOW(),
                $4,
                $5,
                $6
            )
            `,
            [
                tenantId,
                result.rows[0].subscription_id,
                invoiceId,
                99,
                "INR",
                "Paid"
            ]
        );

        await client.query("COMMIT");


        return {
            success: true,
            status: 200,
            message: "Pay As You Grow subscription activated.",
            subscription: result.rows[0]
        };


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Activate usage subscription error:",
            error
        );

        throw error;

    } finally {

        client.release();

    }
};

export const getTenantSubscription = async (tenantId) => {
    const query = `
        SELECT
            subscription_id,
            tenant_id,
            plan_id,
            subscription_status,
            billing_status,
            trial_started_at,
            trial_ends_at,
            started_at,
            current_period_start,
            current_period_end,
            next_billing_at,
            last_billed_at,
            grace_period_started_at,
            grace_period_ends_at,
            cancelled_at,
            ended_at,
            created_at,
            updated_at,
            amt
        FROM tenant_subscriptions
        WHERE tenant_id = $1
        LIMIT 1
    `;

    const { rows } = await pool.query(
        query,
        [tenantId]
    );

    return rows[0] || null;
};

/*
==================================================
GET PAYMENT HISTORY
==================================================
*/

export const getPaymentHistory = async (tenantId) => {

    const query = `
        SELECT
            payment_id,
            tenant_id,
            subscription_id,
            invoice_id,
            billed_at,
            amount,
            currency,
            billing_status,
            created_at
        FROM subscription_payment_history
        WHERE tenant_id = $1
        ORDER BY billed_at DESC, created_at DESC
    `;

    const { rows } = await pool.query(
        query,
        [tenantId]
    );

    return rows;
};

/*
==================================================
CANCEL SUBSCRIPTION
==================================================
*/

export const cancelSubscription = async (tenantId) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // ============================================================
        // 1. FIND CURRENT SUBSCRIPTION
        // ============================================================

        const subscriptionResult = await client.query(
            `
            SELECT
                subscription_id,
                subscription_status
            FROM tenant_subscriptions
            WHERE tenant_id = $1
              AND subscription_status IN ('trialing', 'active')
              AND cancelled_at IS NULL
              AND ended_at IS NULL
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [tenantId]
        );


        if (subscriptionResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return {
                success: false,
                status: 404,
                message: "No active subscription found."
            };

        }


        const subscription =
            subscriptionResult.rows[0];

        // ============================================================
        // 2. CANCEL SUBSCRIPTION
        // ============================================================

        const updateResult = await client.query(
            `
            UPDATE tenant_subscriptions
            SET
                subscription_status = 'cancelled',
                cancelled_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE subscription_id = $1
            RETURNING *
            `,
            [subscription.subscription_id]
        );


        await client.query("COMMIT");


        return {
            success: true,
            status: 200,
            message: "Subscription cancelled successfully.",
            subscription: updateResult.rows[0]
        };

        // ============================================================
        // 3. DISCONNECT WHATSAPP
        // ============================================================

        await metaConfigService.disconnectMetaConfig(
            tenantId
        );

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Cancel subscription service error:",
            error
        );

        throw error;

    } finally {

        client.release();

    }

};
