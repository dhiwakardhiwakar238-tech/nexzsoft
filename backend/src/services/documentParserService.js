import fs from "fs";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

async function extractPDF(filePath) {

    // Convert Buffer -> Uint8Array
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await pdfjsLib.getDocument({
        data
    }).promise;

    let text = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {

        const page = await pdf.getPage(pageNo);

        const content = await page.getTextContent();

        text +=
            content.items
                .map(item => item.str)
                .join(" ") + "\n";

    }

    return text;

}

const extractDOCX = async (filePath) => {

    const result = await mammoth.extractRawText({
        path: filePath
    });

    return result.value;

};

const extractTXT = (filePath) => {

    return fs.readFileSync(filePath, "utf8");

};

const extractText = async (filePath, mimeType) => {

    if (!fs.existsSync(filePath)) {

        throw new Error("Document not found");

    }

    if (mimeType === "application/pdf") {

        return await extractPDF(filePath);

    }

    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {

        return await extractDOCX(filePath);

    }

    if (mimeType === "text/plain") {

        return extractTXT(filePath);

    }

    throw new Error("Unsupported file");

};

export default {
    extractText
};