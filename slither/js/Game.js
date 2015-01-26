var canvasCtx, audioCtx, maps;

function Game()
{
	//Initialise player
	this.player = new Player(0,0, GAMESIZE/2);
	
	//Initialise flashlight
	this.flashlight = new Flashlight(this.player.position, GAMESIZE * 5, 60, 30, 'rgba(0,0,0,0)');
	
	//Initialise enemy
	this.enemy = new Enemy(-500, -500, GAMESIZE);
	
	//Initialise tutorial
	this.tutorial = new Tutorial();
	
	//Sets up the camera
	this.cam = new Camera();
	
	//Game states
	this.states = { Paused : 0, Playing : 1, Win : 2, Loss : 3, Menu : 4, HowTo : 5, Note : 6};
	this.gameState = this.states.Menu;
	
	//Menu states
	this.menuSelect = 0;
	this.menuStates = ["Play", "How To Play", "Survey", "BugReport"];	
	
	//Set up key map
	this.keys = {};
	this.keys["up"] = false;
	this.keys["right"] = false;
	this.keys["left"] = false;
	
	//Time looping variables
	this.time = (new Date).getTime();
	this.secTime = (new Date).getTime();
	this.fps = 0;
	this.fpsPrint = 0;
	
	//Sound data and parameters to be used for each sound.
	this.audio;
	this.sounds = 
	{
		gameLoop : 
		{
			src : "slither/sounds/creep.mp3",
			volume : 0.05,
			loop : true,
			playing : false,
			loaded : false,
			panner : 0,
			source : 0,
			time : 0
		},
		whisper : 
		{
			src : "slither/sounds/whisper.mp3",
			volume : 0.15,
			loop : false, 
			playing : false,
			loaded : false,
			panner : 0,
			source : 0,
			time : 0
		},
		footstep : 
		{
			src : "slither/sounds/footstep.mp3",
			volume : 0.07,
			loop : true,
			playing : false,
			loaded : false,
			panner : 0,
			source : 0,
			time : 0
		},
		zipper : 
		{
			src : "slither/sounds/zipper.mp3",
			volume : 0.07,
			loop : false,
			playing : false,
			loaded : false,
			panner : 0,
			source : 0,
			time : 0
		}
	}	
	this.GAMESIZE = 50;
	
}

//////////////////////Initialise methods///////////////////////////////
Game.prototype.init = function(id)
{	//Runs the initialisation methods
	this.initAudio();
	this.initCanvas(id);
	maps = new GameManager();	
}

Game.prototype.initGame = function()
{	//Initialises the gameManager and camera
	maps.init(GAMESIZE * 2);
	maps.GenerateMap(this.player);
	this.cam.init(maps.mapWidth, maps.mapHeight, canvas.width, canvas.height);		
}

Game.prototype.initCanvas = function(id)
{	//Set up the Canvas to draw game elements on
	//Create canvas and attach it to the file.
	canvas = document.createElement('canvas');
	canvasCtx = canvas.getContext('2d');
	//document.body.appendChild(canvas);
	//Set canvas size
	canvas.width = GAMEWIDTH;
	canvas.height = GAMEHEIGHT;
	//Add a listener for key presses and releases
	canvas.addEventListener("keydown", onKeyPress, true);
	canvas.addEventListener("keyup", onKeyUp, true);
	document.addEventListener("resize", onResize, true);
	//Set tab index to 0 and set focus on canvas
	canvas.setAttribute('tabindex', '0');
	div = document.getElementById(id);
	div.appendChild(canvas);
	//canvas.focus();
}

Game.prototype.initAudio = function()
{	//Initialise the audio context	
	try 
	{
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		audioCtx = new AudioContext();
	}
	catch(e) 
	{
		alert('Web Audio API is not supported in this browser');
	}
	//Load the audio manager and sounds.
	this.audio = new AudioManager();
	this.audio.Load(this.sounds.whisper);
	this.audio.Load(this.sounds.gameLoop);
	this.audio.Load(this.sounds.footstep);
	this.audio.Load(this.sounds.zipper);	
}
/////////////////////////////////////////////////////////////////////////////

