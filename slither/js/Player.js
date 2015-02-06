function Player(x, y, radius, screenWidth, screenHeight)
{
	//Set up player position and radius parameters
	this.position = new Vector2(x, y);
	this.radius = radius;
	
	//Set up speed and direction parameters
	this.speed = radius * 4;
	this.dir = 270 * Math.PI/180;
	
	//Parameter for sanity, hunger and thirst
	this.sanity = 100;
	this.hunger = 100;
	this.thirst = 100;
	
	//Player sprite and animation timers
	this.image = IMAGE.PLAYERSHEET;
	this.frameTime = 0;	
	this.frameStep = 0;
	
	//Sprint variables
	this.sprint = false;
	this.sprintTime = 0;
	
	//Pickup effects
	this.pickedUpItems = []; //List of items the player has picked up	
	this.invSelect = 0; //Index for the currently selected item
	this.pillTimer = 0;	//Cooldown timer for the pill usage
	this.flashOn = false;	//Turns the flashlight on and off.	
	this.areaRange = 0.05; //Manipulates area range
	this.glowstickTimer = 0 //Cooldown timer for the glowstick
	this.glowsticks = []; //Stores glowsticks dropped
	this.batteryTimer = 0;
	this.batteryPower = 1;
}

///////////////////////Get Methods///////////////////////////
Player.prototype.getX = function()
{//Returns the x position of the player
	return this.position.x;
}
Player.prototype.getY = function()
{//Returns the y position of the player
	return this.position.y;
}
Player.prototype.getPos = function()
{
	return this.position;
}
Player.prototype.getDir = function()
{
	return this.dir;
}
Player.prototype.getSanity = function()
{
	return this.sanity;
}
/////////////////////////////////////////////////////////////


///////////////////////Set Methods///////////////////////////
Player.prototype.setPos = function(x, y)
{//Sets the position of the player
	this.position.x = x;
	this.position.y = y;
}
Player.prototype.setDir = function(dir)
{//Sets the direction of the player
	this.dir = dir;
}
Player.prototype.setSpeed = function(spd)
{//Sets the speed of the player
	this.speed = spd;
}
/////////////////////////////////////////////////////////////

Player.prototype.Update = function(keys, enemySeen, enemyAttack, stepSound)
{
	this.walk(keys, stepSound);
	this.sanityCheck(enemySeen, enemyAttack);
	this.PickUpPower();
	if(game.PIP.inactive == false)
	{
		//this.flashOn = false;
	}
	else
	{
		//this.flashOn = true;
	}
}
Player.prototype.Tick = function()
	//Ticks down timer values every second
{
	//Hunger and thirst decrease as the game progresses
	if(this.hunger > 0){this.hunger -= 0.25;}
	if(this.thirst > 0){this.thirst -= 0.5;}
	
	//Cooldown of using items
	if(this.pillTimer > 0){this.pillTimer -= 1;};
	if(this.glowstickTimer > 0){this.glowstickTimer -= 1;};
	if(this.batteryTimer > 0){this.batteryTimer--};
	if(this.batteryTimer < 40){this.batteryPower = 1;};
	
	//Duration timer of glowsticks
	for(var i = 0; i < this.glowsticks.length; i++)
	{
		this.glowsticks[i].timer--;
		if(this.glowsticks[i].timer <= 0)
		{
			this.glowsticks.splice(0, 1);
		}
	}
}

Player.prototype.PickUpItem = function(value)
	//Add the item to the players inventory or increase their hunger/thirst on picking up an item
{
	if(value >= 2)
	{
		this.pickedUpItems[this.pickedUpItems.length] = value;
	}
	else if(value == 0)
	{
		this.hunger += 20;
		if(this.hunger > 100)
		{
			this.hunger = 100;
		}	
	}
	else if(value == 1)
	{
		this.thirst += 20;
		if(this.thirst > 100)
		{
			this.thirst = 100;
		}
	}
		
}

