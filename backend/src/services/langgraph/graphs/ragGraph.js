/*
 * RAG LangGraph
 *
 * Flow:
 *
 * START
 *   ↓
 * retrieveDocuments
 *   ↓
 * generateAnswer
 *   ↓
 * END
 */

import {
    StateGraph,
    START,
    END
} from "@langchain/langgraph";

import RagState from "../state/ragState.js";

import retrieveDocuments
    from "../nodes/retrieveDocuments.js";

import generateAnswer
    from "../nodes/generateAnswer.js";


const ragGraph = new StateGraph(RagState)

    /*
     * Register retrieval node.
     */
    .addNode(
        "retrieveDocuments",
        retrieveDocuments
    )

    /*
     * Register answer generation node.
     */
    .addNode(
        "generateAnswer",
        generateAnswer
    )

    /*
     * START → retrieveDocuments
     */
    .addEdge(
        START,
        "retrieveDocuments"
    )

    /*
     * retrieveDocuments → generateAnswer
     */
    .addEdge(
        "retrieveDocuments",
        "generateAnswer"
    )

    /*
     * generateAnswer → END
     */
    .addEdge(
        "generateAnswer",
        END
    );


export default ragGraph.compile();