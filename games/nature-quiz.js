// Nature Trivia Quiz Game

let natureQuizState = {
    currentQuestion: 0,
    score: 0,
    questions: [
        {
            question: "What is the largest rainforest in the world?",
            answers: ["Amazon Rainforest 🌳", "Congo Rainforest", "Daintree Rainforest", "Tongass Rainforest"],
            correct: 0
        },
        {
            question: "Which flower is known as the 'Queen of Flowers'?",
            answers: ["Lotus", "Tulip", "Rose 🌹", "Sunflower"],
            correct: 2
        },
        {
            question: "What is the tallest type of tree in the world?",
            answers: ["Oak Tree", "Sequoia 🌲", "Pine Tree", "Banyan Tree"],
            correct: 1
        },
        {
            question: "How many wings does a butterfly have?",
            answers: ["2 wings", "4 wings 🦋", "6 wings", "8 wings"],
            correct: 1
        },
        {
            question: "Which bird is the fastest in the world?",
            answers: ["Eagle", "Hawk", "Peregrine Falcon 🦅", "Hummingbird"],
            correct: 2
        },
        {
            question: "What percentage of Earth is covered by water?",
            answers: ["50%", "60%", "71% 🌊", "80%"],
            correct: 2
        },
        {
            question: "Which is the largest ocean on Earth?",
            answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean 🌊"],
            correct: 3
        },
        {
            question: "What do bees collect from flowers?",
            answers: ["Water", "Pollen & Nectar 🐝", "Seeds", "Leaves"],
            correct: 1
        },
        {
            question: "How long can a tree live?",
            answers: ["100 years", "500 years", "1,000 years", "Over 5,000 years 🌳"],
            correct: 3
        },
        {
            question: "What is the process by which plants make their food?",
            answers: ["Respiration", "Photosynthesis 🌿", "Digestion", "Fermentation"],
            correct: 1
        }
    ]
};

function initNatureQuiz() {
    natureQuizState.currentQuestion = 0;
    natureQuizState.score = 0;
    updateNatureQuizScore();
    showNatureQuestion();
}

function showNatureQuestion() {
    const questionData = natureQuizState.questions[natureQuizState.currentQuestion];
    const questionText = document.getElementById('natureQuestionText');
    const answersContainer = document.getElementById('natureAnswersContainer');
    const feedbackDiv = document.getElementById('natureQuizFeedback');
    
    // Clear previous content
    answersContainer.innerHTML = '';
    feedbackDiv.innerHTML = '';
    
    // Show question with typing effect
    questionText.textContent = '';
    let charIndex = 0;
    const typingInterval = setInterval(() => {
        if (charIndex < questionData.question.length) {
            questionText.textContent += questionData.question[charIndex];
            charIndex++;
        } else {
            clearInterval(typingInterval);
            setTimeout(() => showNatureAnswers(), 300);
        }
    }, 30);
}

function showNatureAnswers() {
    const questionData = natureQuizState.questions[natureQuizState.currentQuestion];
    const answersContainer = document.getElementById('natureAnswersContainer');
    
    questionData.answers.forEach((answer, index) => {
        setTimeout(() => {
            const button = document.createElement('button');
            button.className = 'answer-btn';
            button.textContent = answer;
            button.style.opacity = '0';
            button.style.transform = 'translateX(-50px)';
            
            button.onclick = () => checkNatureAnswer(index, button);
            
            answersContainer.appendChild(button);
            
            setTimeout(() => {
                button.style.transition = 'all 0.3s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateX(0)';
            }, 50);
        }, index * 150);
    });
}

