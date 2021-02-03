// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh splash page best scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, i) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[i].bestScore}s`;
  });
}


// Check local storage for best scores and set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay }
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}


// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, i) => {
    // Select correct Best Score to update
    if (questionAmount == score.questions) {
      // Return best score as a number with one decimal
      const savedBestScore = Number(bestScoreArray[i].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || finalTime < savedBestScore) {
        bestScoreArray[i].bestScore = finalTimeDisplay;
      }
    }
  });
  // update splash page
  bestScoresToDOM();
  // Save to local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}



// Reset game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  questionAmount = 0;
  valueY = 0;
  playAgainBtn.hidden = true;
}


// Hide game page and show score page
function showScorePage() {
  gamePage.hidden = true;
  scorePage.hidden = false;
  // Show play again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
}


// Format and display time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent =  `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to top (for next game), go to score page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}


// Stop timer, process reults, go to score page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log('player guess array:', playerGuessArray);
    console.log('arraylength:', typeof playerGuessArray.length);
    console.log('question amount:', typeof questionAmount);
    clearInterval(timer);
    // Check for wrong guesses and add penalty time
    equationsArray.forEach((equation, i) => {
      if (equation.evaluated === playerGuessArray[i]) {
        // Correct guess, no penalty
      } else {
        // Incorrect guess, add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('time', timePlayed, 'penalty', penaltyTime, 'finalTime', finalTime);
    scoresToDOM();
  }
}


// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}



// Start timer when game page is clicked
function startTimer() {
  // reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}


// Scroll and store user selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}


// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}



// Get random number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


// Add equations to DOM
function equationstoDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}



// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log("Wrong equations:", wrongEquations);
  // Loop through, multiply random numbers, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(15);
    secondNumber = getRandomInt(15);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, alter equations to make them incorrect, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(15)
    secondNumber = getRandomInt(15)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationstoDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}




// Displays countdown (3, 2, 1, GO)
function countdownStart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountDown = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = 'GO!';
    } else if (count === -1) {
      showGamePage();
      clearInterval(timeCountDown);
    } else {
      countdown.textContent = count;
    }
  }, 1000);

  // countdown.textContent = '3';
  // setTimeout(() => {
  //   countdown.textContent = '2';
  // }, 1000);
  // setTimeout(() => {
  //   countdown.textContent = '1';
  // }, 2000);
  // setTimeout(() => {
  //   countdown.textContent = 'GO!';
  // }, 3000);
  
}


// Navigate from Splashpage to Countdown Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
}





// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}





// Form that decides amount of questions
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('Question amount: ', questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}



startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('selected-label');
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// On load
getSavedBestScores();