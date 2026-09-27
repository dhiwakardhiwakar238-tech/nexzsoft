import db from "../config/db.js";

/*
==========================================
GET LEAD
==========================================
*/

const getLeadByPhone = async (phone) => {

    const result = await db.query(

        `
        SELECT *

        FROM crm_leads

        WHERE phone=$1
        `,

        [phone]

    );

    return result.rows[0];

};

/*
==========================================
CREATE LEAD
==========================================
*/

const createLead = async (

    id,

    phone,

    name,

    company,

    product

) => {


    console.log({
        id,
        phone,
        name,
        company,
        product
    });

    const result = await db.query(

        `
      INSERT INTO crm_leads(

    id,

    phone,

    name,

    company,

    interested_product,

    lead_score,

    lead_status

)

       VALUES($1,$2,$3,$4,$5,0,'NEW')

        RETURNING *

        `,

        [

            id,

            phone,

            name,

            company,

            product

        ]

    );

    return result.rows[0];



};




/*
==========================================
UPDATE SCORE
==========================================
*/

const updateLeadScore = async (

    phone,

    score,

    status

) => {

    await db.query(

        `
        UPDATE crm_leads

        SET

        lead_score=$2,

        lead_status=$3,

        updated_at=NOW()

        WHERE phone=$1
        `,

        [

            phone,

            score,

            status

        ]

    );

};

/*
==========================================
UPDATE DETAILS
==========================================
*/

const updateLeadDetails = async (

    phone,

    name,

    company,

    product

) => {

    await db.query(

        `
        UPDATE crm_leads

        SET

        name=COALESCE($2,name),

        company=COALESCE($3,company),

        interested_product=COALESCE($4,interested_product),

        updated_at=NOW()

        WHERE phone=$1
        `,

        [

            phone,

            name,

            company,

            product

        ]

    );

};

/*
==========================================
ADD ACTIVITY
==========================================
*/

const addActivity = async (

    id,

    leadId,

    activity,

    message

) => {

    await db.query(

        `
        INSERT INTO crm_lead_activity(

            id,

            lead_id,

            activity,

            message

        )

        VALUES($1,$2,$3,$4)

        `,

        [

            id,

            leadId,

            activity,

            message

        ]

    );

};




/*
==========================================
GET LEAD ACTIVITIES
==========================================
*/

const getLeadActivities = async (leadId) => {

    const result = await db.query(

        `
        SELECT activity

        FROM crm_lead_activity

        WHERE lead_id = $1

        ORDER BY created_at ASC
        `,

        [leadId]

    );

    return result.rows.map(x => x.activity);

};



/*
==========================================
UPDATE STAGE ONLY
==========================================
*/

const updateLeadStage = async (

    phone,

    stage

) => {

    await db.query(

        `
        UPDATE crm_leads

        SET

        lead_status=$2,

        updated_at=NOW()

        WHERE phone=$1
        `,

        [

            phone,

            stage

        ]

    );

};

export default {

    getLeadByPhone,

    createLead,

    updateLeadScore,

    updateLeadStage,

    updateLeadDetails,

    addActivity,

    getLeadActivities

};