function checkNatureAnswer(selectedIndex, button) {
    const questionData = natureQuizState.questions[natureQuizState.currentQuestion];
    const allButtons = document.querySelectorAll('#natureAnswersContainer .answer-btn');
    const feedbackDiv = document.getElementById('natureQuizFeedback');
    
    // Disable all buttons
    allButtons.forEach(btn => btn.disabled = true);
    
    // Suspenseful delay
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        
        if (selectedIndex === questionData.correct) {
            // Correct!
            button.classList.add('correct');
            natureQuizState.score += 10;
            updateNatureQuizScore();
            
            feedbackDiv.innerHTML = `
                <div style="color: #2ecc71; font-size: 1.5rem; animation: correctAnswer 0.5s ease;">
                    ✅ Correct! Amazing! 🎉
                </div>
            `;
            
            createNatureQuizConfetti();
        } else {
            // Wrong
            button.classList.add('wrong');
            allButtons[questionData.correct].classList.add('correct');
            
            feedbackDiv.innerHTML = `
                <div style="color: #e74c3c; animation: shake 0.5s ease;">
                    ❌ Not quite! The answer was: ${questionData.answers[questionData.correct]}
                </div>
            `;
        }
        
        // Move to next question
        setTimeout(() => {
            natureQuizState.currentQuestion++;
            
            if (natureQuizState.currentQuestion < natureQuizState.questions.length) {
                updateNatureQuizScore();
                showNatureQuestion();
            } else {
                showNatureFinalScore();
            }
        }, 2500);
    }, 800);
}

function updateNatureQuizScore() {
    const questionNum = document.getElementById('natureQuestionNum');
    const quizPoints = document.getElementById('natureQuizPoints');
    
    if (questionNum) questionNum.textContent = natureQuizState.currentQuestion + 1;
    if (quizPoints) quizPoints.textContent = natureQuizState.score;
}

function showNatureFinalScore() {
    const questionContainer = document.querySelector('#natureQuizGame .question-container');
    const feedbackDiv = document.getElementById('natureQuizFeedback');
    const scoreDiv = document.getElementById('natureQuizScore');
    
    questionContainer.innerHTML = '';
    feedbackDiv.innerHTML = '';
    scoreDiv.innerHTML = '';
    
    const totalQuestions = natureQuizState.questions.length;
    const maxScore = totalQuestions * 10;
    const percentage = (natureQuizState.score / maxScore) * 100;
    
    let message = '';
    let emoji = '';
    
    if (percentage === 100) {
        message = 'Perfect Score! You\'re a Nature Expert! 🏆';
        emoji = '🏆';
    } else if (percentage >= 80) {
        message = 'Excellent! You love nature! 🌟';
        emoji = '🌟';
    } else if (percentage >= 60) {
        message = 'Great job! Keep learning! 🌿';
        emoji = '🌿';
    } else {
        message = 'Good effort! Nature is wonderful! 🌸';
        emoji = '🌸';
    }
    
    questionContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; animation: bounceIn 0.8s ease;">
            <div style="font-size: 6rem; margin-bottom: 20px;">${emoji}</div>
            <h2 style="font-size: 2.5rem; color: var(--dark-text); margin-bottom: 20px;">
                Nature Quiz Complete!
            </h2>
            <div style="font-size: 3.5rem; font-weight: bold; color: var(--primary-green); margin: 25px 0;">
                ${natureQuizState.score} / ${maxScore}
            </div>
            <p style="font-size: 1.5rem; color: var(--dark-text); margin-bottom: 30px;">
                ${message}
            </p>
            <div style="background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%); padding: 20px; border-radius: 15px; margin: 20px 0;">
                <p style="font-size: 1.2rem; color: var(--dark-text); margin: 0;">
                    🌍 "The Earth has music for those who listen" 🌿
                </p>
            </div>
            <button onclick="initNatureQuiz()" style="
                padding: 15px 40px;
                font-size: 1.3rem;
                background: linear-gradient(135deg, var(--primary-green), var(--secondary-green));
                color: white;
                border: none;
                border-radius: 30px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
                margin-top: 20px;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Play Again 🔄
            </button>
        </div>
    `;
    
    // Grand finale nature confetti
    for (let i = 0; i < 7; i++) {
        setTimeout(() => createNatureQuizConfetti(), i * 200);
    }
}

function createNatureQuizConfetti() {
    const natureEmojis = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🍃', '🌿', '🦋', '🐦'];
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = natureEmojis[Math.floor(Math.random() * natureEmojis.length)];
            confetti.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: -30px;
                font-size: 2.5rem;
                z-index: 10000;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            const fallDuration = 2500 + Math.random() * 1000;
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0.9 }
            ], {
                duration: fallDuration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), fallDuration);
        }, i * 100);
    }
}
