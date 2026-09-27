import { Annotation } from "@langchain/langgraph";

export const ragState = Annotation.Root({
    question: Annotation(),
    tenantId: Annotation(),

    retrievedChunks: Annotation(),
    answer: Annotation(),
});

export default ragState;