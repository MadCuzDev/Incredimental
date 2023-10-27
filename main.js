let money = 0;
let tokens = 0;
let moneyPerBlock = 1;
let blocksPerSecond = 1;
let tickInterval = 100;
let prestige = 0;
let prestigePoints = 0;
let mastery = 0;
let masteryPoints = 0;
let autoBlocksPerSecond = 0;
let autoBlockValuePerSecond = 0;
let fortune = 0;
let tokenFinder = 0;
let explosive = 0;
let cubic = 0;
let maxPrestige = false;
let maxPrestigeUnlocked = false;

let currentTick = 1;

let averageMoneyPerSec = 0;
let averageTokensPerSec = 0;

let displayMoneyPerSec = 0;
let displayTokensPerSec = 0;

let doNotSave = false;


function update() {
    // Update money display
    const moneyDisplay = document.getElementById("money");
    let moneyDisplayText = `$${formatNumber(money)}`;
    moneyDisplayText+=`\r\n$/Second ${formatNumber(displayMoneyPerSec)}\r\n`;
    moneyDisplayText+=`\r\nTokens ${formatNumber(tokens, 0)}`;
    moneyDisplayText+=`\r\nTokens/Second ${formatNumber(displayTokensPerSec, 0)}\r\n`;
    moneyDisplayText+=`\r\nBlocks/Second ${formatNumber(blocksPerSecond, 1)}`;
    moneyDisplayText+=`\r\n$/Block ${formatNumber(moneyPerBlock * getMoneyMulti())}\r\n`;
    moneyDisplayText+=`\r\nPrestige ${formatNumber(prestige, 0)}`;
    moneyDisplayText+=`\r\nPrestige Points ${prestigePoints}\r\n`;
    moneyDisplayText+=`\r\nMastery ${mastery}`;
    moneyDisplayText+=`\r\nMastery Points ${masteryPoints}`;

    moneyDisplay.textContent = moneyDisplayText;

    // Update enchantment display
    const enchantmentDisplay = document.getElementById("enchantmentsDisplay");
    let enchantmentsDisplayText = `Fortune: ${fortune}`;
    enchantmentsDisplayText+=`\r\nToken Finder: ${tokenFinder}`;
    enchantmentsDisplayText+=`\r\nExplosive: ${explosive}`;
    enchantmentsDisplayText+=`\r\nCubic: ${cubic}`;


    enchantmentDisplay.textContent = enchantmentsDisplayText;

    // Update prestige display
    const prestigeDisplay = document.getElementById("prestigeDisplay");
    let prestigeDisplayText = `auto blocks/sec: ${autoBlocksPerSecond.toFixed(1)}`;
    prestigeDisplayText+=`\r\n auto block value/sec: ${autoBlockValuePerSecond.toFixed(1)}`
    prestigeDisplayText+=`\r\n max prestige button: ${maxPrestigeUnlocked ? "Unlocked" : "Locked"}`

    prestigeDisplay.textContent = prestigeDisplayText;

    // Update prestige & mastery button
    const prestigeButton = document.getElementById("prestigeButton");
    if (maxPrestige) {
        prestigeButton.textContent = `Prestige for ${getMaxPrestige()[1]+1}x money\r\nCost: $${formatNumber(getMaxPrestige()[0])}`;
    } else {
        prestigeButton.textContent = `Prestige for ${prestige+2}x money\r\nCost: $${formatNumber(getPrestigeCost(prestige))}`;
    }

    const masteryButton = document.getElementById("masteryButton");
    masteryButton.textContent = `Mastery for ${mastery+2}x tokens\r\nCost: ${(mastery+1)*100} Prestige`;

    const maxPrestigeButton = document.getElementById("maxPrestigeButton");
    maxPrestigeButton.textContent = `Max Prestige: ` + maxPrestige;

    requestAnimationFrame(update);
}

// Controls the navigation tabs
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

function maxPrestigeButtonUnlock() {
    if (!maxPrestigeUnlocked && prestigePoints >= 10) {
        prestigePoints-=10;
        maxPrestigeUnlocked = true;
        document.getElementById("maxPrestigeButton").style.display = "inline";
    }
}

