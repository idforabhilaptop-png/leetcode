import mongoose from "mongoose";

const { Schema } = mongoose;

const ProblemSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
            enum: ["Easy", "Medium", "Hard"],
        },
        tags: {
            type: [String],
            enum: ["Array", "String", "Dynamic Programming", "Graph", "Tree", "Math", "Sorting", "Searching", "Backtracking", "Greedy", "Linked List", "Stack", "Queue", "Heap", "Hash Table", "Recursion"],
            required: true,
        },
        visibleTestCases: [
            {
                input: { type: String, required: true },
                output: { type: String, required: true },
                explanation: { type: String, required: true },
            }
        ],
        invisibleTestCases: [
            {
                input: { type: String, required: true },
                output: { type: String, required: true },
            }
        ],
        startCode: [
            {
                language: { type: String, required: true },
                initialCode: { type: String, required: true },
            }
        ],
        referenceSolution: [
            {
                language: { type: String, required: true },
                completeCode: { type: String, required: true },
            }
        ],
        problemCreatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;

