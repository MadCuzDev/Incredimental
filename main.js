let score = 0;
let scorePerClick = 1;
let scorePerSecond = 0;
let tickInterval = 100;

const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const upgradeClickButton = document.getElementById('upgradeClickButton');
const resetButton = document.getElementById('resetButton');
const upgradeAutoButton = document.getElementById('upgradeAutoButton');


function update() {
    scoreDisplay.textContent = `$${score.toFixed(2)}\n$/Second ${scorePerSecond}`;

    requestAnimationFrame(update);
}

function handleClick() {
    score += scorePerClick;
}

function handleClickUpgrade() {
    if (score>=10){
        score-=10;
        scorePerClick+=1;
    }
}

function handleAutoUpgrade() {
    if (score>=10){
        score-=10;
        scorePerSecond+=1;
    }
}

function reset() {
    score = 0;
    scorePerClick = 1;
    scorePerSecond = 0;
}

function backgroundLoop() {
    setInterval(function () {
        score+=scorePerSecond/(1000/tickInterval);
    }, tickInterval)
}

function load() {
    if (localStorage.getItem('money')) {
        score = parseInt(localStorage.getItem('money'));
    }

    if (localStorage.getItem('moneyPerSecond')) {
        scorePerSecond = parseInt(localStorage.getItem('moneyPerSecond'));
    }

    if (localStorage.getItem('moneyPerClick')) {
        scorePerClick = parseInt(localStorage.getItem('moneyPerClick'));
    }

    calculateOfflineGain();
}

function save() {
    localStorage.setItem('money', score);
    localStorage.setItem('moneyPerSecond', scorePerSecond);
    localStorage.setItem('moneyPerClick', scorePerClick);


    localStorage.setItem('last_save', Date.now());
}

function calculateOfflineGain() {
    if (localStorage.getItem('last_save')) {
        let last_save = localStorage.getItem('last_save');
        let time_elapsed = Date.now() - last_save;
        let gains = (scorePerSecond/1000) * time_elapsed;
        score+=gains;
        alert("You have made $" + gains + " offline")
    }
}

// Button Listeners
clickButton.addEventListener('click', handleClick);
upgradeClickButton.addEventListener('click', handleClickUpgrade);
resetButton.addEventListener('click', reset);
upgradeAutoButton.addEventListener('click', handleAutoUpgrade);


// Game Loop initialization
update();

// Save/Load system for score
window.onbeforeunload = function(event){
    save();
}

window.onload = function (){
    load();

    backgroundLoop();
}
