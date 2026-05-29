// Game Variables
const startSection = document.getElementById("start-section");
const startForm = document.getElementById("start-form");
const playerNameInput = document.getElementById("player-name");
const questionCountSelect = document.getElementById("question-count");
const difficultyLevel = document.getElementById("difficulty-level");
const messageText = document.getElementById("message-text");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const totalQuestions = document.getElementById("total-questions");
const scoreText = document.getElementById("score");

let questions = [];
let currentIndex = 0;
let score = 0;
let playerName = "";

// Start Quiz
const startQuiz = async (event) => {
  event.preventDefault();
  playerName = playerNameInput.value.trim();

  if (playerName.length < 1) {
    messageText.textContent = "Please enter at least 1 characters for your name.";
    return;
  }

  messageText.textContent = "Loading questions...";
  const amount = questionCountSelect.value;
  const difficulty = difficultyLevel.value;
  questions = await getQuestions(amount, difficulty);
  currentIndex = 0;
  score = 0;
  scoreText.textContent = score;
  totalQuestions.textContent = questions.length;
  startSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  quizSection.classList.remove("hidden");

  showQuestion();
};

startForm.addEventListener("submit", startQuiz);

// Get Questions (Open Trivia DB API)
const getQuestions = async (amount, difficulty) => {
  const url = `https://opentdb.com/api.php?amount=${amount}&category=9&difficulty=${difficulty}&type=multiple`;
  const response = await fetch(url);
  const data = await response.json();

      if (response.ok) {
          console.log(data);
      } else {
          throw new Error(data.error);
      }

  return data.results;
};