function Tutorial(){
	//Tutorial class stores and displays information regarding the players progression through the tutorial.
	this.displaying = false;
	this.controlsText = true;
	this.monsterText = false;
	this.pickUpText = false;
	this.complete = false;
}

Tutorial.prototype.Update = function(keys){
	//If the trigger has been hit, display the section of the tutorial until the user presses enter.
	if(this.controlsText == true){
		if(keys["enter"] == true || keys["space"] == true){
		this.controlsText = false;
		this.displaying = false;
		}
	}
	else if(this.monsterText == true){
		if(keys["enter"] == true || keys["space"] == true){
		this.monsterText = false;
		this.displaying = false;
		}
	}
	else if(this.pickUpText == true){	
		if(keys["enter"] == true || keys["space"] == true){
		this.pickUpText = false;
		this.displaying = false;
		}
	}
}

Tutorial.prototype.Draw = function()
{
	if(this.controlsText == true)
	{
		IMAGE.MOVETUTORIAL.fadeIn(new Vector2(0, 0));
	}
	else if(this.monsterText == true){
		IMAGE.MONSTERTUTORIAL.fadeIn(new Vector2(0, 0));
	}
	else if(this.pickUpText == true){
		IMAGE.PICKUPTUTORIAL.fadeIn(new Vector2(0, 0));
	}
}