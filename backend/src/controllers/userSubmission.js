import Problem from "../models/problems"
import Submission from "../models/submission"
import { getLanguageById, submitBatch, submitToken } from "../utils/problemUtility"

const submitCode = async (req, res) => {

    try {

        const userId = req.result._id
        const problemId = req.params.id
        const { code, language } = req.body

        if (!userId || !problemId || !code || !language)
            return res.status(400).send("Some field is missing")

        // fetch the problem from database
        const problem = await Problem.findById(problemId)

        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status: 'pending',
            testCasesTotal: problem.invisibleTestCases.length

        })

        // hum code ab judge zero ko denge 
        const languageId = getLanguageById(language);
        const submissions = problem.invisibleTestCases.map((testcase) => ({
            source_code: code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));

        const submitResult = await submitBatch(submissions);
        const resultToken = submitResult.map((value) => value.token);
        const testResult = await submitToken(resultToken);

        // submittedResult ko update karo
        let testCasesPassed = 0;
        let runtime = 0;
        let memory = 0;
        let status = 'accepted';
        let errorMessage = null;


        for (const test of testResult) {
            if (test.status_id == 3) {
                testCasesPassed++;
                runtime = runtime + parseFloat(test.time)
                memory = Math.max(memory, test.memory);
            } else {
                if (test.status_id == 4) {
                    status = 'error'
                    errorMessage = test.stderr
                }
                else {
                    status = 'wrong'
                    errorMessage = test.stderr
                }
            }
        }

        // Store the result in Database in Submission
        submittedResult.status = status;
        submittedResult.testCasesPassed = testCasesPassed;
        submittedResult.errorMessage = errorMessage;
        submittedResult.runtime = runtime;
        submittedResult.memory = memory;

        await submittedResult.save();

        if (!req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }

        const accepted = (status == 'accepted')
        res.status(201).json({
            accepted,
            totalTestCases: submittedResult.testCasesTotal,
            passedTestCases: testCasesPassed,
            runtime,
            memory
        });

    }
    catch (err) {
        res.status(500).send("Internal Server Error " + err);
    }
}


export default submitCode