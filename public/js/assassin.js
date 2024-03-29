window.onload = function() {
	Crafty.init(550, 440);
	
	Crafty.sprite(64, "img/fruit.png", {
		banana: [0,0],
		apple: [1,0],
		watermelon: [2,0],
		orange: [3,0],
		coconut: [4,0],
		lemon: [5,0]
	});
	
	Crafty.background("url('img/bg.png') no-repeat");
	
	var scoreEnt = Crafty.e("2D, DOM, Text").attr({x: 5, y: 5, w: Crafty.viewport.width, h: 50}).text("Score: 0"),
		score = 0;
	
	Crafty.c("fruit", {
		_choice: ["banana", "apple", "watermelon", "orange", "coconut", "lemon"],
		_xspeed: 0,
		_yspeed: 0,
		
		init: function() {
			var index = Crafty.randRange(0, 5),
				fruit = this._choice[index],
				rotation = Crafty.randRange(8, 12),
				direction = Crafty.randRange(0, 1);
				
			this.addComponent(fruit).origin("center");
			this.y = Crafty.viewport.height;
			this._yspeed = Crafty.randRange(15, 18);
			this.z = 1;
			
			if(direction) {
				this.x = 0;
				this._xspeed = Crafty.randRange(3, 5);
			} else {
				this.x = Crafty.viewport.width;
				this._xspeed = -1 * Crafty.randRange(3, 5);
			}
			
			this.bind("enterframe", function() {
				this.rotation += rotation;
				this.y -= this._yspeed;
				this.x += this._xspeed;
				
				if(this._y > Crafty.viewport.height) {
					this.destroy();
					if(!this.hit) {
						score -= (index+1) * 10;
						scoreEnt.text("Score: "+score);
					}
				}
			});
			
			this.bind("mouseover", function() {
				this.sprite(index, 1);
				this.hit = true;
				score += (index+1) * 10;
				scoreEnt.text("Score: "+score);
				
				Crafty.e("2D, DOM, "+fruit).attr({z:0, x: this._x, y: this._y, alpha: 0.2}).sprite(index, 2);
				
				this.unbind("mouseover");
			});
		}
	});
	
	Crafty.e().bind("enterframe", function(e) {
		var sparsity = Crafty.randRange(10, 50);
		if(e.frame % sparsity == 0) {
			Crafty.e("2D, DOM, fruit, Gravity, Mouse").gravity("floor");
		}
	});
	
};
