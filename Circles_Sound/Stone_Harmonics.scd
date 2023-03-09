(
var stoneHarmonics = [];
var numStones;
var addr = NetAddr.new("127.0.0.1", 57120);
var wtSignal;

// just a default wavetable so things don't get fussy
wtSignal = Signal.sineFill(128, [1], [0]).asWavetable;

SynthDef.new(\waveTable, {
	arg freq, mul, t_trig;
	var sig, env;
	env = EnvGen.kr(Env.perc(0.01, 1.0, 1.0), t_trig, doneAction:0);
	sig = SinOsc.ar(freq /**SinOsc.ar(40,0, 1, 0)*/, 0, mul, 0) * env;

	Out.ar(0, sig);
}).add;

SynthDef.new(\laserModeSine, {
	arg freq, mul, frac;
	var sig;
	sig = SinOsc.ar(freq, 0, mul * frac, 0);

	Out.ar(0, sig);
}).add;

SynthDef.new(\stoneHarmonic, {
	arg freq, mul, t_trig;
	var sig, env;
	env = EnvGen.kr(Env.perc(0.01, 1.0, 1.0), t_trig, doneAction:0);
	sig = SinOsc.ar(freq /**SinOsc.ar(40,0, 1, 0)*/, 0, mul, 0) * env;

	Out.ar(0, sig);
}).add;

SynthDef.new(\bellHarmonic, {
	arg index, mul, t_trig;
	var sig, env;
	b = Buffer.read(s,"C:\\Users\\walak\\Desktop\\SKOOL-Senior_Year\\Senior Project-Spring\\bell.wav");

	sig = mul * PlayBuf.ar(2, b, index, trigger: t_trig);

	Out.ar(0, sig);
}).add;

SynthDef.new(\xylophone_low, {
	arg index, mul, t_trig, detune = 1;
	var sig, env;
	b = Buffer.read(s,"C:\\Users\\walak\\Desktop\\SKOOL-Senior_Year\\Senior Project-Spring\\xylophone_low.wav");

	sig = mul * PlayBuf.ar(2, b,  (index / 4) * detune, trigger: t_trig);

	Out.ar(0, sig);
}).add;

SynthDef.new(\toy_piano, {
	arg index, mul, t_trig;
	var sig, env;
	b = Buffer.read(s,"C:\\Users\\walak\\Desktop\\SKOOL-Senior_Year\\Senior Project-Spring\\toy_piano.wav");

	sig = mul * PlayBuf.ar(2, b, 4 * (index / (10 - index)), trigger: t_trig);

	Out.ar(0, sig);
}).add;

/*
SynthDef.new(\stoneHarmonic, {
	arg freq, mul, t_trig;
	var sig, env, noiseX, noiseY, modulator;
	env = EnvGen.kr(Env.perc(0.01, 1.0, 1.0), t_trig, doneAction:0);
	noiseX = MouseX.kr(0.001, 1);
	noiseY = MouseY.kr(0.001, 1);
	modulator = SinOsc.ar(noiseX * 1000, 0, noiseY * 1000, 0);

	sig = SinOsc.ar(freq + modulator, 0, mul, 0) * env;

	Out.ar(0, sig);
}).add;*/



// msg[1] = number of synths to init
OSCdef(\initSynths, {|msg|
	"initSynths".postln;
	stoneHarmonics = Array.new();
	msg[1].do({ |i|
		stoneHarmonics = stoneHarmonics.add(Synth.new(\stoneHarmonic, [\freq, 55 * (i + 1), \mul, (1.0/msg[1]), \t_trig, 1]));/*[\freq, 55 * (i + 1), \mul, (1.0/msg[1]) / /*(i + 1)*/]));*/
		// stoneHarmonics = stoneHarmonics.add(Synth.new(\xylophone_low, [\index, i + 1, \mul, (1.0/msg[1]), \t_trig, 1]));
		// stoneHarmonics = stoneHarmonics.add(Synth.new(\bellHarmonic, [\index, i + 1, \mul, (1.0/msg[1]), \t_trig, 1]));
		// stoneHarmonics = stoneHarmonics.add(Synth.new(\toy_piano, [\index, i + 1, \mul, (1.0/msg[1]), \t_trig, 1]));
		// stoneHarmonics = stoneHarmonics.add(Synth.new(\laserModeSine, [\freq, 55 * (i + 1), \mul, (1.0/msg[1]), \frac, 1]));
	});
	numStones = msg[1];
}, '/initSynths');

