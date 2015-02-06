function PickUp(x, y, value, radius)
{
	this.position = new Vector2(x, y);
	this.placed = false;
	this.pickedUp = false;
	this.infoTimer = 0;
	this.info = "";
	this.size = radius;	
	
	if(value == "food")
	{
		this.image = IMAGE.FOODSPRITE;
		this.value = 0;
	}
	else if(value == "water")
	{
		this.image = IMAGE.WATERSPRITE;
		this.value = 1;
	}
	else if(value == "pills")
	{
		this.image = IMAGE.PILLSPRITE;
		this.info = "I can use these to regenerate my sanity, better use them sparingly";
		this.value = 2;
	}
	else if(value == "glowtube")
	{
		this.image = IMAGE.GLOWSTICKTUBE;
		this.info = "Maybe I can use these to remember where I've been, they don't seem to last long";
		this.value = 3;
	}
	else if(value == "lighter")
	{
		this.image = IMAGE.LIGHTERSPRITE;
		this.info = "I can use this to see around me better";
		this.value = 4;
	}
	else if(value == "battery")
	{
		this.image = IMAGE.BATTERYSPRITE;
		this.info = "I could probably make my flashlight a little stronger with this";
		this.value = 5;
	}
	else if(value == "runners")
	{
		this.image = IMAGE.RUNNERSPRITE;
		this.info = "Air Max! Maybe now I can run a little faster";
		this.value = 6;
	}
	else if(value == "flashlight")
	{
		this.image = IMAGE.FLASHLIGHTSPRITE;
		this.info = "This will help me see in the dark, that thing is scared of light too"
		this.value = 7;
	}
}

//Get Methods//
PickUp.prototype.getPos = function()
{
	return this.position;
}
PickUp.prototype.getPlaced = function()
{
	return this.placed;
}
///////////////

//Set Methods//
PickUp.prototype.setPos = function(x, y)
{
	this.position = new Vector2(x, y);
}
//////////////

PickUp.prototype.Place = function(x, y)
{
	//Method for placing the pickup on the map
	if(this.placed == false) //Don't move the object once placed
	{
		//Place the object at desired position and set it to placed.
		this.position = new Vector2(x, y);
		this.placed = true;	
	}
}

PickUp.prototype.PickedUp = function()
{
	this.pickedUp = true;
	game.player.PickUpItem(this.value);	
	this.infoTimer = 100;
}

PickUp.prototype.Draw = function()
{
	if(this.pickedUp != true)
	{
		this.image.draw(new Vector2((this.position.x + this.size/2), (this.position.y + this.size/2)));
	}
	
}

PickUp.prototype.infoDraw = function()
{
	if(this.infoTimer > 0)
	{
		canvasCtx.fillStyle = 'rgba(255,255,255,' + this.infoTimer/100 + ')';
		canvasCtx.font = "16px Georgia";
		canvasCtx.fillText(this.info, canvas.width/2 - 100 , canvas.height/2 - 100);
		this.infoTimer-= 0.5;
	}
}