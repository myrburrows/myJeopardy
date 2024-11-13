let data = [];
let currentQuestionIndex = 0;
let missedQuestions = [];
let reviewingMissedQuestions = false;
let reviewIndex = 0; // Separate index for reviewing missed questions

// Display today's date at the top in the desired format
const today = new Date();
const options = { weekday: 'long', month: 'short', day: '2-digit', year: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);
document.getElementById('date').textContent = formattedDate;

// Determine today's date and the corresponding file path
const yearMonth = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`; // Format: YYYYMM
const day = String(today.getDate()).padStart(2, '0'); // Format: DD
const fileName = `data/${yearMonth}/${yearMonth}${day}.txt`; // Path: data/YYYYMM/YYYYMMDD.txt

// Load data from the dynamically determined file for today
fetch(fileName)
    .then(response => {
        if (!response.ok) {
            throw new Error(`File not found: ${fileName}`);
        }
        return response.text();
    })
    .then(text => {
        // Parse the text file into data objects
        data = text.split('\n').map(line => {
            const [key, category, question, answer] = line.split('\t');
            return { key, category, question, answer };
        });
        displayQuestion(); // Start displaying questions after data loads
    })
    .catch(error => console.error('Error loading data:', error));

// Display the current question and category
function displayQuestion() {
    const currentQuestion = reviewingMissedQuestions ? missedQuestions[reviewIndex] : data[currentQuestionIndex];
    document.getElementById('category').textContent = currentQuestion.category;
    document.getElementById('question').textContent = `${currentQuestion.key}. ${currentQuestion.question}`;
    
    // Reset the Show Answer button text, style, and enable it for the next question
    const showAnswerButton = document.getElementById('show-answer');
    showAnswerButton.textContent = "Show Answer";
    showAnswerButton.disabled = false;
    showAnswerButton.style.backgroundColor = "#4caf50"; // Reset to green background
    showAnswerButton.style.color = "white"; // Reset to white text

    document.getElementById('answer').textContent = currentQuestion.answer; // Store answer in answer element
    document.getElementById('answer').style.display = 'none'; // Keep answer hidden initially

    // Show or hide buttons based on whether we are in review mode
    document.getElementById('response-buttons').style.display = reviewingMissedQuestions ? 'none' : 'block';
    document.getElementById('next-review').style.display = reviewingMissedQuestions ? 'block' : 'none';
    document.getElementById('review-button').style.display = 'none'; // Hide review button during regular questions
}

// Show the answer in the Show Answer button and change its style
function showAnswer() {
    const showAnswerButton = document.getElementById('show-answer');
    showAnswerButton.textContent = document.getElementById('answer').textContent; // Display answer in the button
    showAnswerButton.disabled = true; // Disable the button once the answer is shown
    showAnswerButton.style.backgroundColor = "white"; // Change to white background
    showAnswerButton.style.color = "black"; // Change text to black
}

// Record whether the answer was known or missed, then move to the next question
function recordAnswer(knewIt) {
    if (!knewIt) {
        missedQuestions.push(data[currentQuestionIndex]);
    }

    currentQuestionIndex++;

    // Check if we've finished the main set of questions
    if (currentQuestionIndex >= data.length) {
        if (missedQuestions.length > 0) {
            document.getElementById('review-button').style.display = 'block'; // Show the review button if there are missed questions
            document.getElementById('category').style.display = 'none'; // Hide question 25 and other elements
            document.getElementById('question').style.display = 'none';
            document.getElementById('response-buttons').style.display = 'none';
        } else {
            showExerciseDone(); // Call to display the Exercise Done box if no missed questions
        }
    } else {
        displayQuestion();
    }
}

// Start reviewing missed questions
function startReview() {
    reviewingMissedQuestions = true;
    reviewIndex = 0; // Reset index to start at the first missed question
    document.getElementById('category').style.display = 'block';
    document.getElementById('question').style.display = 'block';
    document.getElementById('response-buttons').style.display = 'none';
    document.getElementById('next-review').style.display = 'block';
    document.getElementById('review-button').style.display = 'none'; // Hide the review button
    displayQuestion();
}

// Move to the next missed question in review mode
function nextReviewQuestion() {
    reviewIndex++;
    if (reviewIndex >= missedQuestions.length) {
        showExerciseDone(); // Call to show completion message with missed count
    } else {
        displayQuestion();
    }
}

// Display an "Exercise Done" box with the number of review questions
function showExerciseDone() {
    document.getElementById('next-review').style.display = 'none'; // Hide Next button after review
    const flashcardDiv = document.querySelector('.flashcard');

    // Create Exercise Done box
    const doneBox = document.createElement('div');
    doneBox.textContent = `Exercise Done! You had ${missedQuestions.length} review questions.`;
    doneBox.style.fontSize = "1.2em";
    doneBox.style.marginTop = "20px";
    doneBox.style.padding = "10px";
    doneBox.style.border = "1px solid #ccc";
    doneBox.style.borderRadius = "8px";
    doneBox.style.backgroundColor = "#e0f7fa";
    doneBox.style.color = "#00796b";
    
    flashcardDiv.appendChild(doneBox); // Append the message to the flashcard container
}