function onResize(e)
{	//Resets canvas size on resize (not working)
	
	canvas.width = window.innerWidth - 20;
	canvas.height = window.innerHeight - 20;
}

function onKeyPress(e)
{	//Places user input into the keys map
	/////////////Command Pattern////////////
	/*var ActionQueue = [];
	if(game.gameState == game.states.Playing)
	{
		if (e.keyCode == 87 || e.keyCode == 38)
		{		
			ActionQueue[ActionQueue.length] = MoveUnitCommand(game.player, 0, -GAMESIZE/10);
		}
		else if(e.keyCode == 65 || e.keyCode == 37)
		{
			ActionQueue[ActionQueue.length] = MoveUnitCommand(game.player, -GAMESIZE/10, 0);
		}		
		else if(e.keyCode == 68||e.keyCode == 39)
		{
			ActionQueue[ActionQueue.length] = MoveUnitCommand(game.player, GAMESIZE/10, 0);
		}
		else if(e.keyCode == 83||e.keyCode == 40)
		{
			ActionQueue[ActionQueue.length] = MoveUnitCommand(game.player, 0, GAMESIZE/10);
		}
	}
	for(var i = 0; i < ActionQueue.length; i++)
	{
		ActionQueue[i]();
	}*/
	///////////////////////////////////////////
	if (e.keyCode == 87 || e.keyCode == 38)
	{		
		game.keys["up"] = true;
		e.preventDefault();
	}
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		game.keys["left"] = true;
		e.preventDefault();
	}		
	else if(e.keyCode == 68||e.keyCode == 39)
	{
		game.keys["right"] = true;
		e.preventDefault();
	}
	else if(e.keyCode == 83||e.keyCode == 40)
	{
		game.keys["back"] = true;
		e.preventDefault();
	}
	if(e.keyCode == 13)
	{
		game.keys["enter"] = true;
		e.preventDefault();
	}
	
	//Pause and Unpause game.
	else if(e.keyCode == 27)
	{
		if(game.gameState == game.states.Playing)
		{
			game.gameState = game.states.Paused;
			stop(game.sounds.footstep);
			stop(game.sounds.gameLoop);
			stop(game.sounds.whisper);	
		}
		else if(game.gameState == game.states.Paused)
		{
			game.gameState = game.states.Playing;
		}
	}
	else if(e.keyCode == 32)
	{
		game.keys["space"] = true;
	}
	
}

function onKeyUp(e)
{	//Removes user input from keys map if user releases the key
	if (e.keyCode == 87 || e.keyCode == 38)
	{		
		game.keys["up"] = false;
		if(game.gameState == game.states.Menu)
		{			
			//Toggle through menu options
			if(game.menuSelect - 1 < 0)
			{
				game.menuSelect = game.menuStates.length;
			}
			game.menuSelect = (game.menuSelect - 1)%game.menuStates.length;
		}
	}	
	else if(e.keyCode == 65 || e.keyCode == 37)
	{
		game.keys["left"] = false;		
	}		
	else if(e.keyCode == 68||e.keyCode == 39)
	{
		game.keys["right"] = false;		
	}
	else if(e.keyCode == 13)
	{
		game.keys["enter"] = false;
	}
	else if(e.keyCode == 83||e.keyCode == 40)
	{
		game.keys["back"] = false;
		if(game.gameState == game.states.Menu)
		{			
			//Toggle through menu options
			game.menuSelect = (game.menuSelect + 1)%game.menuStates.length;
		}
	}
	else if(e.keyCode == 32)
	{
		game.keys["space"] = false;
	}
}

Game.prototype.reset = function()
{	//Resets all necessary game elements
	this.player = new Player(0,0, GAMESIZE/2);
	this.enemy = new Enemy(-500, -500, GAMESIZE);
	this.initGame();
	stop(this.sounds.footstep);
	stop(this.sounds.gameLoop);
	stop(this.sounds.whisper);	
}

