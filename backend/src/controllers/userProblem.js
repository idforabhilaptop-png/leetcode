

// const Submission = require("../models/submission");
// const SolutionVideo = require("../models/solutionVideo")

const { default: Problem } = require("../models/problems");
const { default: Submission } = require("../models/submission");
const { default: User } = require("../models/users");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtility");

const createProblem = async (req, res) => {

  // API request to authenticate user:
  const { title, description, difficulty, tags,
    visibleTestCases, hiddenTestCases, startCode,
    referenceSolution, problemCreator
  } = req.body;


  try {

    for (const { language, completeCode } of referenceSolution) {


      // source_code:
      // language_id:
      // stdin: 
      // expectedOutput:

      const languageId = getLanguageById(language);

      // I am creating Batch submission
      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));


      const submitResult = await submitBatch(submissions);
      
      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

      const testResult = await submitToken(resultToken);


      console.log(testResult);

      for (const test of testResult) {
        if (test.status_id != 3) {
          return res.status(400).send("Error Occured");
        }
      }

    }


    // We can store it in our DB

    const userProblem = await Problem.create({
      ...req.body,
      problemCreatedBy: req.result._id
    });

    res.status(201).send("Problem Saved Successfully");
  }
  catch (err) {
    res.status(400).send("Error: " + err);
  }
}


const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { 
    title, 
    description, 
    difficulty, 
    tags,
    visibleTestCases, 
    invisibleTestCases, 
    startCode,
    referenceSolution, 
  } = req.body;

  try {
    if (!id) {
      return res.status(400).json({ error: "Missing ID Field" });
    }

    const DsaProblem = await Problem.findById(id);
    if (!DsaProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Validate all reference solutions against visible test cases
    for (let i = 0; i < referenceSolution.length; i++) {
      const { language, completeCode } = referenceSolution[i];

      const languageId = getLanguageById(language);

      const submissions = visibleTestCases.map((testcase) => ({
        source_code: completeCode,
        language_id: languageId,
        stdin: testcase.input,
        expected_output: testcase.output
      }));

      const submitResult = await submitBatch(submissions);
      const resultToken = submitResult.map((value) => value.token);
      const testResult = await submitToken(resultToken);

      // Check each test result with detailed error reporting
      for (let j = 0; j < testResult.length; j++) {
        const test = testResult[j];
        if (test.status_id !== 3) {
          // Status ID 3 = Accepted
          // Provide detailed error information
          return res.status(400).json({
            error: "Reference solution validation failed",
            details: {
              language,
              testCaseIndex: j,
              input: visibleTestCases[j].input,
              expectedOutput: visibleTestCases[j].output,
              actualOutput: test.stdout || test.stderr || "No output",
              status: test.status?.description || "Unknown error",
              statusId: test.status_id
            }
          });
        }
      }
    }

    // Build update object with only the fields that should be updated
    const updateData = {
      title,
      description,
      difficulty,
      tags,
      visibleTestCases,
      invisibleTestCases,
      startCode,
      referenceSolution,
    };

    const newProblem = await Problem.findByIdAndUpdate(
      id, 
      updateData, 
      { runValidators: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: newProblem
    });
  } catch (err) {
    console.error("Update problem error:", err);
    res.status(500).json({ 
      error: "Internal server error", 
      message: err.message 
    });
  }
};

const deleteProblem = async (req, res) => {

  const { id } = req.params;
  try {

    if (!id)
      return res.status(400).send("ID is Missing");

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deletedProblem)
      return res.status(404).send("Problem is Missing");


    res.status(200).send("Successfully Deleted");
  }
  catch (err) {

    res.status(500).send("Error: " + err);
  }
}


const getProblemById = async (req, res) => {

  const { id } = req.params;
  try {

    if (!id)
      return res.status(400).send("ID is Missing");

    const getProblem = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution ');

    // video ka jo bhi url wagera le aao

    if (!getProblem)
      return res.status(404).send("Problem is Missing");

    //  const videos = await SolutionVideo.findOne({problemId:id});

    //  if(videos){   

    //  const responseData = {
    //   ...getProblem.toObject(),
    //   secureUrl:videos.secureUrl,
    //   thumbnailUrl : videos.thumbnailUrl,
    //   duration : videos.duration,
    //  } 

    //  return res.status(200).send(responseData);
    //  }

    res.status(200).send(getProblem);

  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}


const getAllProblem = async (req, res) => {

  try {

    const getProblem = await Problem.find({}).select('_id title difficulty tags');

    if (getProblem.length == 0)
      return res.status(404).send("Problem is Missing");


    res.status(200).send(getProblem);
  }
  catch (err) {
    res.status(500).send("Error: " + err);
  }
}


const solvedAllProblembyUser = async (req, res) => {

  try {

    const userId = req.result._id;

    const user = await User.findById(userId).populate({
      path: "problemSolved",
      select: "_id title difficulty tags"
    });

    res.status(200).send(user.problemSolved);

  }
  catch (err) {
    res.status(500).send("Error:"+err);
  }
}


const submittedProblem = async(req,res)=>{

  try{

    const userId = req.result._id;
    const problemId = req.params.pid;

   const ans = await Submission.find({userId,problemId});

  if(ans.length==0)
    return res.status(200).send("No Submission is present");

  return res.status(200).send(ans);

  }
  catch(err){
     res.status(500).send("Internal Server Error :",err.message);
  }
}

module.exports = { createProblem, updateProblem ,deleteProblem,getProblemById,getAllProblem,solvedAllProblembyUser,submittedProblem };
