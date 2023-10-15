let money = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let tickInterval = 100;

function update() {
    const moneyDisplay = document.getElementById("money");
    moneyDisplay.textContent = `$${money.toFixed(2)}\n$/Second ${moneyPerSecond}`;

    requestAnimationFrame(update);
}

function changeTab(event, tabName) {
    let i, tabs, buttons;
    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    buttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function handleClick() {
    money += moneyPerClick;
}

function handleClickUpgrade() {
    if (money >= 10) {
        money -= 10;
        moneyPerClick += 1;
    }
}

function handleAutoUpgrade() {
    if (money >= 10) {
        money -= 10;
        moneyPerSecond += 1;
    }
}

function reset() {
    money = 0;
    moneyPerClick = 1;
    moneyPerSecond = 0;
}

function backgroundLoop() {
    setInterval(function () {
        money += moneyPerSecond / (1000 / tickInterval);
    }, tickInterval);
}

function load() {
    if (localStorage.getItem('money')) {
        money = parseInt(localStorage.getItem('money'));
    }

    if (localStorage.getItem('moneyPerSecond')) {
        moneyPerSecond = parseInt(localStorage.getItem('moneyPerSecond'));
    }

    if (localStorage.getItem('moneyPerClick')) {
        moneyPerClick = parseInt(localStorage.getItem('moneyPerClick'));
    }

    calculateOfflineGain();
}

function save() {
    localStorage.setItem('money', money);
    localStorage.setItem('moneyPerSecond', moneyPerSecond);
    localStorage.setItem('moneyPerClick', moneyPerClick);

    localStorage.setItem('last_save', Date.now());
}

function calculateOfflineGain() {
    if (localStorage.getItem('last_save')) {
        let last_save = localStorage.getItem('last_save');
        let time_elapsed = Date.now() - last_save;
        let gains = (moneyPerSecond / 1000) * time_elapsed;
        money += gains;
        alert("You have made $" + gains + " offline");
    }
}

// Save/Load system for money
window.onbeforeunload = function (event) {
    save();
}

document.addEventListener("DOMContentLoaded", function () {
    load();
    backgroundLoop();
    update();
    document.getElementById("defaultTab").click();
});
