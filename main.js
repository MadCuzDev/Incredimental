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

function update() {
    // Update money display
    const moneyDisplay = document.getElementById("money");
    let moneyDisplayText = `$${money.toFixed(2)}`;
    moneyDisplayText+=`\r\nTokens ${tokens.toFixed(0)}`;
    moneyDisplayText+=`\r\nTokens/Second ${(blocksPerSecond * getTokenMulti()).toFixed(1)}`;
    moneyDisplayText+=`\r\nBlocks/Second ${blocksPerSecond.toFixed(1)}`;
    moneyDisplayText+=`\r\n$/Block ${(moneyPerBlock * getMoneyMulti()).toFixed(1)}`;
    moneyDisplayText+=`\r\n$/Second ${(blocksPerSecond * (moneyPerBlock * getMoneyMulti())).toFixed(0)}`;
    moneyDisplayText+=`\r\nPrestige ${prestige}`;
    moneyDisplayText+=`\r\nPrestige Points ${prestigePoints}`;
    moneyDisplayText+=`\r\nMastery ${mastery}`;
    moneyDisplayText+=`\r\nMastery Points ${masteryPoints}`;

    moneyDisplay.textContent = moneyDisplayText;

    // Update enchantment display
    const enchantmentDisplay = document.getElementById("enchantmentsDisplay");
    let enchantmentsDisplayText = `Fortune: ${fortune}`;
    enchantmentsDisplayText+=`\r\nToken Finder: ${tokenFinder}`;

    enchantmentDisplay.textContent = enchantmentsDisplayText;

    // Update prestige display
    const prestigeDisplay = document.getElementById("prestigeDisplay");
    let prestigeDisplayText = `auto blocks/sec: ${autoBlocksPerSecond.toFixed(1)}`;
    prestigeDisplayText+=`\r\n auto block value/sec: ${autoBlockValuePerSecond.toFixed(1)}`

    prestigeDisplay.textContent = prestigeDisplayText;

    // Update prestige & mastery button
    const prestigeButton = document.getElementById("prestigeButton");
    prestigeButton.textContent = `Prestige for ${prestige+2}x money\r\nCost: ${getPrestigeCost(prestige)}`;

    const masteryButton = document.getElementById("masteryButton");
    masteryButton.textContent = `Mastery for ${mastery+2}x tokens\r\nCost: ${(mastery+1)*100} Prestige`;

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
    if (money >= getPrestigeCost(prestige)) {
        prestige++;
        prestigePoints++;
        prestigeReset();
    }
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
    moneyPerBlock+=autoBlockValuePerSecond;
    blocksPerSecond+=autoBlocksPerSecond;
    increaseMoney(moneyPerBlock * (blocksPerSecond / (1000 / tickInterval)));
    increaseTokens(blocksPerSecond / (1000 / tickInterval))
}

function load() {
    if (localStorage.getItem('money')) {
        money = parseInt(localStorage.getItem('money'));
    }

    if (localStorage.getItem('tokens')) {
        tokens = parseInt(localStorage.getItem('tokens'));
    }

    if (localStorage.getItem('moneyPerSecond')) {
        blocksPerSecond = parseInt(localStorage.getItem('moneyPerSecond'));
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

    if (localStorage.getItem('mastery')) {
        mastery = parseInt(localStorage.getItem('mastery'));
    }

    if (localStorage.getItem('masteryPoints')) {
        masteryPoints = parseInt(localStorage.getItem('masteryPoints'));
    }

    calculateOfflineGain();
}

function save() {
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
