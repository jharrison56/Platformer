var Bullet = function()
{
	this.image = document.createElement("img");
	this.x = player.x;
	this.y = player.y;
	this.width = 5;
	this.height = 5;
	this.velocityX = 0;
	this.velocityY = 1;
	
	this.image.src = "bullet.png";
};

Bullet.prototype.update = function()
{
	var velX = 0;
	var velY = 1;
	
	var s = Math.sin(player.rotation);
	var c = Math.cos(player.rotation);
	
	this.velX = (velX * c) - (velY * s);
	this.velY = (velX * s) + (velY * c);
	
	this.velocityX = this.velX * 500;
	this.velocityY = this.velY * 500;
}

Bullet.prototype.draw = function()
{
	context.drawImage(this.image, -this.width/2, -this.height/2);	
}