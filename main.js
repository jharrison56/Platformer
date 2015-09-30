var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var LAYER_COUNT = 3;
var MAP = {tw: 50, th:15};
var TILE = 35;
var TILESET_TILE = TILE * 2;
var TILESET_PADDING = 2;
var TILESET_SPACING = 2;
var TILESET_COUNT_X = 14;
var TILESET_COUNT_Y = 14;
var LAYER_COUNT = 3;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1600;

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_HIGHSCORE = 3;

var gameState = STATE_SPLASH;

var musicBackground;
var sfxFire;

// some variables to calculate the Frames Per Second (FPS - this tells us
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

//loads the image to use for level tileset
var tileset = document.createElement("img");
tileset.src = "tileset.png";

// load an image to draw
//var chuckNorris = document.createElement("img");
//chuckNorris.src = "hero.png";

//creates new keyboard object
var keyboard = new Keyboard();

//creates new player object
var player = new Player();

//creates new enemy object
var enemy = new Enemy();

//creates new bullet object. Theoretically. 
var bullet = [];

//checks if there is a tile with a collision at the pixel coordinates on the given layer
function cellAtPixelCoord(layer, x, y)
{
	if (x < 0 || x > SCREEN_WIDTH || y < 0)
		return 1;
	//let the player drop off the bottom of the screen (meaning death)
	if (y > SCREEN_HEIGHT)
		return 0;
	return cellAtTileCoord(layer, p2t(x), p2t(y));
};

//checks if there is a tile with a collision at the tile coordinates on the given layer
function cellAtTileCoord(layer, tx, ty)
{
	if (tx < 0 || tx >= MAP.tw || ty < 0)
		return 1;
	//let the player drop off the bottom of the screen (meaning death)
	if (ty >= MAP.th)
		return 0;
	return cells[layer][ty][tx];
};

//functions to convert pixels to tiles and vice versa

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor (pixel/TILE);
};

//returns the same value if that value is within the min and max, otherwise it will return the min or the max
function bound (value, min, max)
{
	if (value < min)
		return min;
	if (value > max)
		return max;
	return value;
};


//draws the level
function drawMap()
{
	for(var layerIdx=0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		var idx = 0;
		for (var y = 0; y < level1.layers[layerIdx].height; y++)
		{
			for (var x = 0; x < level1.layers[layerIdx].width; x++)
			{
				if (level1.layers[layerIdx].data[idx] != 0)
				{
					var tileIndex = level1.layers[layerIdx].data[idx] - 1;
					var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
					var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
					context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x * TILE, (y-1) * TILE, TILESET_TILE, TILESET_TILE);
				}
				idx++;
			}
		}
	}
}

var cells = [];			//this is the array that holds the simplified collision data
function initialise() 
{
	for (var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)		//initialises the collision map
	{
		cells[layerIdx] = [];
		var idx = 0;
		for (var y = 0; y < level1.layers[layerIdx].height; y++)
		{
			cells[layerIdx][y] = [];
			for (var x = 0; x < level1.layers[layerIdx].width; x++)
			{
				if (level1.layers[layerIdx].data[idx] != 0) 
				{
					//creates 4 collisions 
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y-1][x] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y][x+1] = 1;
				}
				
				else if(cells[layerIdx][y][x] != 1)
				{
					//sets the cell's value to 0 if we haven't already done it
					cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
	
	//creating howler (audio) objects
	musicBackground = new Howl(
	{
		urls: ["background.ogg"],
		loop: true,
		buffer: true,
		volume: 0.5,
	});
	musicBackground.play();
	
	sfxFire = new Howl(
	{
		urls: ["fireEffect.ogg"],
		buffer: true,
		volume: 1,
		onend: function() 
		{
			isSfxPlaying = false;
		}
	});
}

function run()
{
	
	switch (gameState)
	{
		case STATE_SPLASH:
			gameStateSplash();
			break;
			
		case STATE_GAME:
			gameStateGame();
			break;
			
		case STATE_GAMEOVER:
			gameStateGameOver();
			break;
			
		case STATE_HIGHSCORE:
			gameStateHighscore();
			break;
	}
	
	
}

//calls the initialise function
initialise();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
