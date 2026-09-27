import axios from "axios";

import metaConfigService
    from "./metaConfigService.js";

const GRAPH_VERSION = "v24.0";

const GRAPH_URL =
    `https://graph.facebook.com/${GRAPH_VERSION}`;


// =====================================
// EXCHANGE CODE
// =====================================

const exchangeCode = async (code) => {

    const response = await axios.post(

        `${GRAPH_URL}/oauth/access_token`,

        null,

        {

            params: {

                client_id:
                    process.env.APP_ID,

                client_secret:
                    process.env.APP_SECRET,

                code

            }

        }

    );

    return response.data.access_token;

};


// =====================================
// SUBSCRIBE WABA
// =====================================

const subscribeWABA = async (

    wabaId,
    accessToken

) => {

    const response = await axios.post(

        `${GRAPH_URL}/${wabaId}/subscribed_apps`,

        {},

        {

            headers: {

                Authorization:
                    `Bearer ${accessToken}`

            }

        }

    );

    return response.data;

};



// =====================================
// PHONE INFO
// =====================================

const getPhoneInfo = async (

    phoneNumberId,
    accessToken

) => {

    const response = await axios.get(

        `${GRAPH_URL}/${phoneNumberId}`,

        {

            params: {

                fields:

                    "display_phone_number,verified_name,quality_rating,code_verification_status,platform_type,status,name_status,messaging_limit_tier,is_official_business_account,is_on_biz_app,throughput"

            },

            headers: {

                Authorization:
                    `Bearer ${accessToken}`

            }

        }

    );

    return response.data;

};


// =====================================
// WABA INFO
// =====================================

const getWABAInfo = async (

    wabaId,
    accessToken

) => {

    const response = await axios.get(

        `${GRAPH_URL}/${wabaId}`,

        {

            params: {

                fields:

                    "id,name,currency,timezone_id,message_template_namespace,health_status,decision,business_verification_status"

            },

            headers: {

                Authorization:
                    `Bearer ${accessToken}`

            }

        }

    );

    return response.data;

};


// =====================================
// CONNECT WHATSAPP
// =====================================

const connectWhatsApp = async (

    payload

) => {

    try{

    const {

        tenantId,
        code,
        business_id,
        waba_id,
        phone_number_id

    } = payload;

    const accessToken =
        await exchangeCode(code);

    const subscription =
        await subscribeWABA(

            waba_id,
            accessToken

        );

    const phoneInfo =
        await getPhoneInfo(

            phone_number_id,
            accessToken

        );

    const wabaInfo =
        await getWABAInfo(

            waba_id,
            accessToken

        );

    await metaConfigService.updateMetaConfig(

        tenantId,

        {

            access_token:
                accessToken,

            business_id,

            waba_id,

            phone_number_id,

            business_phone:

                phoneInfo.display_phone_number,
            
            business_name:

                phoneInfo.verified_name,

            messaging_limit_tier:

                phoneInfo.messaging_limit_tier,

            quality_rating:

                phoneInfo.quality_rating,

            code_verification_status:

                phoneInfo.code_verification_status,

            name_status:

                phoneInfo.name_status,

            throughput:

                phoneInfo.throughput,

            business_verification_status:

                wabaInfo.business_verification_status,

            payment_status:

                wabaInfo.health_status?.can_send_message,

            can_send_message:
            
                wabaInfo.health_status?.can_send_message,

            error_code:

                wabaInfo.health_status?.entities?.find(entity => entity.entity_type === "WABA").errors?.[0].error_code,

            error_description:

                wabaInfo.health_status?.entities?.find(entity => entity.entity_type === "WABA").errors?.[0].error_description,

            message_template_namespace:

                wabaInfo.message_template_namespace,

            timezone_id:

                wabaInfo.timezone_id,

            is_on_biz_app:

                phoneInfo.is_on_biz_app,

            phone_status:

                phoneInfo.status,

            platform_type:

                phoneInfo.platform_type,

            currency:

                wabaInfo.currency
        }

    );

    return {

        success: true,

        access_token:
            accessToken,

        business_id,

        waba_id,

        phone_number_id,

        business_phone:
            phoneInfo.display_phone_number,

        subscription,

        phone_details:
            phoneInfo,

        waba_details:
            wabaInfo
    };
} catch (err) 
    {
        if (err.response) {
            console.error("Meta API Error:", {
                status: err.response.status,
                data: err.response.data,
            });
            const metaErrorCode =
                err.response.data?.error?.code;
    
            if (String(metaErrorCode) === "133006") {
                throw phoneVerificationRequired();
            }
        } else {
            console.error(
                "Meta Embedded Signup Error:",
                err.message
            );
        }
        throw err;
    }
};

// =====================================
// DISCONNECT
// =====================================

const disconnectWhatsApp = async (

    tenantId

) => {

    await metaConfigService.updateMetaConfig(

        tenantId,

        {

            access_token: null,

            business_id: null,

            waba_id: null,

            phone_number_id: null,

            business_phone: null

        }

    );


    return {

        success: true,

        message:

            "WhatsApp Disconnected"

    };

};


export default {

    connectWhatsApp,
    disconnectWhatsApp

};
