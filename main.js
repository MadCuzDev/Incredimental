var money = 0;
var tokens = 0;
var moneyPerBlock = 1;
var blocksPerSecond = 1;
var tickInterval = 100;
var prestige = 0;
var prestigePoints = 0;
var mastery = 0;
var masteryPoints = 0;
var autoBlocksPerSecond = 0;
var autoBlockValuePerSecond = 0;
var fortune = 0;
var fortuneMulti = 0.02;
var tokenFinder = 0;
var explosive = 0;
var cubic = 0;
var maxPrestige = false;
var maxPrestigeUnlocked = false;
var keepMaxPrestigeButton = false;

var currentTick = 1;

var averageMoneyPerSec = 0;
var averageTokensPerSec = 0;

var displayMoneyPerSec = 0;
var displayTokensPerSec = 0;

var doNotSave = false;

function update() {
    // Update money display
    const moneyDisplay = document.getElementById("money");
    let moneyDisplayText = `$${formatNumber(money)}`;
    moneyDisplayText += `\r\n$/Second ${formatNumber(displayMoneyPerSec)}\r\n`;
    moneyDisplayText += `\r\nTokens ${formatNumber(tokens, 0)}`;
    moneyDisplayText += `\r\nTokens/Second ${formatNumber(displayTokensPerSec, 0)}\r\n`;
    moneyDisplayText += `\r\nBlocks/Second ${formatNumber(blocksPerSecond, 1)}`;
    moneyDisplayText += `\r\n$/Block ${formatNumber(moneyPerBlock * getMoneyMulti())}\r\n`;
    moneyDisplayText += `\r\nPrestige ${formatNumber(prestige, 0)}`;
    moneyDisplayText += `\r\nPrestige Points ${prestigePoints}\r\n`;
    moneyDisplayText += `\r\nMastery ${mastery}`;
    moneyDisplayText += `\r\nMastery Points ${masteryPoints}`;
    moneyDisplay.textContent = moneyDisplayText;

    // Update enchantment display
    const enchantmentDisplay = document.getElementById("enchantmentsDisplay");
    let displayText = `Fortune: ${fortune}`;
    displayText += `\r\nToken Finder: ${tokenFinder}`;
    displayText += `\r\nExplosive: ${explosive}`;
    displayText += `\r\nCubic: ${cubic}`;
    enchantmentDisplay.textContent = displayText;

    // Update prestige display
    const prestigeDisplay = document.getElementById("prestigeDisplay");
    displayText = `auto blocks/sec: ${autoBlocksPerSecond.toFixed(1)}`;
    displayText += `\r\nauto block value/sec: ${autoBlockValuePerSecond.toFixed(1)}`
    displayText += `\r\nmax prestige button: ${maxPrestigeUnlocked ? "Unlocked" : "Locked"}`
    prestigeDisplay.textContent = displayText;

    // Update mastery display
    const masteryDisplay = document.getElementById("masteryDisplay");
    displayText = `double fortune: ${fortuneMulti >= 0.04 ? "Unlocked" : "Locked"}`;
    displayText += `\r\nkeep max prestige button: ${keepMaxPrestigeButton ? "Unlocked" : "Locked"}`;
    masteryDisplay.textContent = displayText;

    // Update fortune button
    const fortuneButton = document.getElementById("fortuneButton");
    displayText = `Fortune`;
    displayText += `\r\n${(fortuneMulti * 100).toFixed(0)}% increased $/block`;
    displayText += `\r\n20 Tokens`;
    fortuneButton.textContent = displayText;

    // Update prestige & mastery button
    const prestigeButton = document.getElementById("prestigeButton");
    if (maxPrestige) {
        prestigeButton.textContent = `Prestige for ${getMaxPrestige()[1] + 1}x money\r\nCost: $${formatNumber(getMaxPrestige()[0])}`;
    } else {
        prestigeButton.textContent = `Prestige for ${prestige + 2}x money\r\nCost: $${formatNumber(getPrestigeCost(prestige))}`;
    }

    const masteryButton = document.getElementById("masteryButton");
    masteryButton.textContent = `Mastery for ${mastery + 2}x tokens\r\nCost: ${(mastery + 1) * 100} Prestige`;

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
        prestigePoints -= 10;
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
        autoBlocksPerSecond += .1;
        prestigePoints--;
    }
}