Game.prototype.gameLoop = function() 
{	//Deals with all runtime events during gameplay
	var curTime = (new Date).getTime();
	game.fps++;
	if(curTime - game.secTime > 1000)
	{
		//console.log(game.fps);
		game.flashlight.timeLapse();
		game.fpsPrint = game.fps;
		game.fps = 0;
		game.secTime = curTime;
	}
	game.time = curTime;
	if(game.gameState == game.states.Menu) 
	{		
		if(game.keys["enter"] == true) //Pressing enter brings you to the highlighted option.
		{
			if(game.menuSelect == 0) //If the player selects Play, reset game state and display the starting note screen
			{				
				game.reset();
				game.gameState = game.states.Playing;
				game.tutorial.displaying = true;
			}				
			else if(game.menuSelect == 1) //Display the how to screen
			{
				game.gameState = game.states.HowTo;
			}
			else if(game.menuSelect == 2) //Open up a pop-up to a survey about their gameplay experience.
			{
				window.open("https://docs.google.com/forms/d/1pguXN83jDYY4XGJy-dkIahuRHwAHa5J-lFSLrR-lSCY/viewform");
			}
			else if(game.menuSelect == 3) //Open a pop-up to a form to submit bug reports.
			{
				window.open("http://goo.gl/forms/0jtjXSGRZ5");
			}
			game.keys["enter"] = false;			
		}
	}
	else if(game.tutorial.displaying == true)
	{
		//If the player presses enter the note is dismissed and the game is started.
		game.tutorial.Update(game.keys);
	}
	else if(game.gameState == game.states.Playing) 
	{		
		if(game.sounds.gameLoop.playing == false && maps.GetPickUpCount() > 0)
		{
			//Play game loop sound if it's not already playing and the player has picked up 1 or more items.
			playSound(game.sounds.gameLoop);
		}		
		if(maps.CheckWin())
		{
			//Check the win condition and display the win screen if appropriate 
			game.gameState = game.states.Win;
		}
		else if(game.player.CheckLoss())
		{
			//Check the loss condition and display the loss screen if appropriate
			game.gameState = game.states.Loss;
		}
		//Run all the updates of game elements.
		maps.checkTriggers(game.player.position, game.player.radius);
		maps.PickUpItems(game.player.position, game.player.radius, game.sounds.zipper);	
		game.player.Update(game.keys, game.flashlight.enemySeen, game.enemy.attack, game.sounds.footstep);
		game.flashlight.Update(game.player.getPos(), game.player.getDir(), game.player.sanity, game.keys["space"]);
		game.cam.update(game.player.getX(), game.player.getY());
		game.enemy.Update(game.player.getPos(), game.player.getDir(), game.player.sanity, maps.GetPickUpCount(), game.sounds.whisper, new Vector2(maps.mapWidth, maps.mapHeight));
		game.audio.Update(game.player.getPos(), game.player.getDir(), game.enemy.getPos());			
	}
	else if(game.gameState == game.states.Loss || game.gameState == game.states.Win || game.gameState == game.states.HowTo)
	{
		//If looking at the loss, win or instructions screen, pressing enter will return you to the menu screen
		if(game.keys["enter"] == true)
		{
			game.keys["enter"] = false;
			game.gameState = game.states.Menu;
		}
	}
	else if(game.gameState == game.states.Paused)
	{
		if(game.sounds.gameLoop.playing == true)
		{
			stop(game.sounds.gameLoop);
		}
	}
	//Draw the game elements and update the frame.
	game.Draw();	
	window.requestAnimFrame(game.gameLoop);
}

