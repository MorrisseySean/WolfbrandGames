function Player(x, y, radius, screenWidth, screenHeight)
{
	//Set up player position and radius parameters
	this.position = new Vector2(x, y);
	this.radius = radius;
	
	//Set up speed and direction parameters
	this.speed = radius/15;
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
	this.flashRange = 0;
	this.sprintPower = false;
	this.sanityRegen = false;
	this.flashRange = 0;
	this.areaRange = 0.05;
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
	
	//Hunger and thirst decrease as the game progresses
	if(this.hunger > 0){this.hunger -= 0.005;}
	if(this.thirst > 0){this.thirst -= 0.01;}
	
}
Player.prototype.PickUpPower = function(value)
{	//Gives the player a bonus if they pick up an item based on which item is picked up(value)
	if(value == 0)	
	{	//Battery - Increased flashlight range
		game.flashlight.maxFlash += game.flashlight.maxFlash/10;
	}
	else if(value == 1)
	{	//Pills - Sanity regeneration
		this.sanityRegen = true;	
	}
	else if(value == 2)
	{	//Food - Regain hunger
		this.hunger += 20;
		if(this.hunger > 100)
		{
			this.hunger = 100;
		}		
	}
	else if(value == 3)
	{	//Bandage - 		
		console.log("Pills");		
	}
	else if(value == 4)
	{	//Lighter - AOE Light		
		this.areaRange = 0.25;		
	}
	else if(value == 5)
	{	//Water - Increased walk speed
		this.thirst += 20;
		if(this.thirst > 100)
		{
			this.thirst = 100;
		}			
	}
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
	if(keys["space"] == true && this.sprintPower == true)
	{
		sprint = true;		
	}
	else{sprint = false;}
	
	if(keys["up"] == true)
	{
		if(sprint == true)
		{
			velocity = new Vector2((this.speed * 1.5) * Math.cos(this.dir), (this.speed * 1.5) * Math.sin(this.dir));
		}
		else
		{
			velocity = new Vector2(this.speed * Math.cos(this.dir), this.speed * Math.sin(this.dir));
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
		velocity = new Vector2(-(this.speed/4 * Math.cos(this.dir)), -(this.speed/4 * Math.sin(this.dir)));
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
	this.dir -= 1.5;
	if(this.dir < 0)
	{
		this.dir += 360;
	}
	this.dir *= (Math.PI/180);
}
Player.prototype.turnRight = function()
{
	this.dir *= (180/Math.PI);
	this.dir += 1.5;
	this.dir %= 360;
	this.dir *= (Math.PI/180);
}
/////////////////////////////////////////////////////////////


////////////////////Flashlight enemy detection//////////////
Player.prototype.sanityCheck = function(enemySeen, enemyAttack)
{
	if(enemyAttack == true)
	{
		this.sanity -= 2;
	}
	else if(enemySeen == true)
	{
		this.sanity -= 0.5;
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
	if(this.sanity <= 0)
	{
		return true;
	}
	return false;
}
///////////////////////////////////////////////////////////

Player.prototype.Draw = function(offsetX, offsetY)
{
	canvasCtx.fillStyle = rgb(0, 200, 0);
	//draw a circle
	canvasCtx.beginPath();
	canvasCtx.arc(this.position.x - offsetX, this.position.y - offsetY, this.radius, 0, Math.PI*2); 
	canvasCtx.closePath();
	canvasCtx.fill();
	this.image.rotateAnimDraw(new Vector2(((this.position.x - this.radius) - offsetX), ((this.position.y - this.radius) - offsetY)), this.radius, this.radius, this.dir, 0);	
}

Player.prototype.TestDraw = function(offsetX, offsetY)
{
	this.image.rotateAnimDraw(new Vector2(((this.position.x - this.radius) - offsetX), ((this.position.y - this.radius) - offsetY)), this.radius, this.radius, this.dir, this.frameTime % 8);
}

Player.prototype.DrawFlashlight = function(offsetX, offsetY, screenWidth, screenHeight)
{
	this.flashlight.rotateDraw(new Vector2(((this.position.x - this.flashlight.width/2) - offsetX), ((this.position.y - this.flashlight.height/2) - offsetY)), (this.flashlight.width/2), this.flashlight.height/2 , this.dir);
}