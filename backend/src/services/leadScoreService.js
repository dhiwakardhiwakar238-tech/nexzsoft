/*
==================================================
LEAD SCORE ENGINE
==================================================
*/

const calculateLeadScore = (

    message,

    currentScore = 0,

    previousActivities = []

) => {

    let score = currentScore;

    const text = message.toLowerCase();

    const activities = [];

    /*
    ==========================================
    BUY
    ==========================================
    */

    if (

        /(buy|purchase|order|subscribe)/i.test(text)

    ) {

        score += 40;

        if (!previousActivities.includes("Interested to Buy")) {

            activities.push("Interested to Buy");

        }

    }

    /*
    ==========================================
    DEMO
    ==========================================
    */

    if (

        /(demo|book demo|need demo|schedule demo)/i.test(text)

    ) {

        score += 30;

        if (!previousActivities.includes("Requested Demo")) {

            activities.push("Requested Demo");

        }

    }

    /*
    ==========================================
    QUOTATION
    ==========================================
    */

    if (

        /(quotation|quote|estimate)/i.test(text)

    ) {

        score += 30;

        if (!previousActivities.includes("Requested Quotation")) {

            activities.push("Requested Quotation");

        }

    }

    /*
    ==========================================
    PRICE
    ==========================================
    */

    if (

        /(price|pricing|cost)/i.test(text)

    ) {

        score += 20;

        if (!previousActivities.includes("Asked Pricing")) {

            activities.push("Asked Pricing");

        }

    }

    /*
    ==========================================
    CALL
    ==========================================
    */

    if (

        /(call me|contact me)/i.test(text)

    ) {

        score += 25;

        if (!previousActivities.includes("Requested Call")) {

            activities.push("Requested Call");

        }

    }

    /*
    ==========================================
    FEATURES
    ==========================================
    */

    if (

        /(feature|features|module)/i.test(text)

    ) {

        score += 15;

        if (!previousActivities.includes("Asked Features")) {

            activities.push("Asked Features");

        }

    }

    /*
    ==========================================
    SUPPORT
    ==========================================
    */

    if (

        /(issue|problem|complaint|support)/i.test(text)

    ) {

        score -= 10;

        if (!previousActivities.includes("Support Issue")) {

            activities.push("Support Issue");

        }

    }

    /*
    ==========================================
    LIMIT
    ==========================================
    */

    if (score > 100) score = 100;

    if (score < 0) score = 0;

    /*
    ==========================================
    RETURN
    ==========================================
    */

    return {

        score,

        activities

    };

};

export default {

    calculateLeadScore

};