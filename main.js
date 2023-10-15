let money = 0;
let moneyPerBlock = 1;
let blocksPerSecond = 1;
let tickInterval = 100;
let prestige = 0;
let prestigePoints = 0;

function update() {
    const moneyDisplay = document.getElementById("money");
    moneyDisplay.textContent = `$${money.toFixed(2)}\r\nBlocks/Second ${blocksPerSecond}\r\n$/Block ${moneyPerBlock * getMoneyMulti()}\r\n$/Second ${blocksPerSecond * (moneyPerBlock * getMoneyMulti())}\r\nPrestige ${prestige}\r\nPrestige Points ${prestigePoints}`;

    const prestigeButton = document.getElementById("prestigeButton");
    prestigeButton.textContent = `Prestige for ${prestige+2} times money\r\nCost: ${(prestige+1)*100}`;

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

function handleAutoBlocksPerSecond() {
}

function handleAutoBlockValue() {

}

function handlePrestige() {
    if (money >= (prestige+1)*100) {
        prestige++;
        resetBasic();
    }
}

function increaseMoney(amount) {
    money += amount * getMoneyMulti();
}

function getMoneyMulti() {
    return prestige+1;
}

function handleClick() {
    increaseMoney(moneyPerBlock);
}

function handleClickUpgrade() {
    if (money >= 10) {
        money -= 10;
        moneyPerBlock += 1;
    }
}

function handleAutoUpgrade() {
    if (money >= 10) {
        money -= 10;
        blocksPerSecond += 1;
    }
}

function resetAll() {
    resetBasic();
    prestige = 0;
}

function resetBasic() {
    money = 0;
    moneyPerBlock = 1;
    blocksPerSecond = 1;
}

function backgroundLoop() {
    setInterval(function () {
        increaseMoney(moneyPerBlock * (blocksPerSecond / (1000 / tickInterval)));
    }, tickInterval);
}

function load() {
    if (localStorage.getItem('money')) {
        money = parseInt(localStorage.getItem('money'));
    }

    if (localStorage.getItem('moneyPerSecond')) {
        blocksPerSecond = parseInt(localStorage.getItem('moneyPerSecond'));
    }

    if (localStorage.getItem('moneyPerClick')) {
        moneyPerBlock = parseInt(localStorage.getItem('moneyPerClick'));
    }

    if (localStorage.getItem('prestige')) {
        prestige = parseInt(localStorage.getItem('prestige'));
    }

    calculateOfflineGain();
}

function save() {
    localStorage.setItem('money', money);
    localStorage.setItem('blocksPerSecond', blocksPerSecond);
    localStorage.setItem('moneyPerBlock', moneyPerBlock);
    localStorage.setItem('prestige', prestige.toString());

    localStorage.setItem('last_save', Date.now().toString());
}

function calculateOfflineGain() {
    if (localStorage.getItem('last_save')) {
        let last_save = localStorage.getItem('last_save');
        let time_elapsed = Date.now() - last_save;
        let blocksPerMS = (blocksPerSecond / 1000) * time_elapsed;
        let gains = blocksPerMS * moneyPerBlock;
        increaseMoney(gains);
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
