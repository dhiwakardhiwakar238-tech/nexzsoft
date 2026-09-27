/*
==================================================
INTENT DETECTOR
==================================================
*/

export const detectIntent = (message) => {

    const text = message.toLowerCase().trim();

    /*
    ==========================================
    GREETING
    ==========================================
    */

    if (/^(hi|hello|hey|hii|good morning|good afternoon|good evening)$/i.test(text)) {
        return "greeting";
    }

    /*
    ==========================================
    THANKS
    ==========================================
    */

    if (/(thank you|thanks|thx|thank)/i.test(text)) {
        return "thanks";
    }

    /*
    ==========================================
    GOODBYE
    ==========================================
    */

    if (/(bye|goodbye|see you|take care)/i.test(text)) {
        return "bye";
    }

    /*
    ==========================================
    MEMORY UPDATE
    ==========================================
    */

    if (

        /my name is/i.test(text) ||
        /i am /i.test(text) ||
        /i'm /i.test(text) ||

        /my company is/i.test(text) ||
        /company is/i.test(text) ||

        /my email is/i.test(text) ||
        /email is/i.test(text) ||

        /my phone is/i.test(text) ||
        /phone number is/i.test(text) ||

        /my product is/i.test(text) ||
        /product is/i.test(text) ||

        /i live in/i.test(text) ||

        /working at/i.test(text) ||
        /work at/i.test(text)

    ) {

        return "memory_update";

    }

    /*
    ==========================================
    MEMORY QUESTIONS
    ==========================================
    */

    if (

        /what is my name/i.test(text) ||
        /who am i/i.test(text) ||

        /what is my company/i.test(text) ||
        /company name/i.test(text) ||
        /which company/i.test(text) ||
        /where do i work/i.test(text) ||

        /what is my product/i.test(text) ||
        /which product/i.test(text) ||

        /what is my email/i.test(text) ||

        /what is my phone/i.test(text) ||
        /phone number/i.test(text) ||

        /what do you know about me/i.test(text) ||
        /remember me/i.test(text)

    ) {

        return "memory";

    }

    /*
    ==========================================
    CONNECT TO AGENT
    ==========================================
    */
    
    if (
    
        /connect_to_agent/i.test(text) ||
    
        /(connect me to an agent|connect me with an agent)/i.test(text) ||
    
        /(talk to an agent|speak to an agent)/i.test(text) ||
    
        /(talk to a human|speak to a human)/i.test(text) ||
    
        /(live agent|human agent|customer support)/i.test(text)
    
    ) {
    
        return "connect_to_agent";
    
    }

    /*
    ==========================================
    SALES
    ==========================================
    */

    if (

        /(demo|need demo|book demo|schedule demo|product demo)/i.test(text) ||

        /(price|pricing|quotation|quote|cost)/i.test(text) ||

        /(buy|purchase|order|subscribe)/i.test(text) ||

        /(interested|i want|want to buy)/i.test(text)

    ) {

        return "sales";

    }

    /*
    ==========================================
    SALES FOLLOW-UP
    ==========================================
    */

    if (

        /(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(text) ||

        /\b\d{1,2}\s?(am|pm)\b/i ||

        /(morning|afternoon|evening)/i.test(text) ||

        /^(yes|yeah|sure|ok|okay)$/i.test(text)

    ) {

        return "sales";

    }

    /*
    ==========================================
    COMPANY POLICY
    ==========================================
    */

    if (

        /(refund|refund policy)/i.test(text) ||

        /(privacy|privacy policy)/i.test(text) ||

        /(terms|terms of service)/i.test(text) ||

        /(gst|invoice|billing)/i.test(text) ||

        /(shipping|delivery|dispatch)/i.test(text) ||

        /(warranty)/i.test(text) ||

        /(subscription|cancel subscription)/i.test(text)

    ) {

        return "policy";

    }

    /*
    ==========================================
    GENERAL AI
    ==========================================
    */

    return "general";

};
