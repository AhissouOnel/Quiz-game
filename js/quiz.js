const start = document.querySelector('.start')
const next = document.querySelector('.next')
const gameContainer = document.querySelector('.questions-container')
const questionsShower =  document.getElementById('questions')
const answersShower = document.querySelector('.answers-buttons')
const time = document.querySelector('.timer')
const scoreContent = document.querySelector('.score')
const questions = [
    {
        question: "Quelle est la syntaxe correcte pour déclarer une variable en JavaScript?",
        answers: [
            {text: 'variable x;', correct: false},
            {text: 'v x;', correct: false},
            {text: 'var x;', correct: true},
            {text: 'let x;', correct: false}
        ]
    },
    {
        question: "Quelle est la fonction utilisée pour afficher du texte dans la console en JavaScript?",
        answers: [
            {text: 'console.log()', correct: true},
            {text: 'print()', correct: false},
            {text: 'log()', correct: false},
            {text: 'display()', correct: false}
        ]
    },
    {
        question: "Quelle méthode est utilisée pour ajouter un élément à la fin d'un tableau en JavaScript?",
        answers: [
            {text: 'push()', correct: true},
            {text: 'append()', correct: false},
            {text: 'addToEnd()', correct: false},
            {text: 'insert()', correct: false}
        ]
    },
    {
        question: "Quelle déclaration permet de créer une fonction en JavaScript?",
        answers: [
            {text: 'function: myFunction()', correct: false},
            {text: 'create myFunction()', correct: false},
            {text: 'new function myFunction()', correct: false},
            {text: 'function myFunction()', correct: true}
        ]
    },
    {
        question: "Quelle est la façon correcte de commenter du code en JavaScript?",
        answers: [
            {text: '/* Comment */', correct: true},
            {text: '// Comment', correct: true},
            {text: '-- Comment --', correct: false},
            {text: '# Comment #', correct: false}
        ]
    },
    {
        question: "Quelle méthode est utilisée pour convertir une chaîne en minuscules en JavaScript?",
        answers: [
            {text: 'toLowerCase()', correct: true},
            {text: 'toLower()', correct: false},
            {text: 'convertToLower()', correct: false},
            {text: 'lowerCase()', correct: false}
        ]
    },
    {
        question: "Quel opérateur est utilisé pour vérifier l'égalité stricte (valeur et type) en JavaScript?",
        answers: [
            {text: '==', correct: false},
            {text: '===', correct: true},
            {text: '=', correct: false},
            {text: '!=', correct: false}
        ]
    },
    {
        question: "Quelle méthode est utilisée pour supprimer le dernier élément d'un tableau en JavaScript?",
        answers: [
            {text: 'delete()', correct: false},
            {text: 'remove()', correct: false},
            {text: 'pop()', correct: true},
            {text: 'cut()', correct: false}
        ]
    },
    {
        question: "Quelle est la fonction utilisée pour arrondir un nombre à l'entier le plus proche en JavaScript?",
        answers: [
            {text: 'round()', correct: true},
            {text: 'floor()', correct: false},
            {text: 'ceil()', correct: false},
            {text: 'truncate()', correct: false}
        ]
    },
    {
        question: "Quelle méthode est utilisée pour obtenir la longueur d'une chaîne en JavaScript?",
        answers: [
            {text: 'lengthOf()', correct: false},
            {text: 'size()', correct: false},
            {text: 'getLength()', correct: false},
            {text: 'length()', correct: true}
        ]
    }
];

// Utilisez maintenant la variable `javascriptQuestions` dans votre code.



let countdown // variable pour stocker le timer
let thisQuestions, currentQuestionIndex//variable contenant les questions
let score = 0 //score initial
let totalTime = 26 //temps total du quiz en secondes


/**************** Gestions des évènements ********************/
start.addEventListener('click', () => {
    startGame()
    resetTimer()
    updateScore()
})//début du jeu

