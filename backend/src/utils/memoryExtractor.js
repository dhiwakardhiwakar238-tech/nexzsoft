/*
==========================================
MEMORY EXTRACTOR
==========================================
*/

export const extractMemory = (message) => {

    const text = message.trim();

    const memory = {};

    /*
    ==========================================
    NAME
    ==========================================
    */

    const namePatterns = [

        /my name is\s+([a-zA-Z ]+)/i,
        /i am\s+([a-zA-Z ]+)/i,
        /i'm\s+([a-zA-Z ]+)/i,
        /this is\s+([a-zA-Z ]+)/i

    ];

    for (const pattern of namePatterns) {

        const match = text.match(pattern);

        if (match) {

            memory.name = match[1].trim();

            break;

        }

    }

    /*
    ==========================================
    COMPANY
    ==========================================
    */

    const companyPatterns = [

        /my company is\s+([a-zA-Z0-9&., -]+)/i,
        /company is\s+([a-zA-Z0-9&., -]+)/i,
        /working at\s+([a-zA-Z0-9&., -]+)/i,
        /work at\s+([a-zA-Z0-9&., -]+)/i,
        /from\s+([a-zA-Z0-9&., -]+)\s+company/i

    ];

    for (const pattern of companyPatterns) {

        const match = text.match(pattern);

        if (match) {

            memory.company = match[1].trim();

            break;

        }

    }

    /*
    ==========================================
    PRODUCT
    ==========================================
    */

    const productPatterns = [

        /i want\s+(.+)/i,
        /need\s+(.+)/i,
        /looking for\s+(.+)/i,
        /interested in\s+(.+)/i,
        /product is\s+(.+)/i

    ];

    for (const pattern of productPatterns) {

        const match = text.match(pattern);

        if (match) {

            memory.product = match[1].trim();

            break;

        }

    }

    /*
    ==========================================
    EMAIL
    ==========================================
    */

    const email = text.match(

        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i

    );

    if (email) {

        memory.email = email[0];

    }

    /*
    ==========================================
    PHONE
    ==========================================
    */

    const phone = text.match(

        /(\+91[\s-]?)?[6-9]\d{9}/

    );

    if (phone) {

        memory.phone = phone[0];

    }

    /*
    ==========================================
    DEMO DATE
    ==========================================
    */
    const datePatterns = [

        /\b(today)\b/i,

        /\b(tomorrow|tommorow)\b/i,

        /\b(mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday)\b/i,

        /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}\b/i,

        /\b\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/i

    ];

    for (const pattern of datePatterns) {

        const match = text.match(pattern);

        if (match) {

            memory.demo_date = match[0];

            break;

        }

    }

    /*
    ==========================================
    DEMO TIME
    ==========================================
    */

    const timePatterns = [

        /\b\d{1,2}\s?(am|pm)\b/i,
        /\b\d{1,2}:\d{2}\s?(am|pm)?\b/i,
        /\b(morning|afternoon|evening)\b/i

    ];

    for (const pattern of timePatterns) {

        const match = text.match(pattern);

        if (match) {

            memory.demo_time = match[0];

            break;

        }

    }



    /*
    ==========================================
    CITY
    ==========================================
    */

    const cityPatterns = [

        /i live in\s+([a-zA-Z ]+)/i,
        /my city is\s+([a-zA-Z ]+)/i

    ];

    for (const pattern of cityPatterns) {

        const match = text.match(pattern);

        if (match) {

            memory.city = match[1].trim();

            break;

        }

    }

    /*
    ==========================================
    AGE
    ==========================================
    */

    const age = text.match(

        /(\d{1,2})\s*years?\s*old/i

    );

    if (age) {

        memory.age = age[1];

    }

    /*
    ==========================================
    WEBSITE
    ==========================================
    */

    const website = text.match(

        /(https?:\/\/[^\s]+)|(www\.[^\s]+)/i

    );

    if (website) {

        memory.website = website[0];

    }

    return memory;

};