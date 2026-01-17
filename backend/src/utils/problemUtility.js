import axios from "axios";

/* ---------------- LANGUAGE MAP ---------------- */

const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 63,
    "python": 71
  };

  return language[lang.toLowerCase()];
};

/* ---------------- SUBMIT BATCH ---------------- */

const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions/batch",
      { submissions },
      {
        params: { base64_encoded: "false" },
        headers: {
          "x-rapidapi-key": process.env.JUDGE0_KEY,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json"
        }
      }
    );

    return response.data; // ✅ MUST return this
  } catch (error) {
    console.error("submitBatch error:", error.response?.data || error.message);
    throw error;
  }
};

/* ---------------- PROPER WAIT FUNCTION ---------------- */

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* ---------------- GET RESULT BY TOKENS ---------------- */

const submitToken = async (resultToken) => {
  while (true) {
    try {
      const response = await axios.get(
        "https://judge0-ce.p.rapidapi.com/submissions/batch",
        {
          params: {
            tokens: resultToken.join(","),
            base64_encoded: "false",
            fields: "*"
          },
          headers: {
            "x-rapidapi-key": process.env.JUDGE0_KEY,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      const submissions = response.data.submissions;

      const isDone = submissions.every(
        r => r.status_id !== 1 && r.status_id !== 2
      );

      if (isDone) return submissions;

      await wait(1000); // ✅ IMPORTANT
    } catch (error) {
      console.error("submitToken error:", error.response?.data || error.message);
      throw error;
    }
  }
};

export { getLanguageById, submitBatch, submitToken };

