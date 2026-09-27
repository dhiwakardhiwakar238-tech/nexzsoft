import searchService from "./searchService.js";

import repository from "../repositories/knowledgeRepository.js";
import { v4 as uuidv4 } from "uuid";
import * as groqService from "./groqService.js";

const SIMILARITY_THRESHOLD = 0.55;

/*
==================================================
RAG AI
==================================================
*/

const askAI = async (

    question,

    customerMemory = {},

    conversationHistory = [],

    crm = null

) => {

    /*
 =========================================
 SEARCH KNOWLEDGE
 =========================================
 */

    const searchResult =
        await searchService.searchKnowledge(

            question,

            customerMemory.company

        );

    console.log("=================================");
    console.log("RAG SEARCH");
    console.log("Best Score :", searchResult.bestScore);
    console.log("Chunks :", searchResult.total);
    console.log("=================================");

    /*
  =========================================
  BUILD CONTEXT
  =========================================
  */

    let companyPolicy = "";

    let sourceFiles = [];

    if (

        searchResult.success &&

        searchResult.bestScore >= SIMILARITY_THRESHOLD

    ) {

        companyPolicy =

            searchResult.chunks

                .map(chunk =>

                    `Document :
${chunk.title}

Content :

${chunk.chunk}`

                )

                .join("\n\n");

        sourceFiles = [

            ...new Set(

                searchResult.chunks.map(

                    x => x.title

                )

            )

        ];

    }

    /*
    ==========================================
    MEMORY
    ==========================================
    */

    const memory = {

        name: customerMemory.name || "",

        company: customerMemory.company || "",

        email: customerMemory.email || "",

        phone: customerMemory.phone || "",

        product: customerMemory.product || ""

    };

    /*
    ==========================================
    HISTORY
    ==========================================
    */

    const history =
        conversationHistory || [];

    /*
    ==========================================
    CRM
    ==========================================
    */

    const crmContext = crm
        ? {

            score: crm.score,

            stage: crm.currentStage,

            activities: crm.activities || []

        }
        : {};
    /*
    =========================================
    SYSTEM CONTEXT
    =========================================
    */

    let systemContext = `

==============================
CUSTOMER
==============================

Name :
${memory.name}

Company :
${memory.company}

Email :
${memory.email}

Phone :
${memory.phone}

Interested Product :
${memory.product}

==============================
CRM
==============================

Lead Score :
${crmContext.score || 0}

Lead Stage :
${crmContext.stage || ""}

Activities :

${crmContext.activities.join(", ")}

`;

    if (companyPolicy) {

        systemContext += `

==============================
KNOWLEDGE BASE
==============================

${companyPolicy}

`;

    }

    /*
    ==========================================
    GROQ
    ==========================================
    */

    const answer =
        await groqService.generateReply(

            systemContext,

            question,

            memory,

            history

        );

    /*
=========================================
SAVE KNOWLEDGE LOG
=========================================
*/

    try {

        await repository.saveKnowledgeLog(

            uuidv4(),

            memory.company || null,

            question,

            sourceFiles.length
                ? sourceFiles[0]
                : "No Match",

            searchResult.bestScore || 0,

            answer,

            0

        );

    }

    catch (err) {

        console.log("Knowledge Log Save Failed");

        console.log(err.message);

    }


    /*
    =========================================
    SAVE AI RESPONSE
    =========================================
    */

    if (

        searchResult.success &&

        searchResult.total > 0

    ) {

        searchResult.chunks[0].aiResponse = answer;

    }

    /*
   =========================================
   RETURN
   =========================================
   */

    if (

        !companyPolicy ||

        sourceFiles.length === 0

    ) {

        return answer;

    }

    return `${answer}

-------------------------

Knowledge Source

${sourceFiles.join("\n")}

`;

};

export default {

    askAI

};