class FoosballRoutine {
    constructor(fiveBarOptions, threeBarOptions, afterGoalDelayInSeconds, availableVoices) {

        // internal settings
        this.isCurrentlyPlaying = false;
        this.synth = window.speechSynthesis;

        this.utterThis = new SpeechSynthesisUtterance();
        this.utterThis.voice = availableVoices.find(voice => voice.lang.toLowerCase().indexOf("gb") !== -1);
        this.utterThis.pitch = 1;
        this.utterThis.rate = 1;
        this.utterThis.onerror = function () {
            console.error('SpeechSynthesisUtterance.onerror');
        }

        this.timeForSettingUpOnFiveBarInSeconds = 3;
        this.minimumTimeForPassingInSeconds = 2;
        this.maximumTimeForPassingInSeconds = 9; // legal maximum is 10s (9s also considers the spoken text)
        this.minimumTimeForShootingInSeconds = 4;
        this.maximumTimeForShootingInSeconds = 14; // legal maximum is 15s (14s also considers the spoken text)

        // configurable settings
        this.fiveBarOptions = fiveBarOptions;
        this.threeBarOptions = threeBarOptions;
        this.afterGoalDelayInSeconds = afterGoalDelayInSeconds;
        this.isWakeLockActivated = true;
        this.noSleep = new NoSleep();

        console.log("Using speech synthesis voice '" + this.utterThis.voice.name + "'.");
        console.log("Using 5-bar options: ", this.fiveBarOptions);
        console.log("Using 3-bar options: ", this.threeBarOptions);
    }

    // Methods for controlling the routine from the outside.

    /**
     * Start the routine.
     */
    start() {
        console.log("Starting routine.");
        this.isCurrentlyPlaying = true;
        this.enableWakeLock();
        this.setupFiveBarAction(this);
    }

    /**
     * Stop the routine.
     */
    stop() {
        console.log("Ending routine.");
        this.isCurrentlyPlaying = false;
        this.disableWakeLock();
    }

    /**
     * Update the wake lock activation during an already started routine.
     */
    updateWakeLockActivation(activated) {
        this.isWakeLockActivated = activated;
        console.log("Wake lock is " + (this.isWakeLockActivated ? "activated" : "deactivated"));
    }

    /**
     * Update the time to reset the ball after a goal during an already started routine.
     */
    updateAfterGoalDelay(timeInSeconds) {
        this.afterGoalDelayInSeconds = timeInSeconds;
        console.log("Delaying after a goal for " + this.afterGoalDelayInSeconds + " seconds");
    }

    // Internal methods.

    setupFiveBarAction(routine) {
        routine.speakAndSchedule(
            "Setup 5-bar.",
            routine.startFiveBarAction,
            routine.timeForSettingUpOnFiveBarInSeconds
        );
    }

    startFiveBarAction(routine) {
        let timeout = (Math.random() * (routine.maximumTimeForPassingInSeconds - routine.minimumTimeForPassingInSeconds)) + routine.minimumTimeForPassingInSeconds;
        routine.speakAndSchedule(
            "Go.",
            routine.passAction,
            timeout
        );
    }

    passAction(routine) {
        let timeout = (Math.random() * (routine.maximumTimeForShootingInSeconds - routine.minimumTimeForShootingInSeconds)) + routine.minimumTimeForShootingInSeconds;
        routine.speakAndSchedule(
            routine.getRandomFiveBarOption(),
            routine.shootAction,
            timeout
        );
    }

    shootAction(routine) {
        routine.speakAndSchedule(
            routine.getRandomThreeBarOption(),
            routine.setupFiveBarAction,
            routine.afterGoalDelayInSeconds
        );
    }

    speakAndSchedule(text, nextActionToSchedule, timeoutUntilNextActionInSeconds) {
        if (this.isCurrentlyPlaying) {
            this.speak(text)
            this.setCancellableTimeout(nextActionToSchedule, timeoutUntilNextActionInSeconds);
            console.log("Scheduled " + nextActionToSchedule.name + " in " + timeoutUntilNextActionInSeconds + " seconds")
        } else {
            this.endRoutine();
        }
    }

    speak(text) {
        // Change the utterance text and add the new text to the speech synthesis queue.
        this.utterThis.text = text;
        this.synth.speak(this.utterThis);
    }

    setCancellableTimeout(nextActionToSchedule, timeoutUntilNextActionInSeconds) {
        if (this.isCurrentlyPlaying) {
            setTimeout(nextActionToSchedule, timeoutUntilNextActionInSeconds * 1000, this);
        } else {
            this.endRoutine();
        }
    }

    getRandomFiveBarOption() {
        return this.fiveBarOptions[Math.floor(Math.random() * this.fiveBarOptions.length)];
    }

    getRandomThreeBarOption() {
        return this.threeBarOptions[Math.floor(Math.random() * this.threeBarOptions.length)];
    }

    endRoutine() {
        this.synth.cancel();
    }

    enableWakeLock() {
        if (this.isWakeLockActivated) {
            // noinspection JSCheckFunctionSignatures
            this.noSleep.enable();
        }
    }

    disableWakeLock() {
        // noinspection JSCheckFunctionSignatures
        this.noSleep.disable();
    }
}