Player.prototype.PickUpPower = function()
{	
	//Cycle through inventory using the Q and E keys.
	if(game.keys["Q"] == true)
	{
		if(this.invSelect > 0)
		{
			this.invSelect--;
		}			
		else
		{
			this.invSelect = this.pickedUpItems.length - 1;
		}			
		game.keys["Q"] = false;
	}
	else if(game.keys["E"] == true)
	{
		if(this.invSelect < this.pickedUpItems.length)
		{			
			this.invSelect++;
		}
		else
		{
			this.invSelect = 0;
		}
		game.keys["E"] = false;
	}
	//Use selected inventory item
	if(game.keys["space"] == true)
	{
		this.sprint = false;
		this.areaRange = 0.05;
		if(this.pickedUpItems[this.invSelect] == 2) //Pills - Sanity Regeneration - 60 second CD
		{
			if(this.pillTimer <= 0)
			{
				this.sanity += 10;
				if(this.sanity > 100)
				{
					this.sanity = 100;
				}
				this.pillTimer = 60;
			}
		}
		else if(this.pickedUpItems[this.invSelect] == 3) //Glowsticks - Droppable objects
		{
			if(this.glowstickTimer <= 0)
			{
				this.glowsticks[this.glowsticks.length] = new Glowstick(this.position);
				this.glowstickTimer = 30;
			}
		}
		else if(this.pickedUpItems[this.invSelect] == 4) //Lighter - Area Vision
		{
			this.areaRange = 0.4;
		}
		else if(this.pickedUpItems[this.invSelect] == 5)
		{
			if(this.batteryTimer <= 0)
			{
				this.batteryPower = 1.2;
				this.batteryTimer = 60;
			}
		}
		else if(this.pickedUpItems[this.invSelect] == 6) //Runners - Increased run speed
		{
			this.sprint = true;
		}
		else if(this.pickedUpItems[this.invSelect] == 7)
		{
			this.flashOn = !this.flashOn;
			game.keys["space"] = false;
		}
	}
	else
	{
		this.sprint = false;
		this.areaRange = 0.05;
	}
}

function Glowstick(position)
	//Objects dropped by the glowsticktube power up
{
	this.image = IMAGE.GLOWSTICKSPRITE;
	this.position = position;
	this.timer = 60;
}

Player.prototype.move = function(x, y)
{
	this.position.x += x;
	this.position.y += y;
	console.log("move");
}

////////////////////Movement Methods////////////////////////
Player.prototype.walk = function(keys, stepSound)
{	//Update player position based on speed and direction	
	if(keys["up"] == true)
	{
		if(this.sprint == true)
		{
			velocity = new Vector2(((this.speed * 1.5) * game.timeElapsed) * Math.cos(this.dir), ((this.speed * 1.5)* game.timeElapsed)  * Math.sin(this.dir));
		}
		else
		{
			velocity = new Vector2((this.speed * game.timeElapsed)  * Math.cos(this.dir), (this.speed * game.timeElapsed) * Math.sin(this.dir));
		}
		this.position = new Vector2(this.position.x + velocity.x, this.position.y + velocity.y);
		//Check if the player is outside the map bounds.
		if(this.position.x - this.radius  < 0)
		{
			this.position.x = this.radius;
		}
		else if(this.position.x + this.radius > maps.mapWidth)
		{
			this.position.x = maps.mapWidth - (this.radius + 1);
		}
		if(this.position.y - this.radius  < 0)
		{
			this.position.y = this.radius;
		}
		else if(this.position.y + this.radius > maps.mapHeight)
		{
			this.position.y = maps.mapHeight - (this.radius + 1);
		}		//Check for collision with walls
		this.position = maps.DetectWallCollision(this.position, this.radius);
		this.frameStep++;
		if(this.frameStep > 8)
		{
			this.frameTime++;
			this.frameStep = 0;
		}
		//If the footstep sound is loaded and not playing, play it
		if(stepSound.playing == false)		
			playSound(stepSound);
		
	}
	else if(keys["back"] == true)
	{
		velocity = new Vector2(-((this.speed/4 * game.timeElapsed) * Math.cos(this.dir)), -((this.speed/4* game.timeElapsed)  * Math.sin(this.dir)));
		this.position = new Vector2(this.position.x + velocity.x, this.position.y + velocity.y);
		//Check if the player is outside the map bounds.
		if(this.position.x - this.radius  < 0)
		{
			this.position.x = this.radius;
		}
		else if(this.position.x + this.radius > maps.mapWidth)
		{
			this.position.x = maps.mapWidth - this.radius;
		}
		if(this.position.y - this.radius  < 0)
		{
			this.position.y = this.radius;
		}
		else if(this.position.y + this.radius > maps.mapHeight)
		{
			this.position.y = maps.mapHeight - this.radius;
		}
		//Check for collision with walls
		this.position = maps.DetectWallCollision(this.position, this.radius);
		//If the footstep sound is loaded and not playing, play it
		if(stepSound.playing == false)
			playSound(stepSound);
	}
	else
	//If the player is not moving forward or back, stop the step sound if it is playing.
	{
		if(stepSound.playing == true)
		{
			stop(stepSound);
		}		
	}
	if (keys["right"] == true)
	{
		this.turnRight();
	}
	else if (keys["left"] == true)
	{
		this.turnLeft();
	}
}

