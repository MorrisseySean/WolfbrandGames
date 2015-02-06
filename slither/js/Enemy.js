function Enemy(x, y, radius)
{
	this.position = new Vector2(x, y);
	this.radius = radius;
	this.width = radius;
	this.height = radius;
	this.speed = radius / 2;
	this.image = IMAGE.ENEMYSPRITE;
	this.dir = 0;
	this.seen = false;
	this.attack = false;
	this.spawn = false;
	this.whisperTime = 0;
	this.sightTime = 0;
	this.path = [];
	this.pathIndex = 0;
	this.sinceCalculated = 0;
}

Enemy.prototype.getPos = function()
{
	return this.position;
}

Enemy.prototype.onSight = function(inSight)
{
	if(inSight == false && this.seen == true)
	{	
		if(this.sightTime > 200)
		{
			this.seen = inSight;
			this.sightTime = 0;
		}
	}
	else
	{
		this.seen = inSight;
	}	
}
function getDist(pointA, pointB)
{
	var a = pointA.x - pointB.x;
	var b = pointA.y - pointB.y;    
	return Math.sqrt((a * a) + (b * b));
}
		
Enemy.prototype.Spawn = function()
{
	this.position.x = Math.floor(Math.random() * maps.mapWidth);
	this.position.y = Math.floor(Math.random() * maps.mapHeight);
	if(getDist(this.position, game.player.position) > GAMESIZE * 20)
	{
		this.spawn = true; 
		this.image.opac -= 1;
	}
}

Enemy.prototype.Update = function(playerPos, playerDir, sanity, pickUpCount, whisperSound, elapsed)
{
	if(game.flashlight.darkValue >= 0.6)
	{
		//If the monster isn't spawned and the player has picked up at least one item, spawn the monster.
		if(this.spawn == false)
		{
		   this.Spawn();
		}
		else
		{ 
			   this.sinceCalculated+=elapsed;
			   //Every 5 seconds calculate a new path to the player
			   if(this.sinceCalculated>5)
			   {
					this.path = findPath(maps.pathNodes,game.enemy.position,game.player.position);
					this.sinceCalculated=0;
			   }
			   posXCheck= Math.floor(this.position.y/(GAMESIZE*2));
			   posYCheck= Math.floor(this.position.y/(GAMESIZE*2));
			   
			   //Store distance to player variables			   
			   pX = game.player.position.x - this.position.x;
			   pY = game.player.position.y - this.position.y;			   
			   distP = Math.sqrt((pX * pX) + (pY * pY));
			   
			   //If a path cant be found, move towards player
			   dX = game.player.position.x - this.position.x;
			   dY = game.player.position.y - this.position.y;	
			   
			   //If the distance to the player is less than the four times the gamesize move directly towareds the player.
			   if(distP < (GAMESIZE*2))
			   {
					dx = game.player.position.x - this.position.x;
					dy = game.player.position.y - this.position.y;
			   }
			   
			   //Otherwise, follow the pathfinding path towards the player
			   if(this.path.length>=1)
			   {
					//If there's a path to follow, find direction to the first node
					dx = ((this.path[0][0]*(GAMESIZE*2))) - this.position.x;
					dy = ((this.path[0][1]*(GAMESIZE*2))) - this.position.y;
			   }			   
			   dist = Math.sqrt((dx * dx) + (dy * dy));			   
			   //If the distance to the next node is less than the gamesize, remove the first path node.
			   if(dist < (GAMESIZE))
			   {
					if(this.path.length>1)
						{
							this.path.splice(0,1);
						}
				}
				//If the distance to the player is greater then a building length, randomly switch the position of the monster to in the players path
			   if(distP > GAMESIZE * 20)
			   {
					if(Math.floor(Math.random() * 1600) == 1)
					{
						 velocity = new Vector2((distP * Math.cos(playerDir)), (distP * Math.sin(playerDir)));
						 this.position = new Vector2(playerPos.x + velocity.x, playerPos.y + velocity.y);
					}
			   }
			   //If the monster is closer then half a building distance, randomly start the whisper sounds
			   else if(distP < GAMESIZE * 10||whisperSound.playing == true)
			   {
					if(whisperSound.playing == false)
					{
						 if(Math.floor(Math.random()*25) <= 1)
						 {
							  playPanner(whisperSound);
							  this.whisperTime = 0;
						 }				 
					}
					else
					{
						 this.whisperTime++;
						 if(this.whisperTime > 2500)
						 {
							  whisperSound.playing = false;
							  console.log("false");
						 }
					}
		   }
		   //If the monster is on top of the player, start attacking
		   if(getDist(playerPos, this.position) < this.radius)		   
				this.attack = true;		   
		   else
				this.attack = false;
		   
		   //If not in vision of the player, follow the pathing towards the player.
		   if(this.seen == false)
		   {
				this.dir = Math.atan2(dy, dx);
				velocity = new Vector2(((this.speed * (2 + (0.5 * pickUpCount))) * game.timeElapsed) * Math.cos(this.dir), ((this.speed * (2 + (0.5 * pickUpCount))) * game.timeElapsed) * Math.sin(this.dir));
				this.position.x += velocity.x;
				this.position.y += velocity.y;   
		   } 
		   //If in vision, move towards the enemy slowly.
		   else
		   {
				this.dir = Math.atan2(dy, dx);
				velocity = new Vector2((this.speed/6 * game.timeElapsed)  *Math.cos(this.dir), (this.speed/6 * game.timeElapsed)  * Math.sin(this.dir));
				this.position.x += velocity.x;
				this.position.y += velocity.y;  
				this.sightTime++;
		   }   
		}		
	}
	else
	{
		this.spawn = false;
		this.image.opac -= 0.01;
		if(this.image.opac <= 0)
		{
			this.position.x = 100000;
			this.position.y = 100000;
		}
	}
}

Enemy.prototype.move = function(x, y)
{
	this.position.x += x;
	this.position.y += y;
}

Enemy.prototype.Draw = function()
{
	this.image.rotateDraw(this.position, this.dir);
	this.image.draw(this.position);
}

Enemy.prototype.Pathfinding = function()
{
	
}