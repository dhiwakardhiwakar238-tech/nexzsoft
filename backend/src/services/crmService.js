import leadStageService from "./leadStageService.js";

import { v4 as uuidv4 } from "uuid";

import crmRepository from "../repositories/crmRepository.js";

import leadScoreService from "./leadScoreService.js";

/*
==================================================
PROCESS LEAD
==================================================
*/

const processLead = async (

    phone,

    customerMemory,

    customerMessage

) => {



    /*
====================================
MEMORY MAP
====================================
*/

    const memory = {};

    for (const item of customerMemory) {

        memory[item.memory_key] =
            item.memory_value;

    }

    /*
    -----------------------------------------
    LOAD LEAD
    -----------------------------------------
    */

    let lead =
        await crmRepository.getLeadByPhone(phone);

    /*
    -----------------------------------------
    CREATE
    -----------------------------------------
    */

    if (!lead) {

        lead =
            await crmRepository.createLead(

                uuidv4(),

                phone,

                memory.name || null,

                memory.company || null,

                memory.product || null

            );

    }

    /*
    -----------------------------------------
    UPDATE DETAILS
    -----------------------------------------
    */

    await crmRepository.updateLeadDetails(

        phone,

        memory.name,

        memory.company,

        memory.product

    );

    /*
 -----------------------------------------
 LOAD PREVIOUS ACTIVITIES
 -----------------------------------------
 */

    const oldActivities =
        await crmRepository.getLeadActivities(
            lead.id
        );

    const previousActivities =
        oldActivities
            .map(row => row.activity)
            .filter(Boolean);

    /*
    -----------------------------------------
    SCORE
    -----------------------------------------
    */

    const scoreResult =
        leadScoreService.calculateLeadScore(

            customerMessage,

            lead.lead_score || 0,

            previousActivities

        );

    /*
    -----------------------------------------
    LEAD STAGE
    -----------------------------------------
    */

    const leadStage =
        leadStageService.detectStage(

            customerMessage,

            lead.lead_status || "NEW"

        );

    console.log("========== LEAD STAGE ==========");

    console.log(
        "Previous :", lead.lead_status,
        "Current :", leadStage
    );

    /*
    -----------------------------------------
    UPDATE SCORE
    -----------------------------------------
    */

    await crmRepository.updateLeadScore(

        phone,

        scoreResult.score,

        leadStage

    );

    /*
    -----------------------------------------
    SAVE NEW ACTIVITIES ONLY
    -----------------------------------------
    */

    for (const activity of scoreResult.activities) {

        if (!activity) continue;

        await crmRepository.addActivity(

            uuidv4(),

            lead.id,

            activity,

            customerMessage

        );

    }

  /*
-----------------------------------------
LOAD ALL ACTIVITIES
-----------------------------------------
*/

const leadActivities =
    await crmRepository.getLeadActivities(lead.id);

/*
-----------------------------------------
RETURN
-----------------------------------------
*/

return {

    score: scoreResult.score,

    previousStage: lead.lead_status,

    currentStage: leadStage,

    activities: leadActivities

};

};

export default {

    processLead

};