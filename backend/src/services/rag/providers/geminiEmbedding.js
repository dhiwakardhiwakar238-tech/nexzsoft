import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_EMBEDDING_MODEL
});

export const generateGeminiEmbedding = async (
    text,
    taskType
) => {

    const result = await model.embedContent({
        content: {
            parts: [
                {
                    text
                }
            ]
        },
        taskType
    });

    // Get vector from Gemini response
    const embedding = result.embedding.values;

    // Expected dimension from environment
    const expectedDimension = Number(
        process.env.EMBEDDING_DIMENSION
    );

    // Validate dimension
    if (embedding.length !== expectedDimension) {
        throw new Error(
            `Embedding dimension mismatch. ` +
            `Expected ${expectedDimension}, ` +
            `received ${embedding.length}`
        );
    }

    return embedding;
};

export default{
    generateGeminiEmbedding
};