// no params
OSCdef(\freeAllSynths, {|msg|
	"freeAllSynths".postln;
	stoneHarmonics.size.do({ |i|
		stoneHarmonics[i].free;
		i.postln;
	});
}, '/freeAllSynths');

// no params
OSCdef(\playAll, {|msg|
	"playAll".postln;
	stoneHarmonics.size.do({ |i|
		stoneHarmonics[i].set(\t_trig, 1);
		i.postln;
	});
}, '/playAll');


// msg[1] = target stone (target harmonic)
OSCdef(\playStoneNote, {|msg|
	"playStoneNote".postln;
	stoneHarmonics[msg[1]].set(\t_trig, 1);
}, '/playStoneNote');

// UNITY CONTROL PANEL STUFF

OSCdef(\impulseChange, {|msg|
	"/impulseChange".postln;
	msg[1].postln;
	addr.sendMsg("/playStoneNote", msg[1]);
}, '/impulseChange');

OSCdef(\sliderChange, {|msg|
	"\sliderChange".postln;
	msg[1].size.postln;
	stoneHarmonics[msg[1]].set(\detune, msg[2]);
}, '/sliderChange');

OSCdef(\padChange, {|msg|
	"\padChange".postln;
	msg[1].postln;
	msg[2].postln;
	msg[3].postln;
}, '/padChange');

OSCdef(\updateLaserData, {|msg|
	"update laser data".postln;
	msg[1].do({
		|i|
		stoneHarmonics[i].set(\frac, msg[2 + i]);
	});
}, '/updateLaserData');

OSCdef(\updateBufferData, {|msg|
	var wt, sig;
	"\updateBufferData".postln;
	sig = Signal.fill(msg[1], {|i| msg[2 + i]});
	{wtSignal = sig.asWavetable}.defer;

}, '/updateBufferData');

addr.sendMsg("/initSynths", 20);
)


(
var a = FloatArray.fill(128, 200);
var s = Signal.fill(128, {|i| a[i]});
var wt = s.asWavetable;
wt.plot;
)








s.local.serverop








// TEST
(
{
	var sig, modulator, noiseX, noiseY;
	noiseX = MouseX.kr(0.001, 1);
	noiseY = MouseY.kr(0.001, 1);

	modulator = SinOsc.ar(noiseX * 1000, 0, noiseY * 1000, 0);
	sig = SinOsc.ar(880 + modulator, 0, 1, 0);
	sig;
}.play;
)



// FREE ALL
(
b = NetAddr.new("127.0.0.1", 57120);
b.sendMsg("/freeAllSynths");
)

// PLAY NOTE
(
b = NetAddr.new("127.0.0.1", 57120);
b.sendMsg("/playStoneNote", 0);
b.sendMsg("/playStoneNote", 1);
b.sendMsg("/playStoneNote", 2);
b.sendMsg("/playStoneNote", 3);
b.sendMsg("/playStoneNote", 4);
b.sendMsg("/playStoneNote", 5);
b.sendMsg("/playStoneNote", 6);
b.sendMsg("/playStoneNote", 7);
b.sendMsg("/playStoneNote", 8);
b.sendMsg("/playStoneNote", 9);
)


(

{
	b = Buffer.read(s,"C:\\Users\\walak\\Desktop\\SKOOL-Senior_Year\\Senior Project-Spring\\bell.wav");
	c = 0.25 * PlayBuf.ar(2, b, loop: 1);
	d = 0.25 * PlayBuf.ar(2, b, 2.0, loop: 1);
	e = 0.25 * PlayBuf.ar(2, b, 3.0, loop: 1);
	f = 0.25 * PlayBuf.ar(2, b, 4.0, loop: 1);
	//BPF.ar(c, MouseX.kr(100, 10000, 1), MouseY.kr(0.0001, 1));
	c + d + e + f;
}.play;

//{ BPF.ar(WhiteNoise.ar(1, 0), MouseX.kr(100, 10000, 1), MouseY.kr(0.0001, 1)) }.play;
)



// PLAY ALL

(
b = NetAddr.new("127.0.0.1", 57120);
b.sendMsg("/playAll", 5);
)
