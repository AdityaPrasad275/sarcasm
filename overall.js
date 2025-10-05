import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import axios from "axios";
import fs from "fs"; // Required to create and write to HTML file
import readline from "readline";

const access_token = process.env.ACCESS_TOKEN_ADITYA; // Get the access token from the environment variable

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${access_token}`,
};

const fetchQuestion = async () => {
  try {
    const response = await axios.get(
      "https://seekout.sarc-iitb.org/api/Authenticate/fetch-question",
      {
        headers,
      }
    );
    // console.log("Response data:", response.data);
    return response.data.id;
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error; // Re-throw error for handling at higher levels if needed
  }
};

// Store the result in a variable
const main = async () => {
  try {
    const id = await fetchQuestion();
    console.log("Fetched ID:", id); // Use the value as needed

    //stop program here to check if its right till now
    // take input like an enter key press to continue
   
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });

    // rl.question("Press Enter to continue...", () => {
    //   rl.close();
    // });

    // submit answer
    const answer = { "bruh": "bruh" };
    const question_id = id;
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

      // if (response.status === 200) {
      //   console.log(`✅ Correct Answer: ${answer}`);
      //   console.log("Response data:", response.data);
      // }
    } catch (error) {
      // console.log(error);
      //parse the error and save it to a file
      const rawHtml = error.response?.data || "An unknown error occurred.";
      // console.log(rawHtml)

      fs.writeFileSync("errorReport.html", rawHtml);
      console.log("Answer got! check file");

    }

  } catch (error) {
    console.error("Failed to fetch and store the ID:", error);
  }
};

main(); // Call the async main function
