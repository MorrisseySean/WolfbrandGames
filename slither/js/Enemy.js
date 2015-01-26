function Enemy(x, y, radius)
{
	this.position = new Vector2(x, y);
	this.radius = radius;
	this.width = radius;
	this.height = radius;
	this.speed = radius/80;
	this.image = IMAGE.ENEMYSPRITE;
	this.dir = 0;
	this.seen = false;
	this.attack = false;
	this.spawn = false;
	this.whisperTime = 0;
	this.sightTime = 0;
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

Enemy.prototype.Update = function(playerPos, playerDir, sanity, pickUpCount, whisperSound, mapSize)
{
	if(game.flashlight.darkValue > 0.8)
	{
		if(this.spawn == false)
		{
			this.position.x = Math.floor(Math.random() * mapSize.x);
			this.position.y = Math.floor(Math.random() * mapSize.y);
			console.log(this.position);
			this.spawn = true;
		}
		else
		{		
			dx = playerPos.x - this.position.x;
			dy = playerPos.y - this.position.y;
			dist = Math.sqrt((dx * dx) + (dy * dy))
			if(dist > 1500)
			{
				if(Math.floor(Math.random() * 1600) == 1)
				{
					velocity = new Vector2((dist * Math.cos(playerDir)), (dist * Math.sin(playerDir)));
					this.position = new Vector2(playerPos.x + velocity.x, playerPos.y + velocity.y);
				}
			}
			else
			{
				if(whisperSound.playing == false)
				{
					if(Math.floor(Math.random()*2500) <= 1)
					{
						console.log("whisper");
						playPanner(whisperSound);
						this.whisperTime = 0;
					}
					
				}
				else
				{
					this.whisperTime++;
					console.log("whisper time");
					if(this.whisperTime > 2500)
					{
						whisperSound.playing = false;
						console.log("false");
					}
				}
			}
			if(getDist(playerPos, this.position) < this.radius/2)
			{
				this.attack = true;
			}
			else
			{
				this.attack = false;
			}
			if(this.seen == false)
			{
				this.dir = Math.atan2(dy, dx);
				velocity = new Vector2(this.speed * (1 + (0.5 * pickUpCount)) * Math.cos(this.dir), this.speed * (1 + (0.5 * pickUpCount)) * Math.sin(this.dir));
				this.position.x += velocity.x;
				this.position.y += velocity.y;			
			}	
			else
			{
				this.dir = Math.atan2(dy, dx);
				velocity = new Vector2(this.speed/6 * Math.cos(this.dir), this.speed/6 * Math.sin(this.dir));
				this.position.x += velocity.x;
				this.position.y += velocity.y;		
				this.sightTime++;
			}			
		
		}
	}
	else
	{
		if(this.position.x > -GAMESIZE*5 || this.position.x > -GAMESIZE*5)
		{
			this.position.x -= velocity.x;
			this.position.y -= velocity.y;
		}
		this.spawn == false;
	}
}

Enemy.prototype.move = function(x, y)
{
	this.position.x += x;
	this.position.y += y;
}

Enemy.prototype.Draw = function(offsetX, offsetY)
{
	this.image.rotateDraw(new Vector2(((this.position.x - this.radius) - offsetX), ((this.position.y - this.radius) - offsetY)), this.radius, this.radius, this.dir);
}