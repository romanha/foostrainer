let startButton = document.querySelector('#start-training');
let stopButton = document.querySelector('#stop-training');
let wakeLock = document.querySelector('#wake-lock');
let goalDelay = document.querySelector('#goal-delay');
let goalDelayLabel = document.querySelector('#goal-delay-label');
let routine = null;

function setup() {
    stopButton.disabled = true;
    routine = new FoosballRoutine(
        ["wall pass", "lane pass", "center pass"],
        ["long left", "short left", "straight", "short right", "long right", "cut-back left", "cut-back right"],
        5
    );
}

window.onload = setup;

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