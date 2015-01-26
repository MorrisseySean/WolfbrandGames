//A trigger system which will allow events to occur as the player passes through designated trigger boxes. 
function TriggerBox(pos, width, height, id){
	//Hit box for trigger event
	this.position = pos;
	this.width = width;
	this.height = height;
	
	//An id is used to check which trigger event needs to occur.
	this.id = id;
	
	//Stops repeat triggers occurring
	this.triggered = false;
}

function TriggerEvent(eventId)
{	//Takes an event id and responds with the correct event when a trigger box is passed through
	if(eventId == 123)
	{	//Upon leaving the starting area, turn off the tutorial and start night time.
		game.tutorial.complete = true;
	}
	else if(eventId == 124)
	{	//Display controls text
		game.tutorial.controlsText = true;
		game.tutorial.displaying = true;
	}
	else if(eventId == 125)
	{	//Display monster tooltip
		game.tutorial.monsterText = true;
		game.tutorial.displaying = true;
	}
	else if(eventId == 126)
	{	//Display pickup hint
		game.tutorial.pickUpText = true;
		game.tutorial.displaying = true;
	}
	
}