function formatNumber(number, decimal = 2) {
    if (number.toFixed(0).toString().length > 9) {
        return number.toExponential(decimal);
    } else {
        return new Intl.NumberFormat().format(number.toFixed(decimal));
    }
}

function handleAutoBlocksPerSecond() {
    if (prestigePoints >= 1) {
        autoBlocksPerSecond+=.1;
        prestigePoints--;
    }
}

function handleAutoBlockValue() {
    if (prestigePoints >= 1) {
        autoBlockValuePerSecond+=.1;
        prestigePoints--;
    }
}

function handlePrestige() {
    if (maxPrestige) {
        let values = getMaxPrestige();

        if (values[1] > prestige && values[0] <= money) {
            prestigePoints += values[1] - prestige;
            prestige = values[1];
            prestigeReset();
        }
    } else {
        if (money >= getPrestigeCost(prestige)) {
            prestige++;
            prestigePoints++;
            prestigeReset();
        }
    }
}

function getMaxPrestige() {
    let prestigeNum = prestige + 1;
    let totalCost = getPrestigeCost(prestige);
    while (totalCost <= money) {
        if (money < totalCost + getPrestigeCost(prestigeNum)) break;
        totalCost += getPrestigeCost(prestigeNum);
        prestigeNum++;
    }
    let values = [];
    values[0] = totalCost;
    values[1] = prestigeNum;


    return values;
}

function getPrestigeCost(prestige) {
    return 100 + Math.pow(prestige, 4);
}

function handleMastery() {
    if (prestige >= 100*(mastery+1)) {
        mastery++;
        masteryPoints++;
        masteryReset();
    }
}

function handleFortuneUpgrade() {
    if (tokens >= 20) {
        tokens-=20;
        fortune++;
    }
}

function handleTokenFinderUpgrade() {
    if (tokens >= 50) {
        tokens-=50;
        tokenFinder++;
    }
}

function handleExplosiveUpgrade() {
    if (tokens >= 50000 && explosive < 100) {
        tokens-=50000;
        explosive++;
    }
}

function handleCubicUpgrade() {
    if (tokens >= 100000 && cubic < 1000) {
        tokens-=100000;
        cubic++;
    }
}

function increaseMoney(amount) {
    money += amount * getMoneyMulti();
}

function increaseTokens(amount) {
    tokens += amount * getTokenMulti();
}

function getMoneyMulti() {
    return (prestige+1) * (1+(fortune*0.05));
}

