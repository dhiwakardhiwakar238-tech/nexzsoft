import searchService from "./searchService.js";

/*
==================================================
GET COMPANY POLICY CONTEXT
==================================================
*/

export const getPolicyContext = async (

    question,

    companyName = null

) => {

    const result = await searchService.searchKnowledge(

        question,

        companyName

    );

    return {

        bestScore: result.bestScore,

        chunks: result.chunks,

        found: result.bestScore > 0

    };

};

export default {

    getPolicyContext

};