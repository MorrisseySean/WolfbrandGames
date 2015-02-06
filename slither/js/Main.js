var game, GAMESIZE;

function main(id)
{
	//post({'pName':'Sean', 'pScore':'60'});
	GAMEWIDTH = 960;
	GAMEHEIGHT = 540;
	GAMESIZE = GAMEWIDTH/20;
	window.IMAGE = {};
	LoadAssets();
	game = new Game();
	game.init(id);
	game.gameLoop();
}

window.onload = function LoadGame()
{
	main("slitherDiv");
}

function LoadAssets()
{	
	//Tutorial notes
	IMAGE.NOTE = new Sprite(GAMEWIDTH, GAMEHEIGHT, "slither/images/note.png", 500, 500);
	IMAGE.MOVETUTORIAL= new Sprite(GAMEWIDTH, GAMEHEIGHT, "slither/images/moveTutorial.png", 500, 500);
	IMAGE.MONSTERTUTORIAL = new Sprite(GAMEWIDTH, GAMEHEIGHT, "slither/images/monsterTutorial.png", 500, 500);
	IMAGE.PICKUPTUTORIAL = new Sprite(GAMEWIDTH, GAMEHEIGHT,"slither/images/supplyTutorial.png", 500, 500);
	
	//Building assets
	IMAGE.GROUNDSPRITE = new Sprite(GAMESIZE * 2, GAMESIZE * 2, "slither/images/ground2.png", 500, 500);
	IMAGE.FLOORSPRITE = new Sprite(GAMESIZE * 2, GAMESIZE * 2, "slither/images/wood.png", 500, 500);
	IMAGE.WALLSPRITE = new Sprite(GAMESIZE * 2, GAMESIZE * 2, "slither/images/wall.png", 500, 500);
	
	//Player and enemy assets
	IMAGE.PLAYERSHEET = new Sprite(GAMESIZE, GAMESIZE, "slither/images/playersheet.png", 500, 500);	
	IMAGE.ENEMYSPRITE = new Sprite(GAMESIZE * 2, GAMESIZE * 2, "slither/images/monster.png", 500, 500);
	
	//PICKUP SPRITES
	IMAGE.BATTERYSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/battery.png", 500, 500);
	IMAGE.PILLSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/pills.png", 500, 500);
	IMAGE.FOODSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/food.png", 500, 500);
	IMAGE.WATERSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/water.png", 500, 500);
	IMAGE.LIGHTERSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/lighter.png", 500, 500);
	IMAGE.BANDAGESPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/bandage.png", 500, 500);
	IMAGE.RUNNERSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/runners.png", 500, 500);
	IMAGE.FLASHLIGHTSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/flashlight.png", 500, 500);
	IMAGE.GLOWSTICKTUBE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/glowsticktube.png", 500, 500);
	IMAGE.GLOWSTICKSPRITE = new Sprite(GAMESIZE, GAMESIZE, "slither/images/glowstick.png", 500, 500);
}

