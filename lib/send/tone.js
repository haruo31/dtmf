function initTones(){
	// polyfill
	var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

	function Tone(context, freq1, freq2) {
		this.context = context;
		this.status = 0;
		this.freq1 = freq1;
		this.freq2 = freq2;
	}

	Tone.prototype.setup = function(){
		this.osc1 = context.createOscillator();
		this.osc2 = context.createOscillator();
		this.osc1.frequency.value = this.freq1;
		this.osc2.frequency.value = this.freq2;

		this.gainNode = this.context.createGain();
		this.gainNode.gain.value = 0.25;

		this.filter = this.context.createBiquadFilter();
		this.filter.type = "lowpass";
		this.filter.frequency = 8000;

		this.osc1.connect(this.gainNode);
		this.osc2.connect(this.gainNode);

		this.gainNode.connect(this.filter);
		this.filter.connect(context.destination);
	}

	Tone.prototype.start = function(){
		this.setup();
		this.osc1.start(0);
		this.osc2.start(0);
		this.status = 1;
	}

	Tone.prototype.stop = function(){
		this.osc1.stop(0);
		this.osc2.stop(0);
		this.status = 0;
	}

	var dtmfFrequencies = {
		"1": {f1: 697, f2: 1209},
		"2": {f1: 697, f2: 1336},
		"3": {f1: 697, f2: 1477},

		"4": {f1: 770, f2: 1209},
		"5": {f1: 770, f2: 1336},
		"6": {f1: 770, f2: 1477},

		"7": {f1: 852, f2: 1209},
		"8": {f1: 852, f2: 1336},
		"9": {f1: 852, f2: 1477},

		"A": {f1: 697, f2: 1633},
		"B": {f1: 770, f2: 1633},
		"C": {f1: 852, f2: 1633},

		"D": {f1: 941, f2: 1633},
		"0": {f1: 941, f2: 1336},
		"*": {f1: 941, f2: 1209},
		"#": {f1: 941, f2: 1477}
	}

	var context = new AudioContext();

	// Create a new Tone instace. (We've initialised it with 
	// frequencies of 350 and 440 but it doesn't really matter
	// what we choose because we will be changing them in the 
	// function below)
	var dtmf = new Tone(context, 350, 440);

	function startSound(key){
		var frequencyPair = dtmfFrequencies[key]; // this looks up which frequency pair we need

		dtmf.freq1 = frequencyPair.f1;
		dtmf.freq2 = frequencyPair.f2;

		if (dtmf.status == 0){
			dtmf.start();
		}
	}

	function stopSound(){
		if (typeof dtmf !== "undefined" && dtmf.status){
		  	dtmf.stop();
		}
	}

	//Public

	this.stopSound = function(){
		stopSound();
	}

	this.startSound = function(key){
		startSound(key);
	}


	return this;

};

