var LEFT = 0;
var RIGHT = 1;

var ANIM_ENEMY_RIGHT = 0;
var ANIM_ENEMY_LEFT = 1;
var ANIM_ENEMY_MAX = 2;

var Enemy = function(x, y)
{
	this.sprite = new Sprite("ninja.png");
	this.sprite.buildAnimation(5, 2, 88, 88, 0.5, [0, 1, 2, 3, 4]);
	this.sprite.buildAnimation(5, 2, 80, 80, 0.5, [5, 6, 7, 8, 9]);
	
	for(var i = 0; i < ANIM_ENEMY_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -44, -44);
	}
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.moveRight = true;
	this.pause = 0;
	
	this.direction = RIGHT;
}

Enemy.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
		
	if(this.pause > 0)
	{
		this.pause = this.pause - deltaTime;
	}
	
	else
	{
		var ddx = 0;			//acceleration
	
		//collision detection
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x) % TILE;		//true if enemy overlaps right
		var ny = (this.position.y) % TILE;		//true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx +1, ty + 1);
	
		if(this.moveRight)
		{
			this.sprite.setAnimation(ANIM_ENEMY_RIGHT);
			
			if(celldiag && !cellright)
			{
				ddx = ddx + ENEMY_ACCEL;	//enemy wants to go right
				
			}
			
			else
			{
				this.velocity.x = 0;
				this.moveRight = false;
				this.pause = 0.5;
			}
		}
		
		if(!this.moveRight)
		{
			this.sprite.setAnimation(ANIM_ENEMY_LEFT);
			
			this.direction = LEFT;
			if(celldown && !cell)
			{
				ddx = ddx - ENEMY_ACCEL;	//enemy wants to go left
				
			}
			
			else
			{
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}
		
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
	
	}
}

Enemy.prototype.draw = function(deltaTime)
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}