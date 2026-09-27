import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import path from "path";

const parseDocument = async (file) => {

    if (!file) {
        throw new Error("File is required");
    }

    if (!file.buffer) {
        throw new Error("File buffer is required");
    }

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    switch (extension) {

        case ".pdf":
            return await parsePdf(file.buffer);

        case ".docx":
            return await parseDocx(file.buffer);

        case ".txt":
            return parseTxt(file.buffer);

        default:
            throw new Error(
                `Unsupported document type: ${extension}`
            );
    }
};


const parsePdf = async (buffer) => {

    const parser = new PDFParse({
        data: buffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return cleanText(result.text);
};


const parseDocx = async (buffer) => {

    const result = await mammoth.extractRawText({
        buffer
    });

    return cleanText(result.value);
};


const parseTxt = (buffer) => {

    return cleanText(
        buffer.toString("utf-8")
    );
};


const cleanText = (text) => {

    if (!text) {
        return "";
    }

    return text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};


export default {
    parseDocument
};