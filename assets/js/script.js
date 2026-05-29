// Game Variables
const unsplashKey = "kmUnvx5aKXe0KanJb7OVWQrdXu3iEF94T_NUMa-3kzY";

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
const questionNumber = document.getElementById("question-number");
const questionImage = document.getElementById("question-image");
const questionText = document.getElementById("question");
const answersContent = document.getElementById("answers-content");
const feedbackSection = document.getElementById("feedback-section");
const feedbackTitle = document.getElementById("feedback-title");
const feedbackText = document.getElementById("feedback-text");
const leaderboard = document.getElementById("leaderboard");

let questions = [];
let currentIndex = 0;
let score = 0;
let playerName = "";
let timer;
let answered = false;

// Start Quiz
const startQuiz = async (event) => {
  event.preventDefault();
  playerName = playerNameInput.value.trim();

  if (playerName.length < 1) {
    messageText.textContent = "Please enter at least 1 characters for your name.";
    return;
  }

  if (unsplashKey === "") {
    messageText.textContent =
      "Please add your Unsplash API key in assets/js/app.js.";
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

// Show Question
const showQuestion = async () => {
  clearInterval(timer);
  answered = false;

  feedbackSection.classList.add("hidden");
  answersContent.innerHTML = "";

  if (currentIndex >= questions.length) {
    endQuiz();
    return;
  }

  const item = questions[currentIndex];

  questionNumber.textContent = currentIndex + 1;
  questionText.textContent = cleanText(item.question);

  questionImage.src = await getImage(item.question, item.correct_answer);
  questionImage.alt = `Image related to ${cleanText(item.correct_answer)}`;

  const answers = [item.correct_answer, ...item.incorrect_answers];

  shuffle(answers).forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.textContent = cleanText(answer);
    button.addEventListener("click", () =>
      checkAnswer(button, answer, item.correct_answer),
    );
    answersContent.appendChild(button);
  });

  startTimer();
};

// Get Image (Unsplash API)
const getImage = async (question, correctAnswer) => {
  const keyword = `${cleanText(correctAnswer)} ${cleanText(question)}`;

  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
    keyword
  )}&orientation=landscape&client_id=${unsplashKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Unsplash request failed");
    }

    const data = await response.json();

    return data?.urls?.regular || "./assets/images/dummy-image.jpg";

  } catch (error) {
    console.error("Image error:", error);

    return "./assets/images/dummy-image.jpg";
  }
};

// Check Answer
const checkAnswer = (button, selectedAnswer, correctAnswer) => {
  if (answered) {
    return;
  }

  answered = true;
  clearInterval(timer);

  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach((btn) => {
    btn.disabled = true;

    if (btn.textContent === cleanText(correctAnswer)) {
      btn.classList.add("correct");
    }
  });

  if (selectedAnswer === correctAnswer) {
    score++;
    scoreText.textContent = score;
    feedbackTitle.textContent = "Correct!";
    feedbackText.textContent = "Well done, that was the right answer.";
  } else {
    button.classList.add("wrong");
    feedbackTitle.textContent = "Incorrect.";
    feedbackText.textContent = `Correct answer: ${cleanText(correctAnswer)}`;
  }

  feedbackSection.classList.remove("hidden");
};

// Show Leaderboard (local storage scores)
const showLeaderboard = () => {
  const scores = JSON.parse(localStorage.getItem("simple-quiz-scores")) || [];

  leaderboard.innerHTML = "";

  if (scores.length === 0) {
    leaderboard.innerHTML = "<li>No scores yet.</li>";
    return;
  }

  scores.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name}: ${item.score}/${item.total} - ${item.date}`;
    leaderboard.appendChild(li);
  });
};

showLeaderboard();