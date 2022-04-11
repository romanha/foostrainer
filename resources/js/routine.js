class FoosballRoutine {
    constructor(fiveBarOptions, threeBarOptions, afterGoalDelayInSeconds, availableVoices) {
        this.synth = window.speechSynthesis;

        this.utterThis = new SpeechSynthesisUtterance();
        this.utterThis.pitch = 1;
        this.utterThis.rate = 1;
        this.utterThis.onerror = function () {
            console.error('SpeechSynthesisUtterance.onerror');
        }
        this.utterThis.voice = availableVoices.find(voice => voice.lang.toLowerCase().indexOf("gb") !== -1);

        this.setupTimeout = 3000;
        this.minimumPassDelay = 2000;
        this.minimumShootDelay = 4000;
        this.maxTimeOnFiveBar = 10000;
        this.maxTimeOnThreeBar = 17000;
        this.fiveBarGoals = fiveBarOptions;
        this.threeBarGoals = threeBarOptions;
        this.resetTimeInSeconds = afterGoalDelayInSeconds;
        this.playing = false;

        this.wakeLockActivated = true;
        this.noSleep = new NoSleep();

        console.log("Using speech synthesis voice '" + this.utterThis.voice.name + "'.");
        console.log("Using 5-bar options: ", this.fiveBarGoals);
        console.log("Using 3-bar options: ", this.threeBarGoals);
    }

    speak(myTxt) {
        this.utterThis.text = myTxt;
        this.synth.speak(this.utterThis);
    }

    activateWakeLock(activated) {
        this.wakeLockActivated = activated;
        console.log("Wake lock is " + (this.wakeLockActivated ? "activated" : "deactivated"));
    }

    setResetTimeInSeconds(time) {
        this.resetTimeInSeconds = time;
    }

    getRandomFive() {
        return this.fiveBarGoals[Math.floor(Math.random() * this.fiveBarGoals.length)];
    }

    getRandomThree() {
        return this.threeBarGoals[Math.floor(Math.random() * this.threeBarGoals.length)];
    }

    endRoutine() {
        this.synth.cancel();
    }

    setCancellableTimeout(fun, interval) {
        if (!this.playing) {
            this.endRoutine();
        } else {
            setTimeout(fun, interval, this);
        }
    }

    speakAndSchedule(txt, fun, interval) {
        if (!this.playing) {
            this.endRoutine();
        } else {
            this.speak(txt)
            this.setCancellableTimeout(fun, interval);
        }
    }

    shoot(obj) {
        obj.speakAndSchedule(obj.getRandomThree(), obj.readyFive, obj.resetTimeInSeconds * 1000);
    }

    pass(obj) {
        obj.speakAndSchedule(obj.getRandomFive(), obj.shoot, Math.max(Math.random() * obj.maxTimeOnThreeBar, obj.minimumShootDelay));
    }

    startFiveBar(obj) {
        obj.speakAndSchedule("Go.", obj.pass, Math.max(Math.random() * obj.maxTimeOnFiveBar, obj.minimumPassDelay));
    }

    readyFive(obj) {
        obj.speakAndSchedule("Setup 5-bar.", obj.startFiveBar, obj.setupTimeout);
    }

    start() {
        console.log("Starting routine.");
        this.playing = true;
        this.enableWakeLock();
        this.readyFive(this);
    }

    stop() {
        console.log("Ending routine.");
        this.playing = false;
        this.disableWakeLock();
    }

    enableWakeLock() {
        if (this.wakeLockActivated) {
            // noinspection JSCheckFunctionSignatures
            this.noSleep.enable();
        }
    }

    disableWakeLock() {
        // noinspection JSCheckFunctionSignatures
        this.noSleep.disable();
    }
}
