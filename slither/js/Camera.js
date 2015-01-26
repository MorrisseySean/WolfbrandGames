function Camera(maxX, maxY, screenWidth, screenHeight)
{
	this.x = 0;
	this.y = 0;	
}

Camera.prototype.init = function(maxX, maxY, screenWidth, screenHeight)
{
	//Initialise parameters
	this.screenWidth = screenWidth;
	this.screenHeight = screenHeight;
	this.maxX = maxX;
	this.maxY = maxY;
}

Camera.prototype.update = function(x, y)
{
	//Update function controls the position of the camera, keeping it tied to the player but locking it at the edges of the map
	//Lock X value if at edge of map.
	if(x + this.screenWidth/2 >= this.maxX)
	{
		this.x = this.maxX - this.screenWidth;
	}
	else if(x - this.screenWidth/2 <= 0)
	{
		this.x = 0;
	}
	else
	{
		this.x = x - this.screenWidth/2;
	}
	//Lock Y value if at edge of map.
	if(y + this.screenHeight/2 >= this.maxY)
	{
		this.y = this.maxY - this.screenHeight;
	}
	else if(y - this.screenHeight/2 <= 0)
	{
		this.y = 0;
	}
	else
	{
		this.y = y - this.screenHeight/2;
	}
	
}

//Get methods for the camera.
Camera.prototype.getX = function()
{
	return this.x;
}

Camera.prototype.getY = function()
{
	return this.y;
}