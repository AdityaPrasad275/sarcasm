// Get the access token from a meta tag
const accessToken = document.querySelector('meta[name="access-token"]').content;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// Extract 'correct_answer' from raw HTML using DOMParser
const extractCorrectAnswer = (html) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const rows = doc.querySelectorAll("tr");
    for (const row of rows) {
      const cells = row.querySelectorAll("td");
      if (cells[0]?.textContent.trim() === "correct_answer") {
        const correctAnswer = cells[1]?.querySelector("pre")?.textContent.trim();
        return correctAnswer || "Correct answer not found.";
      }
    }
    return "Correct answer not found.";
  } catch (error) {
    console.error("Error parsing HTML:", error);
    return "Error parsing HTML.";
  }
};

// Submit the answer and display the response
const submitAnswer = async (question_id) => {
  const answer = { bruh: "bruh" };
  const formData = { answer, question_id };

  try {
    const response = await axios.post(
      "https://seekout.sarc-iitb.org/api/Authenticate/check-answer",
      JSON.stringify(formData),
      { headers }
    );

    // document.getElementById("result").textContent = "✅ Correct Answer!";
    // document.getElementById("error-response").textContent = ""; // Clear error section
    // return response.data;
  } catch (error) {
    console.error("Error submitting answer:", error);

    const rawHtml = error.response?.data || "An unknown error occurred.";

    // Display raw error data on the website
    document.getElementById("error-response").textContent =
      typeof rawHtml === "object" ? JSON.stringify(rawHtml, null, 2) : rawHtml;

    const correctAnswer = extractCorrectAnswer(rawHtml);
    document.getElementById("result").textContent = "❌ Incorrect Answer.";
    document.getElementById("correct-answer").textContent = `Correct Answer: ${correctAnswer}`;

    return correctAnswer;
  }
};

// Fetch the question, submit a wrong answer, and handle the response
const fetchAndSubmitAnswer = async () => {
  try {
    const response = await axios.get(
      "https://seekout.sarc-iitb.org/api/Authenticate/fetch-question",
      { headers }
    );

    const question_id = response.data.id;
    console.log("Fetched Question ID:", question_id);

    await submitAnswer(question_id);
  } catch (error) {
    console.error("Error fetching question or submitting answer:", error);

    const rawHtml = error.response?.data || "An unknown error occurred.";
    document.getElementById("error-response").textContent =
      typeof rawHtml === "object" ? JSON.stringify(rawHtml, null, 2) : rawHtml;
  }
};

// Add an event listener for the button click
document.getElementById("check-answer").addEventListener("click", fetchAndSubmitAnswer);
