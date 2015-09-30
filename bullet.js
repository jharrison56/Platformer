var Bullet = function()
{
	this.image = document.createElement("img");
	this.x = player.x;
	this.y = player.y;
	this.width = 10;
	this.height = 10;
	this.velocity = player.direction;
	
	this.image.src = "bullet.png";
};

/*Bullet.prototype.update = function()
{

}*/

Bullet.prototype.draw = function()
{
	context.drawImage(this.image, -this.width/2, -this.height/2);	
}