// Routine reference
let routine = null;

// Control elements
let startButton = document.getElementById("start-training-button");
let stopButton = document.getElementById("stop-training-button");
let loadingSpinner = document.getElementById("loading-spinner");

// Settings
let settingsButton = document.getElementById("settings-button")
let routineButton = document.getElementById("routine-button")
let wakeLock = document.getElementById("wake-lock");
let goalDelay = document.getElementById("goal-delay");
let goalDelayLabel = document.getElementById("goal-delay-label");

// Checkbox IDs mapped to text
const fiveBarOptionsToTextMap = new Map([
    ["routine-pass-wall", "Wall pass."],
    ["routine-pass-lane", "Lane pass."],
    ["routine-pass-center", "Center pass."]
]);
const threeBarOptionsToTextMap = new Map([
    ["routine-shot-straight", "Straight."],
    ["routine-shot-long-left", "Long left."],
    ["routine-shot-long-right", "Long right."],
    ["routine-shot-short-left", "Short left."],
    ["routine-shot-short-right", "Short right."],
    ["routine-shot-cut-back-left", "Cut-back left."],
    ["routine-shot-cut-back-right", "Cut-back right."]
]);

function isAppInitialized() {
    return routine !== null;
}

// Checks if the browser supports the voices changed event.
// See: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event
function isBrowserSupportingVoicesChangedEvent() {
    let isSupported = true;
    let userAgent = navigator.userAgent;
    if ((userAgent.indexOf("Opera") || userAgent.indexOf("OPR") || userAgent.indexOf("Safari")) === -1) {
        console.log("The 'voices changed event' is not supported for '" + userAgent + "'.");
        isSupported = false;
    }

    return isSupported;
}

function setup() {
    // in case initializeRoutine() is already executed before setup()
    if (!isAppInitialized()) {
        startButton.disabled = true;
        startButton.classList.add("disabled");
    }

    stopButton.disabled = true;
    stopButton.classList.add("disabled");

    if (!isBrowserSupportingVoicesChangedEvent()) {
        // If the event is not supported, just wait 1 second. This should be more than enough to load all the voices.
        setTimeout(initializeRoutine, 1000);
    }
}

function getFiveBarOptions() {
    let fiveBarOptions = [];
    fiveBarOptionsToTextMap.forEach((text, checkboxId) => {
        if (document.getElementById(checkboxId).checked) {
            fiveBarOptions.push(text);
        }
    });

    if (fiveBarOptions.length === 0) {
        fiveBarOptionsToTextMap.forEach(text => fiveBarOptions.push(text));
    }

    return fiveBarOptions;
}

function getThreeBarOptions() {
    let threeBarOptions = [];
    threeBarOptionsToTextMap.forEach((text, checkboxId) => {
        if (document.getElementById(checkboxId).checked) {
            threeBarOptions.push(text);
        }
    });

    if (threeBarOptions.length === 0) {
        threeBarOptionsToTextMap.forEach(text => threeBarOptions.push(text));
    }

    return threeBarOptions;
}

function initializeRoutine() {
    if (!isAppInitialized()) {
        console.log("Initializing routine.")
        let availableVoices = window.speechSynthesis.getVoices();
        routine = new FoosballRoutine(
            getFiveBarOptions(),
            getThreeBarOptions(),
            goalDelay.value,
            availableVoices
        );
        loadingSpinner.classList.add("hidden");
        startButton.disabled = false;
        startButton.classList.remove("disabled");
    }
}

function reinitializeRoutine() {
    stopRoutine();
    routine = null;
    initializeRoutine();
}

function startRoutine() {
    startButton.disabled = true;
    startButton.classList.add("disabled");
    stopButton.disabled = false;
    stopButton.classList.remove("disabled");
    routine.start();
}

function stopRoutine() {
    startButton.disabled = false;
    startButton.classList.remove("disabled");
    stopButton.disabled = true;
    stopButton.classList.add("disabled");
    routine.stop();
}

function expandSettings() {
    let settingsMenu = document.getElementById("settings");
    if (settingsMenu.style.display === "block") {
        settingsButton.innerHTML = "&blacktriangleright; Settings";
        settingsMenu.style.display = "none";
    } else {
        settingsButton.innerHTML = "&blacktriangledown; Settings";
        settingsMenu.style.display = "block";
    }
}

function expandRoutineOptions() {
    let routineMenu = document.getElementById("routine");
    if (routineMenu.style.display === "block") {
        routineButton.innerHTML = "&blacktriangleright; Routine";
        routineMenu.style.display = "none";
    } else {
        routineButton.innerHTML = "&blacktriangledown; Routine";
        routineMenu.style.display = "block";
    }
}

window.onload = setup;
window.speechSynthesis.onvoiceschanged = initializeRoutine;
startButton.onclick = startRoutine;
stopButton.onclick = stopRoutine;
settingsButton.onclick = expandSettings;
routineButton.onclick = expandRoutineOptions;

// React on click of any routine option checkbox.
document.querySelectorAll(".multiline-checkboxes > .routine-element > input")
    .forEach(checkbox => checkbox.onclick = reinitializeRoutine);

goalDelay.onchange = function () {
    goalDelayLabel.textContent = "Goal reset delay: " + goalDelay.value + " seconds";
    routine.updateAfterGoalDelay(goalDelay.value);
}

wakeLock.onchange = function () {
    routine.updateWakeLockActivation(wakeLock.checked);
}