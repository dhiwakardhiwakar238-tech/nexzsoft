/*
==================================================
LEAD STAGE ENGINE
==================================================
*/

const STAGES = {
    NEW: "NEW",
    CONTACTED: "CONTACTED",
    INTERESTED: "INTERESTED",
    QUALIFIED: "QUALIFIED",
    PROPOSAL: "PROPOSAL",
    WON: "WON",
    LOST: "LOST"
};

const detectStage = (

    message,

    currentStage = STAGES.NEW,

    activities = []

) => {

    const text = message.toLowerCase();

    /*
    ==========================================
    WON
    ==========================================
    */

    if (

        /(payment|paid|invoice|order confirmed|purchase completed|completed payment|transaction)/i.test(text)

    ) {

        return STAGES.WON;

    }

    /*
    ==========================================
    PROPOSAL
    ==========================================
    */

    if (

        /(proposal|quotation|quote|estimate)/i.test(text)

    ) {

        return STAGES.PROPOSAL;

    }

    /*
    ==========================================
    QUALIFIED
    ==========================================
    */

    if (

        /(demo|meeting|schedule|appointment|call|video call)/i.test(text)

    ) {

        return STAGES.QUALIFIED;

    }

    /*
    ==========================================
    INTERESTED
    ==========================================
    */

    if (

        /(price|pricing|cost|feature|features|details|information|buy|purchase|order|interested)/i.test(text)

    ) {

        return STAGES.INTERESTED;

    }

    /*
    ==========================================
    CONTACTED
    ==========================================
    */

    if (

        currentStage === STAGES.NEW

    ) {

        return STAGES.CONTACTED;

    }

    return currentStage;

};

export default {

    detectStage,

    STAGES

};