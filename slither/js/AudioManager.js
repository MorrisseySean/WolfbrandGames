var AUDIO;
function AudioManager()
{
	AUDIO = this;
	this.audioBuffer;
	this.loaded = false;
	this.source = 0;
	this.isPlaying = false;
	
}

AudioManager.prototype.Load = function(obj)
{
	//Loads the file set in the object
	var request = new XMLHttpRequest();
	request.open('GET', obj.src, true);
	request.responseType = 'arraybuffer'
	request.onload = function()
	{
		audioCtx.decodeAudioData(request.response, function(buffer){obj.buffer = buffer;AUDIO.loaded = true;console.log("Loaded")}, onError);
	}
	request.send();
}

AudioManager.prototype.Update = function(playerPos, playerDir, enemyPos)
{
	//Use the player position to create ambient sound based on position
	if(enemyPos.x > 0 && enemyPos.y > 0)
	{
		audioCtx.listener.setPosition((playerPos.x - enemyPos.x)/500, 0,(-(playerPos.y - enemyPos.y)/500));
	}
}

function playSound(obj)
{
	//Sets up the sound with the object properties and sets it to play.
	source = audioCtx.createBufferSource();
	//Get the object buffer.
	source.buffer = obj.buffer;
	//Set the sound to looping or not
	source.loop = obj.loop;
	//Add volume controller
	obj.gainNode = audioCtx.createGain();
	obj.gainNode.gain.value = obj.volume;
	source.connect(obj.gainNode);
	//Connect and play the sound starting from 0.
	obj.gainNode.connect(audioCtx.destination);	
	obj.source = source;
	obj.loaded = true;	
	obj.source.start(obj.time);
	obj.playing = true;
}

function playPanner(obj)
{
	//Sets up the sound with the object properties and sets it to play.
	source = audioCtx.createBufferSource();
	//Get the object buffer.
	source.buffer = obj.buffer;
	//Set the sound to looping or not
	source.loop = obj.loop;
	
	//Add volume controller
	obj.gainNode = audioCtx.createGain();
	obj.gainNode.gain.value = obj.volume;	
	
	//Set up panner instance
	var panner = audioCtx.createPanner();
	panner.coneOuterAngle = 360;
	panner.coneOuterGain = 0.08;
	panner.coneInnerAngle = 360;
	panner.coneInnerGain = 0.08;
	panner.setPosition(0, 0, 0);
	
	//Connect the panner to the audio connect and then attach the source	
	source.connect(obj.gainNode);
	obj.gainNode.connect(panner);
	panner.connect(audioCtx.destination);
	obj.panner = panner;
	obj.source = source;	
	//Set a listener at 0, 0, 0
	audioCtx.listener.setPosition(0, 0, 0);
	audioCtx.listener.setOrientation(0, 0, -1, 0, 1, 0);
	obj.panner.setPosition(0, 0, 0);
	obj.loaded = true;
	obj.source.start(0);
	obj.playing = true;
	
	
}

function stop(obj) 
{
	if(obj.playing == true)
	{	
		obj.time = audioCtx.currentTime;
		obj.source.stop(0);
		obj.playing = false;
	}
}

AudioManager.prototype.setVolume = function(obj, change)
{
	obj.gainNode.gain.value = Math.min(2,change);
	obj.gainNode.gain.value = Math.max(0.1,change);
}
function onError(e)
{
	console.log("Error");
}

