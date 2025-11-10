// Birthday Quiz Game

let quizGameState = {
    currentQuestion: 0,
    score: 0,
    questions: [
        {
            question: "What is Kalpana's favorite thing in nature?",
            answers: ["Mountains 🏔️", "Flowers 🌸", "Ocean 🌊", "All of Nature 🌿"],
            correct: 3
        },
        {
            question: "When is Kalpana's birthday?",
            answers: ["November 10", "November 11", "November 12", "November 13"],
            correct: 1
        },
        {
            question: "How old is Kalpana turning?",
            answers: ["18 years", "19 years", "20 years", "21 years"],
            correct: 2
        },
        {
            question: "What makes Kalpana special?",
            answers: ["Her love for nature", "Her beautiful smile", "Her kind heart", "All of the above ❤️"],
            correct: 3
        },
        {
            question: "What's the best birthday wish for Kalpana?",
            answers: [
                "May you bloom like flowers 🌺",
                "May you grow strong like trees 🌳",
                "May you soar high like butterflies 🦋",
                "All beautiful wishes! 🎉"
            ],
            correct: 3
        }
    ]
};

function initQuizGame() {
    quizGameState.currentQuestion = 0;
    quizGameState.score = 0;
    updateQuizScore();
    showQuestion();
}

function showQuestion() {
    const questionData = quizGameState.questions[quizGameState.currentQuestion];
    const questionText = document.getElementById('questionText');
    const answersContainer = document.getElementById('answersContainer');
    const feedbackDiv = document.getElementById('quizFeedback');
    
    // Clear previous content
    answersContainer.innerHTML = '';
    feedbackDiv.innerHTML = '';
    
    // Show question with suspenseful typing effect
    questionText.textContent = '';
    let charIndex = 0;
    const typingInterval = setInterval(() => {
        if (charIndex < questionData.question.length) {
            questionText.textContent += questionData.question[charIndex];
            charIndex++;
        } else {
            clearInterval(typingInterval);
            // Show answers after question is fully typed
            setTimeout(() => showAnswers(), 300);
        }
    }, 30);
}

function showAnswers() {
    const questionData = quizGameState.questions[quizGameState.currentQuestion];
    const answersContainer = document.getElementById('answersContainer');
    
    questionData.answers.forEach((answer, index) => {
        setTimeout(() => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.style.opacity = '0';
            button.style.transform = 'translateX(-50px)';
            
            button.onclick = () => checkAnswer(index, button);
            
            answersContainer.appendChild(button);
            
            // Animate button appearance
            setTimeout(() => {
                button.style.transition = 'all 0.3s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateX(0)';
            }, 50);
        }, index * 150);
    });
}

function checkAnswer(selectedIndex, button) {
    const questionData = quizGameState.questions[quizGameState.currentQuestion];
    const allButtons = document.querySelectorAll('.answer-btn');
    const feedbackDiv = document.getElementById('quizFeedback');
    
    // Disable all buttons
    allButtons.forEach(btn => btn.disabled = true);
    
    // Suspenseful delay before revealing answer
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        
        if (selectedIndex === questionData.correct) {
            // Correct answer!
            button.classList.add('correct');
            quizGameState.score += 20;
            updateQuizScore();
            
            feedbackDiv.innerHTML = `
                <div style="color: #2ecc71; font-size: 1.5rem; animation: correctAnswer 0.5s ease;">
                    ✅ Correct! Well done! 🎉
                </div>
            `;
            
            // Show confetti
            createQuizConfetti();
        } else {
            // Wrong answer
            button.classList.add('wrong');
            allButtons[questionData.correct].classList.add('correct');
            
            feedbackDiv.innerHTML = `
                <div style="color: #e74c3c; animation: shake 0.5s ease;">
                    ❌ Oops! The correct answer was: ${questionData.answers[questionData.correct]}
                </div>
            `;
        }
        
        // Move to next question after delay
        setTimeout(() => {
            quizGameState.currentQuestion++;
            
            if (quizGameState.currentQuestion < quizGameState.questions.length) {
                updateQuizScore();
                showQuestion();
            } else {
                showFinalScore();
            }
        }, 2500);
    }, 800);
}

function updateQuizScore() {
    const questionNum = document.getElementById('questionNum');
    const quizPoints = document.getElementById('quizPoints');
    
    if (questionNum) questionNum.textContent = quizGameState.currentQuestion + 1;
    if (quizPoints) quizPoints.textContent = quizGameState.score;
}

function showFinalScore() {
    const questionContainer = document.querySelector('.question-container');
    const feedbackDiv = document.getElementById('quizFeedback');
    const scoreDiv = document.getElementById('quizScore');
    
    questionContainer.innerHTML = '';
    feedbackDiv.innerHTML = '';
    scoreDiv.innerHTML = '';
    
    const totalQuestions = quizGameState.questions.length;
    const maxScore = totalQuestions * 20;
    const percentage = (quizGameState.score / maxScore) * 100;
    
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = 'Perfect Score! You know Kalpana so well! 🏆';
        emoji = '🎉';
    } else if (percentage >= 80) {
        message = 'Excellent! You did amazing! 🌟';
        emoji = '⭐';
    } else if (percentage >= 60) {
        message = 'Good job! Keep it up! 👏';
        emoji = '👍';
    } else {
        message = 'Nice try! Every attempt counts! 💪';
        emoji = '🌸';
    }
    
    questionContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; animation: bounceIn 0.8s ease;">
            <div style="font-size: 5rem; margin-bottom: 20px;">${emoji}</div>
            <h2 style="font-size: 2.5rem; color: var(--dark-text); margin-bottom: 20px;">
                Quiz Complete!
            </h2>
            <div style="font-size: 3rem; font-weight: bold; color: var(--primary-green); margin: 20px 0;">
                ${quizGameState.score} / ${maxScore}
            </div>
            <p style="font-size: 1.5rem; color: var(--dark-text); margin-bottom: 30px;">
                ${message}
            </p>
            <button onclick="initQuizGame()" style="
                padding: 15px 40px;
                font-size: 1.2rem;
                background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
                color: white;
                border: none;
                border-radius: 30px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Play Again 🔄
            </button>
        </div>
    `;
    
    // Grand finale confetti
    for (let i = 0; i < 5; i++) {
        setTimeout(() => createQuizConfetti(), i * 200);
    }
}

function createQuizConfetti() {
    const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e91e63'];
    const emojis = ['🎉', '🎊', '⭐', '✨', '🌟'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const isEmoji = Math.random() > 0.5;
            const confetti = document.createElement('div');
            
            if (isEmoji) {
                confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                confetti.style.fontSize = '2rem';
            } else {
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            }
            
            confetti.style.cssText += `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: -20px;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            const fallDuration = 2000 + Math.random() * 1000;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: fallDuration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), fallDuration);
        }, i * 100);
    }
}