//Methods to rotate player left or right
Player.prototype.turnLeft = function()
{
	this.dir *= (180/Math.PI);
	this.dir -= 100 * game.timeElapsed;
	if(this.dir < 0)
	{
		this.dir += 360;
	}
	this.dir *= (Math.PI/180);
}
Player.prototype.turnRight = function()
{
	this.dir *= (180/Math.PI);
	this.dir += 100 * game.timeElapsed;
	this.dir %= 360;
	this.dir *= (Math.PI/180);
}
/////////////////////////////////////////////////////////////


////////////////////Flashlight enemy detection//////////////
Player.prototype.sanityCheck = function(enemySeen, enemyAttack)
{
	if(enemyAttack == true)
	{
		this.sanity -= 3;
	}
	else if(enemySeen == true)
	{
		this.sanity -= 1;
	}
	else
	{
		if(this.sanity < 100 && this.sanityRegen == true)
		{
			this.sanity+=0.01;
		}
	}
	
}
Player.prototype.CheckLoss = function()
{
	if(this.sanity <= 0 || this.hunger <= 0 || this.thirst <= 0)
	{
		return true;
	}
	return false;
}
///////////////////////////////////////////////////////////

Player.prototype.Draw = function()
{
	var i = 0;
	for(i = 0; i < this.glowsticks.length; i++)
	{
		this.glowsticks[i].image.draw(this.glowsticks[i].position);
	}
	this.image.rotateAnimDraw(this.position, this.radius, this.dir, this.frameTime % 8);
	this.DrawHUD();
}

Player.prototype.DrawHUD = function()
	//Draws HUD elements
{		
	//Draw sanity bar
	canvasCtx.fillStyle = rgb(100, 0, 100);
	canvasCtx.fillRect(GAMEWIDTH - (GAMESIZE * 5), 10, (GAMESIZE * 4) * this.sanity/100, 20);
	canvasCtx.fillStyle = "grey";
	canvasCtx.font = "18px Georgia";
	canvasCtx.fillText("SANITY", GAMEWIDTH - (GAMESIZE * 5), 30);
	
	//Draw hunger bar
	canvasCtx.fillStyle = rgb(100, 50, 50);
	canvasCtx.fillRect(GAMEWIDTH - (GAMESIZE * 5), 35, (GAMESIZE * 4) * this.hunger/100, 20);
	canvasCtx.fillStyle = "gray";
	canvasCtx.font = "18px Georgia";
	canvasCtx.fillText("HUNGER", GAMEWIDTH - (GAMESIZE * 5), 55);
	
	//Draw thirst bar
	canvasCtx.fillStyle = rgb(10, 10, 100);
	canvasCtx.fillRect(GAMEWIDTH - (GAMESIZE * 5), 60, (GAMESIZE * 4) * this.thirst/100, 20);
	canvasCtx.fillStyle = "gray";
	canvasCtx.font = "18px Georgia";
	canvasCtx.fillText("THIRST", GAMEWIDTH - (GAMESIZE * 5), 80);
	
	//Draw the selected inventory item in the top right of the screen.
	if(this.pickedUpItems.length > 0)
	{
		if(this.pickedUpItems[this.invSelect] == 2) //Pills
		{
			IMAGE.PILLSPRITE.huddraw(new Vector2(GAMESIZE/4, GAMESIZE/4));
			canvasCtx.fillStyle = "purple";
			canvasCtx.font = "18px Georgia";
			canvasCtx.fillText(this.pillTimer, GAMESIZE/4, GAMESIZE/4);
		}
		else if(this.pickedUpItems[this.invSelect] == 3) //Bandage
		{
			IMAGE.GLOWSTICKTUBE.huddraw(new Vector2(GAMESIZE/4, GAMESIZE/4));
			canvasCtx.fillStyle = "purple";
			canvasCtx.font = "18px Georgia";
			canvasCtx.fillText(this.glowstickTimer, GAMESIZE/4, GAMESIZE/4);
		}
		else if(this.pickedUpItems[this.invSelect] == 4) //Lighter
		{
			IMAGE.LIGHTERSPRITE.huddraw(new Vector2(GAMESIZE/4, GAMESIZE/4));
		}
		else if(this.pickedUpItems[this.invSelect] == 5) //Battery
		{
			IMAGE.BATTERYSPRITE.huddraw(new Vector2(GAMESIZE/4, GAMESIZE/4));
			canvasCtx.fillStyle = "purple";
			canvasCtx.font = "18px Georgia";
			canvasCtx.fillText(this.batteryTimer, GAMESIZE/4, GAMESIZE/4);
		}
		else if(this.pickedUpItems[this.invSelect] == 6)
		{
			IMAGE.RUNNERSPRITE.huddraw(new Vector2(GAMESIZE/4, GAMESIZE/4));
		}
		else if(this.pickedUpItems[this.invSelect] == 7)
		{
			IMAGE.FLASHLIGHTSPRITE.huddraw(new Vector2(GAMESIZE/4, GAMESIZE/4));
		}
	}
}