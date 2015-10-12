function gameStateSplash()
{
	var splashScreen = document.createElement("img");
	splashScreen.src = "startscreen.png";
	context.drawImage (splashScreen, 0, 0);
	
	player.draw();
	
	if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		gameState = STATE_GAME;
	}
}

function gameStateGame(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawMap();
	
	var deltaTime = getDeltaTime();
	
	//updates player
	player.update(deltaTime);
	
	//updates enemies
	
	for (var i = 0; i < enemies.length; i++)
	{
		enemies[i].update(deltaTime);
		if (!player.isDead)
			if(intersects (enemies[i].position.x, enemies[i].position.y, TILE, TILE, player.position.x, player.position.y, TILE, TILE))
			{
				lives = lives - 1;
				player.position = new Vector2();
				player.position.set (9 * TILE, 7 * TILE);
			}
	}
	
	//updates bullets and checks collisions
	var hit = false;
	
	for(var i = 0; i < bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if(bullets[i].position.x - worldOffsetX < 0 || bullets[i].position.y - worldOffsetX > SCREEN_WIDTH)
		{
			hit = true;
		}
		
		for(var j = 0; j < enemies.length; j++)
		{
			if(intersects (bullets[i].position.x, bullets[i].position.y, TILE, TILE, enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				//kills both the bullet and the enemy
				enemies.splice(j, 1);
				hit = true;
				
				//increment player score
				score = score + 1;
				break;
			}
		}
		
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
	//draws player
	if (!player.isDead)
	{
	player.draw(deltaTime);
	}

	//draws enemies
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw(deltaTime);
	}

	//draws bullets
	for(var j = 0; j < bullets.length; j++)
	{
		bullets[j].draw(deltaTime);
	}
	
	//sets the image for the gun icon
	var gun = document.createElement("img");
	gun.src = ("gunIcon.png");
	
	//draws the gun icon
	context.drawImage(gun, 5, 5);
	
	//draws the score
	context.fillStyle = "red";
	context.font="24px Arial bold";
	var scoreText = "Score: " + score;
	context.fillText(scoreText, 58, 38);
	
	//sets the image for the hearts/lives
	var heart = document.createElement("img");
	heart.src = ("heartImage.png");	
	
	//draws the lives
	for (var i=0; i<lives; i++)
	{
		context.drawImage(heart, 505 + ((heart.width + 2) * i), 23);
	}
	
	//if the player falls off the screen, take away a life and reset the player position to the starting position
	if (player.position.y > SCREEN_HEIGHT)
	{
		lives = lives - 1;
		player.position = new Vector2();
		player.position.set (9 * TILE, 7 * TILE);
		
	}
	
	//if all lives are gone, go to the game over screen
	if (lives == 0)
	{
		player.isDead = true;
		gameState = STATE_GAMEOVER;
	}	
}

function gameStateGameOver()
{
	var gameOver = document.createElement("img");
	gameOver.src = "gameover.png";
	context.drawImage(gameOver, 0, 0);
	
	if (keyboard.isKeyDown(keyboard.KEY_ENTER) == true)
	{
		gameState = STATE_GAME;
		enemies = [];
		player.isDead = false;
		player.position = new Vector2();
		player.position.set (9 * TILE, 7 * TILE);
		initialise();
	}
}
