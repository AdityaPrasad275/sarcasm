require("dotenv").config(); // Load environment variables

const axios = require("axios");
const fs = require("fs"); // Required to create and write to files
const readline = require("readline");
const cheerio = require("cheerio");

const accessToken = process.env.ACCESS_TOKEN_UD; // Access token from .env

// Headers with the token
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// Extract 'correct_answer' from raw HTML
const extractCorrectAnswer = (html) => {
  const $ = cheerio.load(html); // Load the HTML content into cheerio

  // Find the table row containing "correct_answer"
  const row = $("tr").filter((_, el) => {
    return $(el).find("td").first().text().trim() === "correct_answer";
  });

  // Extract the text from the <pre> tag within the second <td>
  const correctAnswer = row.find("td").eq(1).find("pre").text().trim();
  return correctAnswer;
};

// Append data to the Markdown file
const appendToMarkdownFile = (questionId, correctAnswer) => {
  const filePath = "results.md";
  const data = `- **ID**: ${questionId}\n  **Answer**: ${correctAnswer}\n\n`;

  fs.appendFileSync(filePath, data, (err) => {
    if (err) {
      console.error("Failed to write to results.md:", err);
    } else {
      console.log("Results successfully logged in results.md.");
    }
  });
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
    console.log(error);
    // Get the raw HTML error response
    const rawHtml = error.response?.data || "An unknown error occurred.";

    fs.writeFileSync("errorReport.html", rawHtml);
    console.log("Error report saved as errorReport.html. Open this file in your browser.");

    // Extract correct_answer from the HTML error response
    const correctAnswer = extractCorrectAnswer(rawHtml);
    console.log(`Extracted Correct Answer: ${correctAnswer}`);

    // Append to Markdown file
    appendToMarkdownFile(question_id, correctAnswer);

    return correctAnswer;
  }
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask for question_id
rl.question("Enter the question ID: ", async (question_id) => {
  if (!question_id) {
    console.log("Invalid question ID. Exiting...");
    rl.close();
    return;
  }

  const answer = { bruh: "bruh" }; // Replace with actual answer

  console.log("Starting answer submission...");
  await submitAnswer(answer, parseInt(question_id));
  console.log("Answer submitted!");

  rl.close();
});
