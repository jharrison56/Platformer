var Enemy = function()
{
	this.image = document.createElement("img");
	this.x = 100;
	this.y = canvas.height/2;
	this.width = 159;
	this.height = 163;
	
	this.image.src = "hero.png";
};

Enemy.prototype.update = function(deltaTime)
{
	if (typeof(this.rotation) == "undefined")
		this.rotation = 0;
	
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.rotation = this.rotation - deltaTime;
	}
	else
	{
		this.rotation = this.rotation + deltaTime;
	}
}

Enemy.prototype.draw = function()
{
	context.save();
		context.translate(this.x, this.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}