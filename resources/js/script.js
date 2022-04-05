// Routine reference
let routine = null;

// Control elements
let startButton = document.getElementById("start-training-button");
let stopButton = document.getElementById("stop-training-button");

// Settings
let settingsButton = document.getElementById("settings-button")
let routineButton = document.getElementById("routine-button")
let wakeLock = document.querySelector('#wake-lock');
let goalDelay = document.querySelector('#goal-delay');
let goalDelayLabel = document.querySelector('#goal-delay-label');

function setup() {
    stopButton.disabled = true;
    routine = new FoosballRoutine(
        ["wall pass", "lane pass", "center pass"],
        ["long left", "short left", "straight", "short right", "long right", "cut-back left", "cut-back right"],
        5
    );
}

window.onload = setup;

settingsButton.onclick = function () {
    let settingsMenu = document.getElementById("settings");
    if (settingsMenu.style.display === "block") {
        settingsButton.innerHTML = "&blacktriangleright; Settings";
        settingsMenu.style.display = "none";
    } else {
        settingsButton.innerHTML = "&blacktriangledown; Settings";
        settingsMenu.style.display = "block";
    }
}

routineButton.onclick = function () {
    let routineMenu = document.getElementById("routine");
    if (routineMenu.style.display === "block") {
        routineButton.innerHTML = "&blacktriangleright; Routine";
        routineMenu.style.display = "none";
    } else {
        routineButton.innerHTML = "&blacktriangledown; Routine";
        routineMenu.style.display = "block";
    }
}

goalDelay.onchange = function () {
    goalDelayLabel.textContent = "Goal reset delay: " + goalDelay.value + " seconds";
    routine.setResetTimeInSeconds(goalDelay.value);
}

wakeLock.onchange = function () {
    routine.activateWakeLock(wakeLock.checked);
}

startButton.onclick = function (event) {
    event.preventDefault();
    startButton.disabled = true;
    stopButton.disabled = false;
    routine.start();
}

stopButton.onclick = function (event) {
    event.preventDefault();
    startButton.disabled = false;
    stopButton.disabled = true;
    routine.stop();
}