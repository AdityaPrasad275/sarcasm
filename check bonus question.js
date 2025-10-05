import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import axios from "axios";
import fs from "fs"; // Required to create and write to HTML file
import readline from "readline";

const accessToken = process.env.ACCESS_TOKEN_UD; // Access token from .env

// Headers with the token
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// Submit Answer Function
const submitAnswer = async (answer, question_id) => {
  const formData = {
    answer,
    question_id,
  };

  try {
    const response = await axios.post(
      "https://seekout.sarc-iitb.org/api/Authenticate/check-answer",
      JSON.stringify(formData),
      { headers }
    );

    if (response.status === 200) {
      console.log(`✅ Correct Answer: ${answer}`);
      return response.data;
    }
  } catch (error) {
    // Get the raw HTML error response
    console.log(error);
    const rawHtml = error.response?.data || "An unknown error occurred.";

    fs.writeFileSync("errorReport.html", rawHtml);
    console.log("Error report saved as errorReport.html. Open this file in your browser.");
  }
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for question_id
rl.question('Enter the question ID: ', async (question_id) => {
  if (!question_id) {
    console.log("Invalid question ID. Exiting...");
    rl.close();
    return;
  }

  const answer = { "bruh": "bruh" }; // Replace with actual answer

  console.log("Starting answer submission...");
  await submitAnswer(answer, parseInt(question_id));
  console.log("Answer submitted!");

  rl.close();
});