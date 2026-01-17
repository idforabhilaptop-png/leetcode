import axios from "axios";

const testPiston = async () => {
  console.log("Testing Piston API...");
  
  try {
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "python",
        version: "3.10.0",
        files: [{
          name: "main.py",
          content: 'a, b = map(int, input().split())\nprint(a + b)'
        }],
        stdin: "5 3"
      },
      { timeout: 10000 }
    );
    
    console.log("SUCCESS!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("FAILED!");
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
};

testPiston();