//affichage des questions par le boutons next
next.addEventListener('click', () => {
    currentQuestionIndex++
    stopTimer()
    resetTimer()
    showNextQuestion()
})



/***************************** Gestion des questions ****************************/
function startGame() {
    console.log("click détecté");
    gameContainer.classList.remove('none')
    start.classList.add('none')
    time.classList.remove('none')

    thisQuestions = questions.sort(() => Math.random() - .5)//affichage des questions de façons aléatoires 
    currentQuestionIndex = 0
    score = 0

    showNextQuestion()
    startTimer()
    //endGame()
}

//fonction pour démarer le timer
function startTimer() {
    countdown = setInterval(() => {
        totalTime--;
        time.innerText = `${totalTime}s`;

        if (totalTime <= 0) {
            clearInterval(countdown);
            endGame();
            disabledBouton()
        }
    }, 1000);
}

//affichage des questions et des réponses
function showQuestions(question) {
    //affichage de la question
    questionsShower.innerText = question.question

    //affichage des réponses
    question.answers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('answer')

        if (answer.correct) {
            button.dataset.correct = answer.correct
        }

        button.addEventListener('click', selectAnswer)
        answersShower.appendChild(button)
    });
}

//affichage de la question suivante
function showNextQuestion() {
    resetState()
    showQuestions(thisQuestions[currentQuestionIndex])
}

//retour à l'état initial lorsqu'on passe à une autre question 
function resetState() {
    clearAnswerStatus(document.body)
    next.classList.add('none')

    while (answersShower.firstChild) {
        answersShower.removeChild(answersShower.firstChild)
    }
}

//sélection des réponses
function selectAnswer(event) {
    const selectButton = event.target
    const correct = selectButton.dataset.correct

    // gestion du score
    if (correct) {
        score += 10;
        updateScore(); // Mettre à jour l'affichage du score
    } 
    if (!correct) {
        score -= 5;
        updateScore()
    }

    correctAnswer(document.body, correct)
    Array.from(answersShower.children).forEach(button =>{
        correctAnswer(button, button.dataset.correct)
    })

    if (thisQuestions.length > currentQuestionIndex + 1) {
        next.classList.remove('none')
    } else{
        start.innerText = 'Restart'
        start.classList.remove('none')
        resetTimer()
    }
    
    stopTimer()
}

// fonction pour mettre à jour l'affichage du score
function updateScore() {
    scoreContent.innerText = `${score}`;
}

// fonction pour réinitialiser le timer
function resetTimer() {
    clearInterval(countdown);
    totalTime = 26; //valeur initiale du temps ici
    startTimer();
}

//stopper le timer
function stopTimer() {
    clearInterval(countdown);
}

// fonction pour relancer le jeu lors du clic sur "Restart"
function restartGame() {
    resetTimer()
    resetState();
    startGame();
}

//terminer le jeu
function endGame() {
    clearInterval(countdown);
    time.innerText = "Temps écoulé!";
    scoreContent.innerText = `${score}`;

    if (thisQuestions.length > currentQuestionIndex + 1) {
        next.classList.remove('none')
    } else{
        start.innerText = 'Restart'
        start.classList.remove('none')
    }
}

//désactiver les boutons answers
function disabledBouton() {
    const answersButton = document.querySelectorAll('.answer')
    answersButton.forEach(button => {
        button.disabled = true
    })
}

//changement lorsque la réponse est correcte ou pas
function correctAnswer(element, correct) {
    clearAnswerStatus(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('missed')
    }
}

//retour à l'état initial lorsqu'on passe à une autre question
function clearAnswerStatus(element) {
    element.classList.remove('correct')
    element.classList.remove('missed')
}

/*
function showModal() {
    if (score >= 100) {
        alert('Vous avez réussi')
    } if (score >= 80) {
        alert('Très bien')
    } if (score >= 60) {
        alert('Bien')
    } if (score >= 40) {
        alert('Passable')
    } else {
        alert('mauvais')
    }
}
*/