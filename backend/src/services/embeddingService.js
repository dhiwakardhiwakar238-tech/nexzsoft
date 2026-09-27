import axios from "axios";

const generateEmbedding = async (text) => {

    try {

        const cleanedText = String(text)
            .replace(/\s+/g, " ")
            .trim();

        const response = await axios.post(

            "http://localhost:11434/api/embeddings",

            {

                model: "nomic-embed-text",

                prompt: cleanedText

            },

            {

                timeout: 60000

            }

        );

        if (!response.data.embedding) {

            throw new Error("Embedding not returned from Ollama");

        }

        return response.data.embedding;

    }

    catch (err) {

        console.log("=================================");
        console.log("OLLAMA EMBEDDING ERROR");
        console.log(err.response?.data || err.message);
        console.log("=================================");

        throw err;

    }

};

export default {
    generateEmbedding
};