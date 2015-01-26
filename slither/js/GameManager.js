var building, emptySquare;
//Generates and draws the map and deals with collisions</summary>//

function GameManager()
{
	this.size = 0;
	this.building = [];
	this.map = [];
	this.buildArray = [];
	this.emptySquare = []
	this.pickups = [];
	this.waterArray = [];
	this.foodArray = [];
	this.triggers = [];
	this.mapWidth = 0;
	this.mapHeight = 0;
}

GameManager.prototype.init = function(size)
{
	this.size = size;
	
	//Pickups
	if(this.pickups.length == 0)
	{
		this.pickups[this.pickups.length] = this.pills = new PickUp(0, 0, "pills", this.size/2);
		this.pickups[this.pickups.length] = this.battery = new PickUp(0, 0, "battery", this.size/2);
		//this.pickups[this.pickups.length] = this.food = new PickUp(0, 0, "food", this.size/2);
		this.pickups[this.pickups.length] = this.bandage = new PickUp(0, 0, "bandage", this.size/2);
		this.pickups[this.pickups.length] = this.lighter = new PickUp(0, 0, "lighter", this.size/2);
		//this.pickups[this.pickups.length] = this.water = new PickUp(0, 0, "water", this.size/2);
	}
	
	if(this.waterArray.length == 0)
	{
		for(var i = 0; i < 4; i++)
		{
			this.waterArray[this.waterArray.length] = new PickUp(0, 0, "water", this.size/2);			
		}		
	}
	if(this.foodArray.length == 0)
	{
		for(var i = 0; i < 4; i++)
		{
			this.foodArray[this.foodArray.length] = new PickUp(0, 0, "food", this.size/2);
		}	
	}
	
	for(var i = 0; i < this.pickups.length; i++)
	{
		this.pickups[i].pickedUp = false;
	}
	
	//Map squares
	// 0 = Road   
	// 1 = Wall
	// 2 = Floor
	// 3 = Door
	
	emptySquare = 	[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
	
	this.map = [[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0],
				[0,0,0,0,0]];
	
	this.building[0] = 	[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 2, 1, 1, 2, 1, 0],
						[0, 2, 2, 2, 5, 1, 1, 2, 1, 0],
						[0, 1, 2, 1, 1, 6, 2, 2, 1, 0],
						[0, 1, 2, 1, 1, 2, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 1, 1, 1, 1, 2, 1, 1, 0],						
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
					
	this.building[1] = 	[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
						[0, 2, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 1, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 2, 6, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 1, 1, 2, 2, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],						
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
						
	this.building[2] = 	[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 7, 1, 2, 2, 2, 0],
						[0, 1, 2, 1, 8, 1, 2, 1, 1, 0],
						[0, 2, 2, 1, 7, 1, 2, 1, 1, 0],
						[0, 1, 2, 1, 8, 1, 2, 2, 2, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],						
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
						
	this.building[3] = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 1, 1, 2, 1, 1, 1, 1, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 1, 1, 2, 2, 1, 0],
						[0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
						[0, 1, 2, 2, 2, 1, 1, 2, 1, 0],
						[0, 1, 2, 1, 2, 2, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 1, 1, 1, 1, 2, 1, 1, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

	this.building[4] = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 1, 2, 1, 1, 1, 1, 1, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 2, 1, 1, 2, 2, 0],
						[0, 1, 2, 2, 2, 6, 1, 2, 1, 0],
						[0, 1, 2, 1, 5, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 1, 2, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
						
	this.building[5] = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
						[0, 1, 1, 1, 1, 1, 2, 1, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 2, 1, 2, 1, 2, 1, 1, 0],
						[0, 2, 2, 2, 8, 2, 7, 2, 1, 0],
						[0, 1, 1, 7, 1, 8, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
						[0, 1, 7, 1, 2, 1, 8, 1, 1, 0],
						[0, 1, 1, 1, 2, 1, 1, 1, 1, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
						
	this.building[6] = 	[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],						
						[0, 1, 1, 1, 123, 123, 1, 1, 1, 0],
						[0, 1, 2, 2, 2, 2, 2, 125, 1, 0],
						[0, 1, 1, 1, 1, 1, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 2, 1, 2, 1, 0],
						[0, 1, 2, 1, 2, 2, 1, 2, 1, 0],
						[0, 1, 2, 1, 1, 1, 1, 2, 1, 0],
						[0, 1, 2, 2, 2, 2, 126, 2, 1, 0],
						[0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
						[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
					
}

GameManager.prototype.GenerateMap = function(player)
{
	//Randomly place buildings on the map every time the game loads.
	for(var i = 0; i < this.map.length; i++)
	{
		for(var j = 0; j < this.map[i].length; j++)
		{
			if(j == Math.floor(this.map.length/2) && i == Math.floor(this.map[j].length/2))
			{	//Make the central building the starting building				
				this.map[j][i] = new Building(j * this.size * this.building[0].length, i * this.size * this.building[0].length, this.size, this.building[6]);
				player.setPos((j * this.size * this.building[0].length) + (this.size * (this.building[0].length/2)), i * this.size * this.building[0].length + (this.size * (this.building[0].length/2)));
			}
			else
			{	//Place a random building							
				this.map[j][i] = new Building(j * this.size * this.building[0].length, i * this.size * this.building[0].length, this.size, this.building[Math.floor(Math.random() * (this.building.length - 1))]);
			}
		}
	}	
	//Load the buildings into an array
	for(var i = 0; i < this.map.length; i++)
	{
		for(var j = 0; j < this.map[i].length; j++)
		{
			this.map[j][i].GenerateBuilding(this.triggers);
			if(j != Math.floor(this.map.length/2) || i != Math.floor(this.map[j].length/2))
			{
				this.map[j][i].GeneratePickUps();
			}
		}
	}
	//Load map dimensions into a variable
	this.mapWidth = (this.size * this.building[0][0].length) * this.map[0].length;
	this.mapHeight = (this.size * this.building[0].length) * this.map.length;
	
	//Debug code
	var output = 0;
	for(var i = 0; i < this.pickups.length; i++)
	{
		if(this.pickups[i].getPlaced() == true){output++}
	}
	console.log(output);		
}


GameManager.prototype.Draw = function(offsetX, offsetY)
{
	//Calls the draw function for the buildings with the required position based off of the map array
	for(var i = 0; i < this.map.length; i++)
	{
		for(var j = 0; j < this.map.length; j++)
		{
			this.map[i][j].Draw(offsetX, offsetY);			
		}
	}	
	//Draw pickups if they are placed on the map
	for(var k = 0; k < this.pickups.length; k++)
	{
		if(this.pickups[k].getPlaced() && this.pickups[k].pickedUp == false)
		{
			this.pickups[k].Draw(offsetX, offsetY);
		}
	}
}

GameManager.prototype.DrawLights = function(offsetX, offsetY){	
	//Calls the draw function for the buildings with the required position based off of the map array
	for(var i = 0; i < this.map.length; i++)
	{
		for(var j = 0; j < this.map.length; j++)
		{
			if(this.map[i][j].lightswitch == true)
			{
				this.map[i][j].DrawLights(offsetX, offsetY);
			}
		}
	}
	
	for(var k = 0; k < this.pickups.length; k++)
	{
		if(this.pickups[k].getPlaced() && this.pickups[k].pickedUp == false)
		{
			this.pickups[k].Draw(offsetX, offsetY);
		}
	}
	for(var k = 0; k < this.waterArray.length; k++)
	{
		if(this.waterArray[k].getPlaced() && this.waterArray[k].pickedUp == false)
		{
			this.waterArray[k].Draw(offsetX, offsetY);
		}
	}
	for(var k = 0; k < this.foodArray.length; k++)
	{
		if(this.foodArray[k].getPlaced() && this.foodArray[k].pickedUp == false)
		{
			this.foodArray[k].Draw(offsetX, offsetY);
		}
	}
	
}

GameManager.prototype.DrawHUD = function()
{	//Draws HUD elements
	for(var k = 0; k < this.pickups.length; k++)
	{
		if(this.pickups[k].getPlaced() && this.pickups[k].pickedUp == true)
		{
			this.pickups[k].PickUpDraw();
		}
	}
	
	//Draw sanity bar
	canvasCtx.fillStyle = rgb(100, 0, 100);
	canvasCtx.fillRect(GAMEWIDTH - (GAMESIZE * 5), 10, (GAMESIZE * 4) * game.player.sanity/100, 20);
	
	//Draw hunger bar
	canvasCtx.fillStyle = rgb(100, 50, 50);
	canvasCtx.fillRect(GAMEWIDTH - (GAMESIZE * 5), 35, (GAMESIZE * 4) * game.player.hunger/100, 20);
	
	//Draw thirst bar
	canvasCtx.fillStyle = rgb(10, 10, 100);
	canvasCtx.fillRect(GAMEWIDTH - (GAMESIZE * 5), 60, (GAMESIZE * 4) * game.player.thirst/100, 20);
}

GameManager.prototype.CheckWin = function()
{
	totalPickedUp = 0;
	for(var k = 0; k < this.pickups.length; k++)
	{
		if(this.pickups[k].pickedUp == true)
		{
			totalPickedUp++;
		}
	}
	if(totalPickedUp == this.pickups.length)
	{
		return true;
	}
	return false;
}

GameManager.prototype.FindMapIndex = function(pos, size)
{
	//Find the index of an item on the map
	var xPos = 0;
	var yPos = 0;
	xPos = Math.floor((pos.x + size)/this.size)
	yPos = Math.floor((pos.y + size)/this.size)	
	xIndex = Math.floor(xPos/this.building[0].length);	
	yIndex = Math.floor(yPos/this.building[0].length);
	return new Vector2(xIndex, yIndex);	
}

GameManager.prototype.GetNearestWalls = function(pos)
{
	var walls = [];	
	for(var i = 0; i < this.map.length; i++)
	{
		for(var j = 0; j < this.map[i].length; j++)
		{
			var a = 0;
			var b = 0;
			var dist = 0;
			a = pos.x - this.map[i][j].centre.x;
			b = pos.y - this.map[i][j].centre.y;    
			dist = Math.sqrt((a * a) + (b * b))
			if(dist < 1500)
			{
				this.map[i][j].GetWalls(pos, walls);
			}
		}
	}		
	return walls;
}
GameManager.prototype.DetectWallCollision = function(pos, size)
{
	//For each wall in the current building square, check if the player collides with the wall.	
	mapPos = this.FindMapIndex(pos, size);
	if(!mapPos)
	{
		var a =1;
	}
	wallArray = this.map[mapPos.x][mapPos.y].walls;
	returnVec = pos;
	xLock=false;
	yLock=false;
	xLO=0;
	yLO=0;
	for(var i = 0; i < wallArray.length; i++)
	{
		wX1 = wallArray[i].position.x;
		wX2 = wallArray[i].position.x + wallArray[i].width;
		wY1 = wallArray[i].position.y;
		wY2 = wallArray[i].position.y + wallArray[i].height;
		if(wX1 < pos.x + size && wX2 > pos.x - size && wY1 < pos.y + size && wY2 > pos.y - size)
		{
			if(pos.x < wX1)
			{
				xOverlap = wX1 - (pos.x + size);
			}
			else
			{
				xOverlap = wX2 - (pos.x - size);
			}
			if(pos.y < wY1)
			{
				yOverlap = wY1 - (pos.y + size);
			}
			else
			{
				yOverlap = wY2 - (pos.y - size);
			}
			if(Math.abs(xOverlap) != Math.abs(yOverlap))
			{
				if(Math.abs(xOverlap) < Math.abs(yOverlap))
				{
					pos.x += xOverlap;
				}
				else
				{
					pos.y += yOverlap
				}
			}
		}
	}
	return pos;
}

GameManager.prototype.PickUpItems = function(pos, size, sound)
{	//Collision detection for a player and an item	
	for(var i = 0; i < this.pickups.length; i++)
	{
		if(this.pickups[i].getPlaced() == true)
		{
			if(Collides(pos, this.pickups[i].getPos(), this.size) == true)
			{
				if(this.pickups[i].pickedUp == false)
				{
					//If the two collide, set the pickup to be picked up.
					this.pickups[i].PickedUp();
					playSound(sound);
				}
			}
		}
	}
	for(var i = 0; i < this.waterArray.length; i++)
	{
		if(this.waterArray[i].getPlaced() == true)
		{
			if(Collides(pos, this.waterArray[i].getPos(), this.size) == true)
			{
				if(this.waterArray[i].pickedUp == false)
				{
					//If the two collide, set the pickup to be picked up.
					this.waterArray[i].PickedUp();
					playSound(sound);
				}
			}
		}
	}
	for(var i = 0; i < this.foodArray.length; i++)
	{
		if(this.foodArray[i].getPlaced() == true)
		{
			if(Collides(pos, this.foodArray[i].getPos(), this.size) == true)
			{
				if(this.foodArray[i].pickedUp == false)
				{
					//If the two collide, set the pickup to be picked up.
					this.foodArray[i].PickedUp();
					playSound(sound);
				}
			}
		}
	}
}

function Collides(posA, posB, size)
{
	dx = posA.x - (posB.x + size/2);
	dy = posA.y - (posB.y + size/2);
	if(Math.sqrt((dx * dx) + (dy * dy)) < (size/2))
	{
		return true;
	}
	else{return false;}
}

GameManager.prototype.GetPickUpCount = function(){
	var count = 0;
	for(var i = 0; i < this.pickups.length; i++){
		if(this.pickups[i].pickedUp == true){
			count++;
		}
	}
	return count;
}

GameManager.prototype.checkTriggers = function(pos, size){
	//Collision detection for a player and a tutorial trigger
	for(var i = 0; i < this.triggers.length; i++){
		dx = pos.x - (this.triggers[i].position.x + this.size/2);
		dy = pos.y - (this.triggers[i].position.y + this.size/2);		
		if(Math.sqrt((dx * dx) + (dy * dy)) < (this.size/2)){
			//Only call event if trigger has not already occurred.
			if(this.triggers[i].triggered == false){
				//If the two collide, call the trigger event and set the event to triggered
				this.triggers[i].triggered = true;
				TriggerEvent(this.triggers[i].id);
			}
		}
	}
}



