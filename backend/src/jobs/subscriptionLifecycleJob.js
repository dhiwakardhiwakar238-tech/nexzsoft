import pool from "../config/db.js";
import metaConfigService from "../services/metaConfigService.js";

const processSubscriptionLifecycle = async () => {

    try {

        console.log(
            "🔍 Checking subscription billing and grace periods..."
        );


        // ============================================================
        // 1. PROCESS EXPIRED TRIAL GRACE PERIODS
        // ============================================================

        const expiredTrialResult = await pool.query(
            `
            SELECT
                subscription_id,
                tenant_id,
                subscription_status,
                trial_ends_at,
                grace_period_started_at,
                grace_period_ends_at,
                ended_at
            FROM tenant_subscriptions
            WHERE subscription_status = 'trialing'
              AND grace_period_ends_at IS NOT NULL
              AND grace_period_ends_at < CURRENT_TIMESTAMP
              AND ended_at IS NULL
            `
        );


        if (expiredTrialResult.rows.length > 0) {

            console.log(
                `⚠️ Found ${expiredTrialResult.rows.length} expired trial grace period(s).`
            );


            for (const subscription of expiredTrialResult.rows) {

                const {
                    subscription_id,
                    tenant_id
                } = subscription;


                try {

                    console.log(
                        `🔌 Disconnecting WhatsApp for expired trial: ${tenant_id}`
                    );


                    await metaConfigService.disconnectMetaConfig(
                        tenant_id
                    );


                    await pool.query(
                        `
                        UPDATE tenant_subscriptions
                        SET
                            ended_at = CURRENT_TIMESTAMP,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE subscription_id = $1
                          AND subscription_status = 'trialing'
                          AND ended_at IS NULL
                        `,
                        [subscription_id]
                    );


                    console.log(
                        `✅ Trial lifecycle ended for tenant: ${tenant_id}`
                    );


                } catch (error) {

                    console.error(
                        `❌ Failed to process expired trial for tenant ${tenant_id}:`,
                        error
                    );

                }

            }

        } else {

            console.log(
                "✅ No expired trial grace periods found."
            );

        }


        // ============================================================
        // 2. MOVE ACTIVE SUBSCRIPTIONS INTO BILLING GRACE PERIOD
        // ============================================================

        const billingResult = await pool.query(
            `
            SELECT
                subscription_id,
                tenant_id,
                subscription_status,
                billing_status,
                current_period_start,
                current_period_end,
                next_billing_at,
                grace_period_started_at,
                grace_period_ends_at,
                ended_at
            FROM tenant_subscriptions
            WHERE subscription_status = 'active'
              AND billing_status = 'Paid'
              AND current_period_end <= CURRENT_TIMESTAMP
              AND ended_at IS NULL
              AND (
                  grace_period_ends_at IS NULL
                  OR grace_period_ends_at < CURRENT_TIMESTAMP
              )
            `
        );


        if (billingResult.rows.length > 0) {

            console.log(
                `⚠️ Found ${billingResult.rows.length} subscription(s) requiring billing action.`
            );


            for (const subscription of billingResult.rows) {

                const {
                    subscription_id,
                    tenant_id
                } = subscription;


                try {

                    console.log(
                        `💳 Starting billing grace period for tenant: ${tenant_id}`
                    );


                    await pool.query(
                        `
                        UPDATE tenant_subscriptions
                        SET
                            billing_status = 'Pending',
                            amt = 99,
                            grace_period_started_at = CURRENT_TIMESTAMP,
                            grace_period_ends_at =
                                CURRENT_TIMESTAMP + INTERVAL '7 days',
                            updated_at = CURRENT_TIMESTAMP
                        WHERE subscription_id = $1
                          AND subscription_status = 'active'
                          AND billing_status = 'Paid'
                          AND ended_at IS NULL
                        `,
                        [subscription_id]
                    );


                    console.log(
                        `⏳ Tenant ${tenant_id} moved to billing grace period.`
                    );


                } catch (error) {

                    console.error(
                        `❌ Failed to start billing grace period for tenant ${tenant_id}:`,
                        error
                    );

                }

            }

        } else {

            console.log(
                "✅ No subscriptions require billing action."
            );

        }


        // ============================================================
        // 3. PROCESS EXPIRED PAID BILLING GRACE PERIODS
        // ============================================================

        const expiredBillingResult = await pool.query(
            `
            SELECT
                subscription_id,
                tenant_id,
                subscription_status,
                billing_status,
                grace_period_started_at,
                grace_period_ends_at,
                ended_at
            FROM tenant_subscriptions
            WHERE subscription_status = 'active'
              AND billing_status = 'Pending'
              AND grace_period_ends_at IS NOT NULL
              AND grace_period_ends_at < CURRENT_TIMESTAMP
              AND ended_at IS NULL
            `
        );


        if (expiredBillingResult.rows.length > 0) {

            console.log(
                `⚠️ Found ${expiredBillingResult.rows.length} expired billing grace period(s).`
            );


            for (const subscription of expiredBillingResult.rows) {

                const {
                    subscription_id,
                    tenant_id
                } = subscription;


                try {

                    console.log(
                        `🔌 Disconnecting WhatsApp for unpaid subscription: ${tenant_id}`
                    );


                    await metaConfigService.disconnectMetaConfig(
                        tenant_id
                    );


                    await pool.query(
                        `
                        UPDATE tenant_subscriptions
                        SET
                            ended_at = CURRENT_TIMESTAMP,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE subscription_id = $1
                          AND subscription_status = 'active'
                          AND billing_status = 'Pending'
                          AND ended_at IS NULL
                        `,
                        [subscription_id]
                    );


                    console.log(
                        `✅ Subscription lifecycle ended for tenant: ${tenant_id}`
                    );


                } catch (error) {

                    console.error(
                        `❌ Failed to process unpaid subscription for tenant ${tenant_id}:`,
                        error
                    );

                    // ended_at remains NULL.
                    // The next scheduled job will retry.

                }

            }

        } else {

            console.log(
                "✅ No expired billing grace periods found."
            );

        }


        console.log(
            "🏁 Subscription billing job completed."
        );


    } catch (error) {

        console.error(
            "❌ Subscription billing job failed:",
            error
        );

        throw error;

    }

};


export default processSubscriptionLifecycle;
