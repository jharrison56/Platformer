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
	
	if (player.position.y > SCREEN_HEIGHT)
	{
		gameState = STATE_GAMEOVER;
	}

	//enemy.update(deltaTime);
	//enemy.draw();	
	
	//bullet.update();
	//bullet.draw();
		
	// update the frame counter 
	/*fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font = "14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);*/
}

function gameStateGameOver()
{
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height)
}

function gameStateHighscore()
{
	context.fillStyle = "black";
	context.fillRect(0, 0, canvas.width, canvas.height)
	context.font = "14px Arial";
}