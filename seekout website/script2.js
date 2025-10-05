// Get the access token from a meta tag
const accessToken = document.querySelector('meta[name="access-token"]').content;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${accessToken}`,
};

// Extract 'correct_answer' from raw HTML
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

// Submit the answer and handle the response
const submitAnswer = async (answer, question_id) => {
  const formData = { answer, question_id };

  try {
    const response = await axios.post(
      "https://seekout.sarc-iitb.org/api/Authenticate/check-answer",
      JSON.stringify(formData),
      { headers }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error submitting answer:", error);

    const rawHtml = error.response?.data || "An unknown error occurred.";
    const correctAnswer = extractCorrectAnswer(rawHtml);

    return {
      success: false,
      errorData: rawHtml,
      correctAnswer,
    };
  }
};

// Save data to localStorage
const saveToLocalStorage = (questionId, result) => {
  const existingData = JSON.parse(localStorage.getItem("answersData")) || [];
  existingData.push({ questionId, result });
  localStorage.setItem("answersData", JSON.stringify(existingData));
};

// Load data from localStorage and display on the page
const loadFromLocalStorage = () => {
  const existingData = JSON.parse(localStorage.getItem("answersData")) || [];
  const answersList = document.getElementById("answers-list");
  const errorResponse = document.getElementById("error-response");

  existingData.forEach(({ questionId, result }) => {
    const listItem = document.createElement("li");

    if (result.success) {
      listItem.textContent = `ID: ${questionId}, Status: ✅ Correct Answer Submitted!`;
    } else {
      listItem.innerHTML = `
        <strong>ID: ${questionId}</strong><br />
        <strong>Error:</strong> ${result.correctAnswer}
      `;
    }

    answersList.appendChild(listItem);

    // Optional: Append raw error data to the error section for the last submission
    if (!result.success && result.errorData) {
      errorResponse.textContent =
        typeof result.errorData === "object"
          ? JSON.stringify(result.errorData, null, 2)
          : result.errorData;
    }
  });
};

// Fetch and display the answer
const fetchAndDisplayAnswer = async () => {
  const questionId = document.getElementById("question-id-input").value.trim();

  if (!questionId) {
    alert("Please enter a valid Question ID.");
    return;
  }

  // Use a placeholder answer
  const placeholderAnswer = { dummy: "value" };

  const result = await submitAnswer(placeholderAnswer, questionId);

  // Save the result to localStorage
  saveToLocalStorage(questionId, result);

  // Dynamically update the UI
  const answersList = document.getElementById("answers-list");
  const errorResponse = document.getElementById("error-response");
  const listItem = document.createElement("li");

  if (result.success) {
    listItem.textContent = `ID: ${questionId}, Status: ✅ Correct Answer Submitted!`;
  } else {
    listItem.innerHTML = `
      <strong>ID: ${questionId}</strong><br />
      <strong>Error:</strong> ${result.correctAnswer}
    `;

    // Show raw error data for the last submission
    errorResponse.textContent =
      typeof result.errorData === "object"
        ? JSON.stringify(result.errorData, null, 2)
        : result.errorData;
  }

  answersList.appendChild(listItem);
};

// Add event listener to the button
document.getElementById("fetch-answer").addEventListener("click", fetchAndDisplayAnswer);

// Load data from localStorage when the page loads
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
