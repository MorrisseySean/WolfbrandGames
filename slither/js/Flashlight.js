function Flashlight(position, radius, angle, spread, color)
{
	this.position = position;
	this.position.x = position.x + GAMESIZE/2;
	this.position.y = position.y + GAMESIZE/2;
	this.radius = radius;
	this.maxFlash = radius;
	this.angle = angle;
	this.color = color;
	this.darkValue = 0;
	this.night = true;
	this.spread = spread; 
	this.enemySeen = false;
	this.min = 0;
	this.waver = 0.2;
	this.temp = position;
}
Flashlight.prototype.lineIntersect= function(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) 
//Checks to see if two lines intersect, returns distance to the point of intersection
{
 
	var s1_x, s1_y, s2_x, s2_y;
	s1_x = p1_x - p0_x;
	s1_y = p1_y - p0_y;
	s2_x = p3_x - p2_x;
	s2_y = p3_y - p2_y;
	 
	var s, t;
	s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
	t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
	 
	if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
	{
		// Collision detected				
		var colPoint = this.pointOfIntersect(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y);
		return this.getDist(colPoint, this.position);
	} 
	return 0; // No collision
} 

Flashlight.prototype.pointOfIntersect = function(x1, y1, x2, y2, x3, y3, x4, y4)
//Find the point of intersection of two line segments after they collide.
{
	x =((((x1*y2)-(y1*x2))*(x3-x4))-((x1-x2)*((x3*y4)-(y3*x4))))/(((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4)));
	y =((((x1*y2)-(y1*x2))*(y3-y4))-((y1-y2)*((x3*y4)-(y3*x4))))/(((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4)))
	return new Vector2(x, y);
}

Flashlight.prototype.getDist = function(pointA, pointB)
//Get the distance between two points
{
	var a = pointA.x - pointB.x;
    var b = pointA.y - pointB.y;    
    return Math.sqrt((a * a) + (b * b));
}

