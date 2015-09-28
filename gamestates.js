function gameStateSplash()
{
	context.fillStyle = "#ccc";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
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
	
	player.update(deltaTime);
	player.draw();
	
	if (player.position.y > SCREEN_HEIGHT)
	{
		gameState = STATE_GAMEOVER;
	}

	//enemy.update(deltaTime);
	//enemy.draw();	
	
	bullet.update();
	bullet.draw();
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
}

function gameStateGameOver()
{
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height)
}

function gameStateHighscore()
{
	
}