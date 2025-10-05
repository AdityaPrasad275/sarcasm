
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import axios from "axios";

const access_token = process.env.ACCESS_TOKEN_UD; // Get the access token from the environment variable

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
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("Error fetching question:", error);
  }
};

// Call the function
fetchQuestion();
