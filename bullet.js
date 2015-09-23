var Bullet = function()
{
	this.image = document.createElement("img");
	this.x = player.x;
	this.y = player.y;
	this.width = 10;
	this.height = 10;
	this.velocityX = 10;
	this.velocityY = 0;
	
	this.image.src = "bullet.png";
};

Bullet.prototype.update = function()
{
	if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true)
	{
		this.x = this.x + this.velocityX;
		this.y = this.y + this.velocityY;
	}
}

Bullet.prototype.draw = function()
{
	context.drawImage(this.image, -this.width/2, -this.height/2);	
}