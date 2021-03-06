var Vector2 = function()
{
	this.x = 0;
	this.y = 0;
}

Vector2.prototype.set = function(x, y)
{
	this.x = x;
	this.y = y;
}

Vector2.prototype.normalize = function()
{
	var magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));
	
	this.x = this.x / magnitude;
	this.y = this.y / magnitude;
}

Vector2.prototype.add = function(v2)
{
	this.x = this.x + v2.x;
	this.y = this.y + v2.y;
}

Vector2.prototype.subtract = function(v2)
{
	this.x = this.x - v2.x;
	this.y = this.y - v2.y;
}

Vector2.prototype.multiplyScalar = function(num)
{
	this.x = this.x * num;
	this.y = this.y * num;
}

Vector2.prototype.copy = function(v2)
{
	v2 = new Vector2();
	v2.x = this.x;
	v2.y = this.y;
	return v2;
}