var Enemy = function(x, y)
{
	this.sprite = new Sprite("ninja.png");
	this.sprite.buildAnimation(5, 5, 88, 88, 0.5, [0, 1, 2, 3, 4]);
	this.sprite.setAnimationOffset(0, -35, -35);
	
	this.position = new Vector2();
	this.position.set = (10, 20);
	
	this.velocity = new Vector2();
	
	this.moveRight = true;
	this.pause = 0;
}

Enemy.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	if (this.pause > 0)
	{
		this.pause = this.pause - deltaTime;
	}
	
	else 
	{
		var ddx = 0;							//acceleration
		
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE;		//true if enemy overlaps right
		var ny = (this.position.y)%TILE;		//true if enemy overlaps below
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1)
		
		if(this.moveRight)
		{
			if(cellDiag && !cellRight)
			{
				ddx = ddx + ENEMY_ACCEL; 		//enemy wants to go right
			}
		}
		
		if(!this.moveRight)
		{
			if(cellDown && !cell)
			{
				ddx = ddx + ENEMY_ACCEL;		//enemy wants to go left
			}
		}
		
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.y = bound(this.velocity.x + (deltaTime * ddx), -ENEMY_MAXDX, ENEMY_MAXDX);
	}
	
	//collision detection
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);
	var nx = (this.position.x) % TILE;		//true if player overlaps right
	var ny = (this.position.y) % TILE;		//true if player overlaps below
	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx +1, ty + 1);
	
	//If the player has vertical velocity, then check to see if they have hit a platform above or below, in which case stop their vertical velocity and clamp the y position
	if (this.velocity.y > 0)
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx))
		{
			//clamp the y position to avoid falling into platform below
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0;			//stop downward velocity
			this.falling = false;			//no longer falling
			this.jumping = false;			//no longer jumping
			ny = 0;							//no longer overlaps the cells below
		}
	}
	
	else if (this.velocity.y < 0)
	{
		if ((cell && !celldown) || (cellright && !celldiag && nx))
		{
			//clamp the y position to avoid jumping into platform above
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0;			//stop upward velocity
			//player is no longer really in that cell, we clamped them to the cell below
			cell = celldown;
			cellright = celldiag;			
			ny = 0;							//player no longer overlaps the cells below
		}
	}
	
	if (this.velocity.x > 0)
	{
		if ((cellright && !cell) || (celldiag && !celldown && ny)) 
		{
			//clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx);
			this.velocity.x = 0;			//stop horizontal velocity
		}
	}
	
	else if (this.velocity.x < 0)
	{
		if ((cell && !cellright) || (celldown && !celldiag && ny))
		{
			//clamp the x position to avoid moving into the platform we just hit
			this.position.x = tileToPixel(tx + 1);
			this.velocity.x = 0;			//stop horizontal velocity
		}
	}
}

Enemy.prototype.draw = function()
{
	this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);
}