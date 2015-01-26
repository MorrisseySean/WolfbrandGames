function Building(x, y, size, building)
{
	this.position = new Vector2(x, y);
	this.centre = new Vector2(0, 0);
	this.size = size;
	this.building = building;
	this.lightswitch = false;
	this.walls = [];
}

Building.prototype.GeneratePickUps = function()
{
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] == 2)
			{
				var placed = false;
				for(var k = 0; k < maps.waterArray.length; k++)
				{
					if(placed == false)
					{
						if(Math.floor(Math.random() * 2) == 1)
						{
							if(maps.waterArray[k].placed == false)
							{
								maps.waterArray[k].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);			
								placed = true;
							}
						}
						else
						{
							if(maps.foodArray[k].placed == false)
							{
								maps.foodArray[k].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);			
								placed = true;
							}
						}
					}
				}
			}			
			else if(this.building[i][j] > 4 && this.building[i][j] < 20)
			{
				maps.pickups[this.building[i][j] - 5].Place(this.position.x + (j * this.size), this.position.y + (i * this.size), this.size, this.size);
			}
			
		}
	}
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
Building.prototype.Draw = function(offsetX, offsetY)
{
	//Draw the ground sprites
	for(var i = 0; i < this.building.length; i++)
	{
		for(var j = 0; j < this.building[0].length; j++)
		{
			if(this.building[i][j] < 1)
			{
				IMAGE.GROUNDSPRITE.draw(new Vector2((this.position.x + (j * this.size)) - offsetX, (this.position.y + (i * this.size)) - offsetY));	
			}	
			else 
			{
				IMAGE.FLOORSPRITE.draw(new Vector2((this.position.x + (j * this.size)) - offsetX, (this.position.y + (i * this.size)) - offsetY));				
			}
		}
	}
	//Draw walls
	for(var i = 0; i < this.walls.length; i++)
	{		
		this.walls[i].draw(offsetX, offsetY);		
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
				IMAGE.FLOORSPRITE.draw(new Vector2((this.position.x + (j * this.size)) - offsetX, (this.position.y + (i * this.size)) - offsetY));	
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
	this.image.draw(new Vector2(this.position.x - offsetX, this.position.y - offsetY));	
}

function Door(x, y, width, height, dir)
{
	this.position = new Vector2(x, y);
	this.width = width;
	this.height = height;
	this.visible = true;
}