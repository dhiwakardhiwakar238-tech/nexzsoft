import pool from "../config/db.js";
import axios from "axios";
const GRAPH_VERSION = "v24.0";

/*
==================================
GET META CONFIG
==================================
*/

const getMetaConfig = async (tenantId) => {

    const result = await pool.query(

        `
        SELECT *
        FROM meta_configs
        WHERE tenant_id = $1
        `,

        [tenantId]

    );

    if (result.rows.length === 0) {

        return {

            success: false,

            data: null

        };

    }

    return {

        success: true,

        data: result.rows[0]

    };

};


/*
==================================
UPDATE META CONFIG
==================================
*/

const updateMetaConfig = async (

    tenantId,

    payload

) => {

    const {

        access_token,
        phone_number_id,
        waba_id,
        business_id,
        business_phone,
        business_name,
        messaging_limit_tier,
        quality_rating,
        code_verification_status,
        name_status,
        throughput,
        business_verification_status,
        payment_status,
        can_send_message,
        error_code,
        error_description,
        message_template_namespace,
        timezone_id,
        is_on_biz_app,
        phone_status,
        platform_type,
        currency

    } = payload;


    await pool.query(

        `
        UPDATE meta_configs

        SET

        access_token=$1,
        phone_number_id=$2,
        waba_id=$3,
        business_id=$4,
        business_phone=$5,
        business_name=$6,
        messaging_limit_tier=$7,
        quality_rating=$8,
        code_verification_status=$9,
        name_status=$10,
        throughput=$11,
        business_verification_status=$12,
        payment_status=$13,
        can_send_message=$14,
        error_code=$15,
        error_description=$16,
        message_template_namespace=$17,
        timezone_id=$18,
        currency=$19,
        connection_status=$20,
        is_on_biz_app=$22,
        phone_status=$23,
        platform_type=$24,
        updated_at=CURRENT_TIMESTAMP
        WHERE tenant_id=$21
        `,

        [

            access_token,
            phone_number_id,
            waba_id,
            business_id,
            business_phone,
            business_name,
            messaging_limit_tier,
            quality_rating,
            code_verification_status,
            name_status,
            throughput,
            business_verification_status,
            payment_status,
            can_send_message,
            error_code,
            error_description,
            message_template_namespace,
            timezone_id,
            currency,
            'active',
            tenantId,
            is_on_biz_app,
            phone_status,
            platform_type

        ]

    );

     /*
     ==================================
     START TENANT TRIAL
     ==================================
     */

     await pool.query(

         `
         UPDATE tenant_subscriptions

         SET

         subscription_status = 'trialing',

         trial_started_at = CURRENT_TIMESTAMP,

         trial_ends_at = CURRENT_TIMESTAMP + INTERVAL '14 days',

         grace_period_started_at = CURRENT_TIMESTAMP + INTERVAL '14 days',
         
         grace_period_ends_at = CURRENT_TIMESTAMP + INTERVAL '16 days',

         updated_at = CURRENT_TIMESTAMP

         WHERE tenant_id = $1 AND trial_ends_at IS NULL
         `,

         [tenantId]

     );

    return {

        success: true,

        message: "Meta Config & start tenant trial Updated"

    };

};



/*
==================================
DISCONNECT META CONFIG
==================================
*/

const disconnectMetaConfig = async (tenantId) => {
    const result = await pool.query(
        `SELECT access_token, phone_number_id, waba_id
         FROM meta_configs WHERE tenant_id = $1 AND connection_status = 'active'`,
        [tenantId]
    );
    if (result.rows.length === 0) throw new Error("No active WhatsApp configuration found");

    const { access_token, phone_number_id, waba_id } = result.rows[0];

    let phoneInfo = null;
    let finalSubscribed = [];
    let isCoexistence = true; // default true as you said

    // 1. Unsubscribe
    try {
        if (waba_id) {
            await axios.delete(
                `https://graph.facebook.com/${GRAPH_VERSION}/${waba_id}/subscribed_apps`,
                { headers: { Authorization: `Bearer ${access_token}` } }
            );
        }
    } catch (e) {
        console.log('Unsubscribe failed', e.response?.data?.error?.message);
    }

    // 2. Check final subscribed apps
    try {
        if (waba_id) {
            const subRes = await axios.get(
                `https://graph.facebook.com/${GRAPH_VERSION}/${waba_id}/subscribed_apps`,
                { headers: { Authorization: `Bearer ${access_token}` }  }
            );
            finalSubscribed = subRes.data?.data || [];
        }
    } catch (e) {
        finalSubscribed = [];
    }

    // 3. Check phone info - store in DB
    try {
        if (phone_number_id) {
            const phoneRes = await axios.get(
                `https://graph.facebook.com/${GRAPH_VERSION}/${phone_number_id}?fields=id,display_phone_number,status,platform_type,is_on_biz_app,quality_rating,verified_name,throughput`,
                { headers: { Authorization: `Bearer ${access_token}` } }
            );
            phoneInfo = phoneRes.data;
            isCoexistence = phoneInfo.is_on_biz_app === true;
        }
    } catch (e) {
        phoneInfo = { id: phone_number_id, status: 'DELETED' };
    }

    // 4. Mark inactive - FIXED QUERY
    await pool.query(
        `UPDATE meta_configs SET
            connection_status = 'inactive',
            phone_status = $2,
            platform_type = $3,
            is_on_biz_app = $4,
            quality_rating = $5,
            subscribed_apps = $6,
            last_disconnect_check = $7,
            updated_at = CURRENT_TIMESTAMP
         WHERE tenant_id = $1`,
        [
            tenantId,
            phoneInfo?.status || null,
            phoneInfo?.platform_type || null,
            isCoexistence,
            phoneInfo?.quality_rating || null,
            JSON.stringify(finalSubscribed),
            JSON.stringify({ phoneInfo, finalSubscribed, at: new Date() })
        ]    
    );

    const otherApps = finalSubscribed.filter(a => a.id !== process.env.META_APP_ID);

    return {
        success: true,
        message: "Disconnected. Coexistence number stays in Business App."
    };
};

export default {

    getMetaConfig,

    updateMetaConfig,

    disconnectMetaConfig

};