function handleAutoBlockValue() {
    if (prestigePoints >= 1) {
        autoBlockValuePerSecond += .1;
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
    if (prestige >= 100 * (mastery + 1)) {
        mastery++;
        masteryPoints++;
        masteryReset();
    }
}

function handleFortuneUpgrade() {
    if (tokens >= 20) {
        tokens -= 20;
        fortune++;
    }
}

function doubleFortuneButton() {
    if (masteryPoints >= 1 && fortuneMulti < 0.04) {
        masteryPoints--;
        fortuneMulti = 0.04;
    }
}

function handleTokenFinderUpgrade() {
    if (tokens >= 50) {
        tokens -= 50;
        tokenFinder++;
    }
}

function handleExplosiveUpgrade() {
    if (tokens >= 50000 && explosive < 100) {
        tokens -= 50000;
        explosive++;
    }
}

function handleCubicUpgrade() {
    if (tokens >= 100000 && cubic < 1000) {
        tokens -= 100000;
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
    return (prestige + 1) * (1 + (fortune * fortuneMulti));
}

function getTokenMulti() {
    return (1 + (tokenFinder * 0.01)) * (mastery + 1);
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

function keepMaxPrestigeUpgrade() {
    if (!keepMaxPrestigeButton && masteryPoints >= 1) {
        keepMaxPrestigeButton = true;
        masteryPoints--;
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
    if (!keepMaxPrestigeButton) {
        maxPrestigeUnlocked = false;
        document.getElementById("maxPrestigeButton").style.display = "none";
    }
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

    moneyPerBlock += autoBlockValuePerSecond;
    blocksPerSecond += autoBlocksPerSecond;

    const baseBlocksPerTick = (blocksPerSecond / (1000 / tickInterval));
    let calcBlocksPerTick = baseBlocksPerTick;

    // Calculate enchantment activation chances and their effect
    if ((Math.floor(Math.random() * 100) + 1) <= explosive) calcBlocksPerTick += (baseBlocksPerTick * 5);
    if ((Math.floor(Math.random() * 1000) + 1) <= cubic) calcBlocksPerTick += (baseBlocksPerTick * 25);

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

const items = [
    'money', 'tokens', 'blocksPerSecond', 'moneyPerBlock', 'prestige', 'prestigePoints', 'fortuneMulti', 'autoBlocksPerSecond', 'autoBlockValuePerSecond', 'fortune', 'tokenFinder', 'explosive', 'mastery', 'masteryPoints', 'cubic', 'maxPrestige', 'maxPrestigeUnlocked', 'keepMaxPrestigeButton'
];

function load() {
    items.forEach(item => {
        const value = localStorage.getItem(item);
        if (value !== null) {
            window[item] = isNaN(value) ? JSON.parse(value) : Number(value);
        }
    });

    if (maxPrestigeUnlocked) document.getElementById("maxPrestigeButton").style.display = "inline";

    calculateOfflineGain();
}

function getIntData() {
    return {
        'money': money,
        'tokens': tokens,
        'blocksPerSecond': blocksPerSecond,
        'prestige': prestige,
        'prestigePoints': prestigePoints,
        'fortune': fortune,
        'tokenFinder': tokenFinder,
        'mastery': mastery,
        'masteryPoints': masteryPoints,
        'explosive': explosive,
        'cubic': cubic
    };
}

const intData = ['money', 'tokens', 'blocksPerSecond', 'prestige', 'prestigePoints', 'fortune', 'tokenFinder', 'mastery', 'masteryPoints', 'explosive', 'cubic'];
const floatData = ['moneyPerBlock', 'autoBlocksPerSecond', 'autoBlockValuePerSecond', 'fortuneMulti'];
const genericData = ['maxPrestige', 'maxPrestigeUnlocked', 'keepMaxPrestigeButton'];

function save() {
    if (doNotSave) return;

    [...intData, ...floatData, ...genericData].forEach(key => {
        localStorage.setItem(key, window[key]);
    });

    localStorage.setItem('last_save', Date.now());
}

function calculateOfflineGain() {
    if (localStorage.getItem('last_save')) {
        let last_save = localStorage.getItem('last_save');
        let time_elapsed = Date.now() - last_save;
        let currentMoney = money;
        let currentTokens = tokens;
        for (let i = time_elapsed; i > 0; i -= 100) {
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