//Use to find the distance between the blocks and the light.
Flashlight.prototype.findDistance = function(wall, angle, rLen, shortest)
{
	//Check the distance to the wall.
	var x = (wall.position.x + wall.width/2) - this.position.x;
    var y = (wall.position.y + wall.height/2) - this.position.y;    
    var dist = Math.sqrt((y * y) + (x * x));
	
	//If its within the radius of the flashlight check if it's the closest
    if(this.radius * 2 >= dist)
    {
        var rads = angle * (Math.PI / 180);
        var pointPos = new Vector2(this.position.x, this.position.y);
        
        pointPos.x += Math.cos(rads) * dist;
        pointPos.y += Math.sin(rads) * dist;
		
		var check = false;
		//Find the point of intersection and place into temp.
		var temp = this.lineIntersect(this.position.x, this.position.y, pointPos.x, pointPos.y, wall.position.x, wall.position.y, wall.position.x + wall.width, wall.position.y);
		if(temp != 0) //If a line intersection was found
		{
			if(temp <= this.radius) //If the intersection distance is less then the flashlight distance
			{
				check = temp; //Add the intersection distance to the return value
			}			
			temp = 0;			
		}	
		//Find the distance to point of intersection for the next wall side.
		temp = this.lineIntersect(this.position.x, this.position.y, pointPos.x, pointPos.y, wall.position.x, wall.position.y, wall.position.x, wall.position.y + wall.width);
		if(temp != 0) //If a line intersection was found.
		{
			if(temp < check||check == false) //If the distance is less then the current distance or a distance hasn't been found
			{
				if(temp <= this.radius) //If the intersection distance is less then the flashlight distance
				{
					check = temp; //Add the intersection distance to the return value
				}	
				temp = 0;	
			}
		}
		//Find the distance to point of intersection for the next wall side.
		temp = this.lineIntersect(this.position.x, this.position.y, pointPos.x, pointPos.y, wall.position.x + wall.width, wall.position.y, wall.position.x + wall.width, wall.position.y + wall.width);
		if(temp != 0)
		{
			if(temp < check||check == false) //If the distance is less then the current distance or a distance hasn't been found
			{
				if(temp <= this.radius) //If the intersection distance is less then the flashlight distance
				{
					check = temp; //Add the intersection distance to the return value
				}
				temp = 0;	
			}
		}
		//Find the distance to point of intersection for the next wall side.
		temp = this.lineIntersect(this.position.x, this.position.y, pointPos.x, pointPos.y, wall.position.x, wall.position.y + wall.width, wall.position.x + wall.width, wall.position.y + wall.width);
		if(temp!=0)
		{
			if(temp < check||check == false) //If the distance is less then the current distance or a distance hasn't been found
			{
				if(temp <= this.radius) //If the intersection distance is less then the flashlight distance
				{
					check = temp;  //Add the intersection distance to the return value
				}
				temp = 0;	
			}
		}			
		
		if(check != false) //If a distance has been found
        {
            if(check < shortest) //If distance is lower then the shortest distance already found
			{
				//return shortest distance
                shortest = check;
                rLen = check;
            }            
            return {'shortest' : shortest, 'rLen' : rLen};
        }
    }
	//If no distance is found, return distances already known.
    return {'shortest' : shortest, 'rLen' : rLen};
}
Flashlight.prototype.timeLapse = function()
{
	if(this.night == true)
	{
		if(this.darkValue < 1.5)
		{		
			this.darkValue+= 1/150;
		}	
	}
	else if(night == false)
	{
		if(this.darkValue > -0.5)
		{		
			this.darkValue-= 1/150;
		}
	}
}
//Shine the flashlight in the specified direction
Flashlight.prototype.shineFlashlight = function(walls, enemy, offsetX, offsetY)
{
	
	if(this.darkValue < 0.8)
	{		
		canvasCtx.fillStyle = 'rgba(0,0,0,' + this.darkValue + ')';
		canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
	}	
	else
	{	
		radGrad = canvasCtx.createRadialGradient(game.player.position.x - offsetX, game.player.position.y - offsetY, 10, game.player.position.x - offsetX, game.player.position.y - offsetY, this.radius * game.player.areaRange);
		radGrad.addColorStop(0,'rgba(0,0,0,0)');
		radGrad.addColorStop(1,'rgba(0,0,0,' + this.darkValue + ')');
		
		canvasCtx.fillStyle = radGrad;
		//canvasCtx.fillStyle = 'rgba(0,0,0,' + this.darkValue + ')';
		var currentAngle = this.angle - this.spread;

		//Gradient variables
		this.flashMax = [];
		this.flashMin = [];
		
		
		//Start path of flashlight
		canvasCtx.beginPath();			
		canvasCtx.moveTo(this.position.x - offsetX, this.position.y - offsetY);

		this.enemySeen = false;

		//For each angle check if it'd colliding with an object
		for(currentAngle; currentAngle < this.angle + this.spread; currentAngle += 0.5)
		{	       
			var findDistRes = {};
			findDistRes.shortest = this.radius;
			findDistRes.rLen = this.radius;
						
			for(var j = 0; j < walls.length; j++)
			{
				findDistRes = this.findDistance(walls[j], currentAngle, findDistRes.rLen, findDistRes.shortest);
			}		
			
			var rads = currentAngle * (Math.PI / 180); //Find the radian value of the current angle
			var end = new Vector2(this.position.x, this.position.y);			
			end.x += Math.cos(rads) * (findDistRes.rLen);
			end.y += Math.sin(rads) * (findDistRes.rLen);
			canvasCtx.lineTo(end.x - offsetX, end.y - offsetY); //Assign an endpoint at the found distance and connect it to the flashlight drawing.			
			this.flashMax[this.flashMax.length] = end; //Input value into a vector.		

			//Test to see if enemy is in sight
			var wallShort = findDistRes.shortest;
			findDistRes = this.findDistance(enemy, currentAngle, findDistRes.Len, findDistRes.shortest);
			if(findDistRes.shortest < wallShort - GAMESIZE/2)
			{
				enemy.onSight(true);
				this.enemySeen = true;
			}
			if(this.enemySeen != true)
			{
				enemy.onSight(false);
			}
		}

		canvasCtx.lineTo(this.position.x - offsetX, this.position.y - offsetY);	//return to start position
		//Get variables for the edges of the screen and connect a line to each point to cover the non flashlight area in black.
		var half = ((this.angle+180)* (Math.PI / 180)); 
		var whole = ((this.angle)* (Math.PI / 180));
		var fn = ((this.angle+90)* (Math.PI / 180));
		var bn = ((this.angle-90)* (Math.PI / 180));
		canvasCtx.lineTo(this.position.x - offsetX+(Math.cos(half) * 10000), this.position.y - offsetY+(Math.sin(half) * 10000));	
		canvasCtx.lineTo(this.position.x - offsetX+(Math.cos(half) * 10000)+(Math.cos(fn) * 10000),
						 this.position.y - offsetY+(Math.sin(half) * 10000)+(Math.sin(fn) * 10000));
		canvasCtx.lineTo(this.position.x - offsetX+(Math.cos(whole) * 10000)+(Math.cos(fn) * 10000),
						 this.position.y - offsetY+(Math.sin(whole) * 10000)+(Math.sin(fn) * 10000));
		canvasCtx.lineTo(this.position.x - offsetX+(Math.cos(whole) * 10000)+(Math.cos(bn) * 10000),
						 this.position.y - offsetY+(Math.sin(whole) * 10000)+(Math.sin(bn) * 10000));
		canvasCtx.lineTo(this.position.x - offsetX+(Math.cos(half) * 10000)+(Math.cos(bn) * 10000),
						 this.position.y - offsetY+(Math.sin(half) * 10000)+(Math.sin(bn) * 10000));	
		canvasCtx.lineTo(this.position.x - offsetX+(Math.cos(half) * 10000), this.position.y - offsetY+(Math.sin(half) * 10000));
		canvasCtx.closePath();
		canvasCtx.fill();

		//Test if the enemy is inside the flashlight
		currentAngle = this.angle - this.spread;
		//Draw gradient fade for edges of flashlight
		var farGrad = new Vector2(this.position.x, this.position.y);	
		var rads = this.angle * (Math.PI/180);
		farGrad.x += Math.cos(rads) * this.radius;
		farGrad.y += Math.sin(rads) * this.radius;
		var nearGrad = new Vector2(this.position.x, this.position.y);
		if(this.radius > 0.1)
		{
			radGrad = canvasCtx.createRadialGradient(this.position.x - offsetX, this.position.y - offsetY, 10, this.position.x - offsetX, this.position.y - offsetY, this.radius * 0.9);
			radGrad.addColorStop(0,'rgba(0,0,0,0)');
			radGrad.addColorStop(1,'rgba(0,0,0,' + this.darkValue + ')');
			canvasCtx.fillStyle = radGrad;

			//Draw triangle of flashlight to fill with gradient
			canvasCtx.beginPath();	
			canvasCtx.moveTo(this.flashMax[0].x - offsetX, this.flashMax[0].y - offsetY);
			for(var i = 1; i < this.flashMax.length; i++)
			{
				canvasCtx.lineTo(this.flashMax[i].x - offsetX, this.flashMax[i].y - offsetY);
			}	
			canvasCtx.lineTo(this.position.x - offsetX, this.position.y - offsetY);	
			canvasCtx.closePath();
			canvasCtx.fill();
		}
	}
}

Flashlight.prototype.Update = function(playerPos, playerDir, sanity, sprint)
{	
	
	var rads = (this.angle+90) * (Math.PI/180);
	var rads2 = (this.angle) * (Math.PI/180);
	var rads3 = (this.angle + 180) * (Math.PI/180);
	this.position.x = playerPos.x - (Math.cos(rads) * (GAMESIZE/3))+ (Math.cos(rads2) * GAMESIZE/4);
	this.position.y = playerPos.y - (Math.sin(rads) * (GAMESIZE/3))+ (Math.sin(rads2) * GAMESIZE/4);
	
	this.temp = playerPos;
	
	this.angle = playerDir * 180/Math.PI;
	if(this.angle < 0)
	{
		this.angle += 360;
	}
	this.angle = this.angle % 360;
	//Change flashlight range based off of player sanity
	if(sprint == true && game.player.sprintPower == true)
	{
		this.radius = ((this.maxFlash/3) * sanity/100) + this.min;
		this.spread = 50;
	}
	else
	{
		this.radius = (this.maxFlash * sanity/100) + this.min;
		this.spread = 30;
	}
}

