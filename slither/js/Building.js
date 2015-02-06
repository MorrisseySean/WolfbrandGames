function Building(x, y, size, building)
{
	this.position = new Vector2(x, y);
	this.centre = new Vector2(0, 0);
	this.size = size;
	this.building = building;
	this.lightswitch = false;
	this.walls = [];
	this.resource = 0;
	this.hasWater = false;
	this.hasFood = false;
}

Building.prototype.GeneratePickUps = function()
{
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] == 2)
			{
				var rand = Math.floor(Math.random() * 2);
				if(rand == 0 && this.hasWater == false)
				{		
					if(PickUpRoll(40) == true)
					{
						maps.waterArray[maps.waterArray.length] = new PickUp(0, 0, "water", this.size/2);
						maps.waterArray[maps.waterArray.length - 1].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);
						maps.waterCount++;
						this.hasWater = true;
						console.log("Water");
					}					
				}
				else if(rand == 1 && this.hasFood == false)
				{
					if(PickUpRoll(60) == true)
					{
						maps.foodArray[maps.foodArray.length] = new PickUp(0, 0, "food", this.size/2);
						maps.foodArray[maps.foodArray.length - 1].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);
						maps.foodCount++;
						this.hasFood = true;
						console.log("Food");
					}
				}
			}			
			else if(this.building[i][j] > 4 && this.building[i][j] < 20)
			{
				if(PickUpRoll(50) == true)
				{
					maps.pickups[this.building[i][j] - 5].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);
				}
			}
			
		}
	}
}

Building.prototype.PlaceFlashlight = function()
{
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] == 10)
			{
				maps.pickups[this.building[i][j] - 5].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);
			}
		}
	}
}
Building.prototype.ResetPickups = function()
{
	this.hasWater = false;
	this.hasFood = false;
	this.resource = 0;
}
Building.prototype.GenerateBuilding = function(triggers)
{
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] == 1)
			{
				this.walls[this.walls.length] = new Wall(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);
			}
			if(this.building[i][j] > 100)
			{
				triggers[triggers.length] = new TriggerBox(new Vector2(this.position.x + (j * this.size), this.position.y + (i * this.size)), this.size, this.size, this.building[i][j]);
			}
		}
	}
	this.centre.x = this.position.x + ((this.building[0].length/2) * this.size);
	this.centre.y = this.position.y + ((this.building.length/2) * this.size);	
}

Building.prototype.GetWalls = function(pos, walls)
//Gets the walls for the flashlight
{
	for(var i = 0; i < this.walls.length; i++)
	{
		var a = 0;
		var b = 0;
		var dist = 0;
		a = pos.x - this.walls[i].centre.x;
		b = pos.y - this.walls[i].centre.y;    
		dist = Math.sqrt((a * a) + (b * b));
		if(dist < 500)
		{
			walls[walls.length] = this.walls[i];
		}
	}	
	return walls;
}
Building.prototype.Draw = function()
{
	//Draw the ground sprites
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] < 1)
			{
				IMAGE.GROUNDSPRITE.draw(new Vector2((this.position.x + (j * this.size)), (this.position.y + (i * this.size))));	
			}	
			else 
			{
				IMAGE.FLOORSPRITE.draw(new Vector2((this.position.x + (j * this.size)), (this.position.y + (i * this.size))));				
			}
		}
	}
	//Draw walls
	for(var i = 0; i < this.walls.length; i++)
	{		
		this.walls[i].draw();		
	}	
}

Building.prototype.DrawLights = function(offsetX, offsetY)
{
	//If the light is on in a building, draw the floor tiles
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] > 1)
			{
				IMAGE.FLOORSPRITE.draw(new Vector2((this.position.x + (j * this.size)), (this.position.y + (i * this.size))));	
			}
		}
	}
}

function Wall(x, y, width, height)
{
	this.position = new Vector2(x, y);
	this.width = width;
	this.height = height;
	this.centre = new Vector2(x + width/2, y + height/2);
	this.image = IMAGE.WALLSPRITE;
	this.visible = true;
}

Wall.prototype.setVisible = function(visible)
{
	this.visible = visible;
}

Wall.prototype.draw = function(offsetX, offsetY)
{	
	this.image.draw(new Vector2(this.position.x, this.position.y));	
}

function PickUpRoll(ran)
{
	if(Math.floor(Math.random() * ran) == 1)//One in "ran" chance of the object being placed in this position
	{
		return true;
	}
	return false;
}