Game.prototype.Draw = function() 
{	//Draw game elements to the screen
	//Clear canvas
	canvasCtx.fillStyle = 'rgba(0,0,0,0.1)';	
	canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
	if(game.gameState == game.states.Playing)
	{
		if(game.tutorial.displaying == true)
		{
			game.tutorial.Draw();
		}
		else
		{
			//Call map draw method
			maps.Draw(this.cam.getX(), this.cam.getY());
			//Enemy draw method
			this.enemy.Draw(this.cam.getX(), this.cam.getY());	
			//Draw the flashlight if the the tutorial is complete.
			if(this.tutorial.complete == true)
			{
				this.flashlight.shineFlashlight(maps.GetNearestWalls(this.player.position), this.enemy, this.cam.getX(), this.cam.getY());
			}
			maps.DrawLights(this.cam.getX(), this.cam.getY());
			//Call player draw method
			this.player.TestDraw(this.cam.getX(), this.cam.getY());		
			//Call the map hud draw method
			maps.DrawHUD();
		}		
		canvasCtx.fillStyle = "purple";
		canvasCtx.font = "30px Georgia";
		canvasCtx.fillText(game.fpsPrint, 10, 30);
	}
	else if(game.gameState == game.states.Paused)
	{
		canvasCtx.fillStyle = "purple";
		canvasCtx.font = "100px Georgia";
		canvasCtx.fillText("Paused", canvas.width/2, canvas.height/2);
	}
	else if(game.gameState == game.states.Note)
	{
		IMAGE.NOTE.draw(new Vector2(0, 0));
	}
	else if(game.gameState == game.states.Win)
	{
		canvasCtx.fillStyle = "purple";
		canvasCtx.font = "30px Georgia";
		canvasCtx.fillText("End of the alpha build...", canvas.width/2 - 400, canvas.height/2 - 100);
		canvasCtx.fillText("I guess that means you win...", canvas.width/2 - 400, canvas.height/2);
		canvasCtx.fillText("...for now...", canvas.width/2 - 400, canvas.height/2 + 100);
		
	}
	else if(game.gameState == game.states.Loss)
	{
		canvasCtx.fillStyle = "purple";
		canvasCtx.font = "30px Georgia";
		canvasCtx.fillText("You went insane, your body was found lifeless on the street at 6:23a.m", canvas.width/2 - 400, canvas.height/2 - 200);
		canvasCtx.fillText("by an office worker on their daily commute.", canvas.width/2 - 400, canvas.height/2 - 100);
		canvasCtx.fillText("Assumed suicide.", canvas.width/2 - 400, canvas.height/2);
		canvasCtx.fillText("You Lose.", canvas.width/2 - 400, canvas.height/2 + 100);
	}
	else if(game.gameState == game.states.Menu)
	{
		canvasCtx.font = "30px Georgia";					
		for(i = 0; i < game.menuStates.length;i++)
		{
			canvasCtx.fillStyle = "purple";
			if(i == game.menuSelect)
			{
				canvasCtx.fillStyle = "white";
			}
			canvasCtx.fillText(game.menuStates[i], 0, canvas.height/2 - GAMESIZE + (GAMESIZE * 2 * i));			
		}					
	}
	else if(game.gameState == game.states.HowTo)
	{
		canvasCtx.font = "20px Georgia";
		canvasCtx.fillStyle = "purple";
		canvasCtx.fillText("CONTROLS", canvas.width/2 - 350, canvas.height/2 - 250);
		canvasCtx.fillText("Move Forward - W/Up Arrow", canvas.width/2 - 300, canvas.height/2 - 200);
		canvasCtx.fillText("Turn Left - A/Left Arrow", canvas.width/2 - 300, canvas.height/2 - 150);
		canvasCtx.fillText("Turn Right - D/Right Arrow", canvas.width/2 - 300, canvas. height/2 - 100);
		canvasCtx.fillText("Space - Sprint", canvas.width/2 - 300, canvas. height/2 - 50);
		canvasCtx.fillText("Pause - Esc", canvas.width/2 - 300, canvas. height/2);
		canvasCtx.fillText("INSTRUCTIONS", canvas.width/2 - 350, canvas.height/2 + 100);
		canvasCtx.fillText("Search for the supplies", canvas.width/2 - 300, canvas.height/2 + 150);
		canvasCtx.fillText("Stay away from it, Don't look at it, RUN!", canvas.width/2 - 300, canvas.height/2 + 200);
	}
}

function getDist(pointA, pointB) 
{	//Get the distance between two points
	var a = pointA.x - pointB.x;
    var b = pointA.y - pointB.y;    
    return Math.sqrt((a * a) + (b * b));
}

function MoveUnitCommand(unit, x, y)
{	//Command object to move game elements
	return function() 
	{		
		unit.move(x, y);
	}
}