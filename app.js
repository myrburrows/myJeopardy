let data = [];
let currentQuestionIndex = 0;
let missedQuestions = [];
let reviewingMissedQuestions = false;
let reviewIndex = 0; // Separate index for reviewing missed questions

// Load data from day1.txt
fetch('data/day1.txt')
    .then(response => response.text())
    .then(text => {
        data = text.split('\n').map(line => {
            const [key, category, question, answer] = line.split('\t');
            return { key, category, question, answer };
        });
        displayQuestion();
    })
    .catch(error => console.error('Error loading data:', error));

    function showAnswer() {
        const showAnswerButton = document.getElementById('show-answer');
        showAnswerButton.textContent = document.getElementById('answer').textContent; // Display answer in the button
        showAnswerButton.disabled = true; // Disable the button once the answer is shown
    
        // Change to white background with black text
        showAnswerButton.style.backgroundColor = "white";
        showAnswerButton.style.color = "black";
    }
    
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
            alert("All questions completed with no misses!");
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
        alert("Review completed!");
        document.getElementById('next-review').style.display = 'none'; // Hide Next button after review
    } else {
        displayQuestion();
    }
}
