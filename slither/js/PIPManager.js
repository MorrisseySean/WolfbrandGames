//PIP Manager connects to the local C# program and then exchanges and deals with the information received.
function PIPManager()
{
	this.PIPConnected = false;
	this.received_msg = "";
	this.displayText = "Please load the PIP Manager client and press Discover.";
	this.lastFlashLevel = 1;
	this.inactive = false;
}

function connect() 
{
	var ws = new WebSocket("ws://localhost:8000");
	ws.onopen = function () 
	{
		//Sends Ping to the program.
		ws.send("Ping");	
	};

	ws.onmessage = function (evt) 
		//On receiving a message
	{
		//alert("Incoming message");
		PIPManager.received_msg = evt.data;
		var connMsg = decode(evt.data);
		game.PIP.Process(connMsg);		
	};
	
	ws.onclose = function () 
	{
		// websocket is closed.
		alert("Connection to program failed");
	};
};

PIPManager.prototype.Process = function(connMsg)
	//Processes messages sent by the PIP client
{
	//Goes through connection instructions
	if(connMsg == "Discovered")
	{
		this.displayText = "PIP Discovered. Please press Connect to connect to your PIP device";
	}
	else if(connMsg == "Connected")
	{
		this.displayText = "PIP connected and ready to stream. \nPlease press Stream to start playing.";		
	}	
	else if(connMsg == "Streaming")
	{
		this.displayText = "PIP connected and streaming, press Enter to begin playing. Good Luck.";
		this.PIPConnected = true;
	}	
	else if(connMsg == "Stressing")
		//When the PIP acknowledges the player is stressed, reduce the flashlight level by 0.1 to a minimum of 0.1
	{
		if(game.flashlight.pipLevel > 0.2)
			game.flashlight.pipLevel -= 0.05;
	}
	
	else if(connMsg == "Relaxing")
		//When the PIP sends a message that the player is relaxed, increase the flashlight level by 0.1 to a maximum of 1
	{
		if(game.flashlight.pipLevel < 1)
			game.flashlight.pipLevel += 0.05; 
	}
	else if(connMsg == "Inactive")
		//If the player leaves go of the PIP, turn off the flashlight and store the previous value
	{
		if(this.inactive == false)
		{
			this.lastFlashLevel = game.flashlight.pipLevel;
			game.flashlight.pipLevel = 0;
			this.inactive = true;
			if(game.gameState == game.states.Playing)
				game.gameState = game.states.Paused;
		}		
	}
	else if(connMsg == "Active")
		//If the player has picked up the PIP again, turn back on the flashlight at the previous value
	{
		if(this.inactive == true)
		{
			game.flashlight.pipLevel = this.lastFlashLevel;
			this.inactive = false;
		}		
	}
		
}

PIPManager.prototype.Draw = function()
{
	canvasCtx.fillStyle = "purple";
	canvasCtx.font = "20px Georgia";
	canvasCtx.fillText(this.displayText, GAMEWIDTH/4, GAMEHEIGHT/2);
	
}
function decode(data)
{
	var msg="";
	for(var i = 0;i < data.length;i++)
	{
		if(data[i]>=' '&&data[i]<='z')
		{
			msg+=data[i];
		}
	}
	return msg;
	
}