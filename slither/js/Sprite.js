//A sprite class that allows the loading, drawing and rotating of sprites.

function Sprite(gameWidth, gameHeight, str, spriteWidth, spriteHeight)
{
	this.img = new Image();
	this.gameWidth = gameWidth;
	this.gameHeight = gameHeight;
	this.spriteWidth = spriteWidth;
	this.spriteHeight = spriteHeight;
	this.img.src = str;
	this.opac = 0;
}

Sprite.prototype.draw = function(position)
{
	canvasCtx.drawImage(this.img, Math.floor(position.x) - game.cam.x, Math.floor(position.y) - game.cam.y, this.gameWidth, this.gameHeight);
}
Sprite.prototype.huddraw = function(position)
{
	canvasCtx.drawImage(this.img, Math.floor(position.x), Math.floor(position.y), this.gameWidth, this.gameHeight);
}
Sprite.prototype.fadeIn = function(position)
{
	canvasCtx.globalAlpha = this.opac;
	canvasCtx.drawImage(this.img, position.x, position.y, this.gameWidth, this.gameHeight);
	if(this.opac < 1){
		this.opac+=0.01;
	}
	canvasCtx.globalAlpha = 1;
}

Sprite.prototype.fadeOut = function(position)
{
	canvasCtx.globalAlpha = this.opac;
	canvasCtx.drawImage(this.img, position.x, position.y, this.gameWidth, this.gameHeight);
	this.opac-=0.01;
	canvasCtx.globalAlpha = 1;
}

Sprite.prototype.rotateDraw = function(position, size, rotation)
{
	//Draw the sprite rotated about its center
	canvasCtx.globalAlpha = this.opac;
	canvasCtx.save();
	canvasCtx.translate(position.x - game.cam.x, position.y - game.cam.y);
	canvasCtx.rotate(rotation);
	canvasCtx.translate(-(position.x - game.cam.x) - size, -(position.y - game.cam.y) - size);
	this.draw(position);	
	canvasCtx.restore();
	canvasCtx.globalAlpha = 1;
}

Sprite.prototype.animDraw = function(index, position)
{
	canvasCtx.drawImage(this.img, index * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, Math.floor(position.x) - game.cam.x, Math.floor(position.y) - game.cam.y, this.gameWidth, this.gameHeight);
}

Sprite.prototype.rotateAnimDraw = function(position, size, rotation, index)
{
	//Draw the sprite rotated about its center
	canvasCtx.save();
	canvasCtx.translate(position.x - game.cam.x, position.y - game.cam.y);
	canvasCtx.rotate(rotation);
	canvasCtx.translate(-(position.x - game.cam.x) - size, -(position.y - game.cam.y) - size);
	this.animDraw(index, position);	
	canvasCtx.restore();
}