function getTokenMulti() {
    return (1 + (tokenFinder * 0.01)) * (mastery+1);
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

function resetButton() {
    doNotSave = true;
    localStorage.clear();
    location.reload();
}

function resetAll() {
    masteryReset();
    resetEnchantments();
    mastery = 0;
    masteryPoints = 0;
    localStorage.clear();
}

function masteryReset() {
    prestigeReset();
    prestige = 0;
    prestigePoints = 0;
    autoBlocksPerSecond = 0;
    autoBlockValuePerSecond = 0;
}

function prestigeReset() {
    money = 0;
    moneyPerBlock = 1;
    blocksPerSecond = 1;
    tokens = 0;
}

function resetEnchantments() {
    fortune = 0;
    tokenFinder = 0;
}

function backgroundLoop() {
    setInterval(function () {
        calcPerTick();
    }, tickInterval);
}

function calcPerTick() {
    const currentMoney = money;
    const currentTokens = tokens;

    moneyPerBlock+=autoBlockValuePerSecond;
    blocksPerSecond+=autoBlocksPerSecond;

    const baseBlocksPerTick = (blocksPerSecond / (1000 / tickInterval));
    let calcBlocksPerTick = baseBlocksPerTick;

    // Calculate enchantment activation chances and their effect
    if ((Math.floor(Math.random() * 100) + 1) <= explosive) calcBlocksPerTick+=(baseBlocksPerTick*5);
    if ((Math.floor(Math.random() * 1000) + 1) <= cubic) calcBlocksPerTick+=(baseBlocksPerTick*25);

    increaseMoney(moneyPerBlock * calcBlocksPerTick);
    increaseTokens(calcBlocksPerTick);

    averageMoneyPerSec += money - currentMoney;
    averageTokensPerSec += tokens - currentTokens;

    currentTick++;

    if (currentTick === 10) {
        currentTick = 1;

        displayMoneyPerSec = averageMoneyPerSec;
        displayTokensPerSec = averageTokensPerSec;

        averageMoneyPerSec = 0;
        averageTokensPerSec = 0;
    }
}

function load() {
    if (localStorage.getItem('money')) {
        money = parseInt(localStorage.getItem('money'));
    }

    if (localStorage.getItem('tokens')) {
        tokens = parseInt(localStorage.getItem('tokens'));
    }

    if (localStorage.getItem('blocksPerSecond')) {
        blocksPerSecond = parseInt(localStorage.getItem('blocksPerSecond'));
    }

    if (localStorage.getItem('moneyPerBlock')) {
        moneyPerBlock = parseFloat(localStorage.getItem('moneyPerBlock'));
    }

    if (localStorage.getItem('prestige')) {
        prestige = parseInt(localStorage.getItem('prestige'));
    }

    if (localStorage.getItem('prestigePoints')) {
        prestigePoints = parseInt(localStorage.getItem('prestigePoints'));
    }

    if (localStorage.getItem('autoBlocksPerSecond')) {
        autoBlocksPerSecond = parseFloat(localStorage.getItem('autoBlocksPerSecond'));
    }

    if (localStorage.getItem('autoBlockValuePerSecond')) {
        autoBlockValuePerSecond = parseFloat(localStorage.getItem('autoBlockValuePerSecond'));
    }

    if (localStorage.getItem('fortune')) {
        fortune = parseInt(localStorage.getItem('fortune'));
    }

    if (localStorage.getItem('tokenFinder')) {
        tokenFinder = parseInt(localStorage.getItem('tokenFinder'));
    }

    if (localStorage.getItem('explosive')) {
        explosive = parseInt(localStorage.getItem('explosive'));
    }

    if (localStorage.getItem('mastery')) {
        mastery = parseInt(localStorage.getItem('mastery'));
    }

    if (localStorage.getItem('masteryPoints')) {
        masteryPoints = parseInt(localStorage.getItem('masteryPoints'));
    }

    if (localStorage.getItem('cubic')) {
        cubic = parseInt(localStorage.getItem('cubic'));
    }

    if (localStorage.getItem('maxPrestige')) {
        maxPrestige = JSON.parse(localStorage.getItem('maxPrestige'));
    }

    if (localStorage.getItem('maxPrestigeUnlocked')) {
        maxPrestigeUnlocked = JSON.parse(localStorage.getItem('maxPrestigeUnlocked'));
    }

    if (maxPrestigeUnlocked) document.getElementById("maxPrestigeButton").style.display = "inline";

    calculateOfflineGain();
}

function save() {
    if (doNotSave) return;

    localStorage.setItem('money', money);
    localStorage.setItem('tokens', tokens);
    localStorage.setItem('blocksPerSecond', blocksPerSecond);
    localStorage.setItem('moneyPerBlock', moneyPerBlock);
    localStorage.setItem('prestige', prestige);
    localStorage.setItem('prestigePoints', prestigePoints);
    localStorage.setItem('autoBlocksPerSecond', autoBlocksPerSecond);
    localStorage.setItem('autoBlockValuePerSecond', autoBlockValuePerSecond);
    localStorage.setItem('fortune', fortune);
    localStorage.setItem('tokenFinder', tokenFinder);
    localStorage.setItem('mastery', mastery);
    localStorage.setItem('masteryPoints', masteryPoints);
    localStorage.setItem('explosive', explosive);
    localStorage.setItem('cubic', cubic);
    localStorage.setItem('maxPrestige', maxPrestige);
    localStorage.setItem('maxPrestigeUnlocked', maxPrestigeUnlocked);

    localStorage.setItem('last_save', Date.now());
}

function calculateOfflineGain() {
    if (localStorage.getItem('last_save')) {
        let last_save = localStorage.getItem('last_save');
        let time_elapsed = Date.now() - last_save;
        let currentMoney = money;
        let currentTokens = tokens;
        for (let i = time_elapsed; i > 0; i-=100) {
            calcPerTick();
        }

        let gain = money - currentMoney;
        let tokenGain = tokens - currentTokens;
        alert("You have made $" + gain.toFixed(2) + " and " + tokenGain.toFixed(2) + " tokens offline");


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