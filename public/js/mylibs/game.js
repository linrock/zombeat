const FPS = 60;
const SPRITE_DIMS = 64;
const SPRITES = [
	"img/sprites.png",
  "img/abg.png",
  "img/gifs/sm-front.gif",
  "img/gifs/sm-right.gif",
  "img/gifs/sm-back.gif",
  "img/gifs/sm-left.gif",
]

const WIDTH = 800;
const HEIGHT = 500;

var l_context;
$(function() {
  l_canvas = $("#dude-canvas")[0];
  l_canvas.width = WIDTH;
  l_canvas.height = HEIGHT;
  l_context = l_canvas.getContext('2d');
});

var Defense = {
  zombieCount: 0
};
window.Defense = Defense;

$(document).ready(function() {
	Crafty.init(FPS, WIDTH, HEIGHT);
	Crafty.canvas();
	// Crafty.pause();    // Game is paused at first.

  //function to fill the screen with zombies by a random amount
  var spawnZombies = function(lower, upper) {
    var rocks = Crafty.randRange(lower, upper);
    if (Defense.zombieCount < 50) {
      Defense.zombieCount += rocks;
      lastCount = rocks;
      for(var i = 0; i < rocks; i++) {
        Crafty.e("2D, DOM, front, Collision, zombie");
      }
    }
  };
  var lastCount;    // keep a count of zombies
		
  Defense.spawnZombies = spawnZombies;

	// preload the needed assets
	Crafty.load(SPRITES, function() {
		// splice the spritemap
		Crafty.sprite(64, "img/sprites.png", {
			ship: [0,0],
			medium: [2,1],
			small: [3,1]
		});
		Crafty.sprite(64, "img/gifs/sm-front.gif", {
      front: [0,0]
    });
		Crafty.sprite(64, "img/gifs/sm-right.gif", {
      right: [0,0]
    });
		Crafty.sprite(64, "img/gifs/sm-back.gif", {
      back: [0,0]
    });
		Crafty.sprite(64, "img/gifs/sm-left.gif", {
      left: [0,0]
    });

		//start the main scene when loaded
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("url('img/abg.png')");
		
		//score display
		var score = Crafty.e("2D, DOM, Text")
			.text("Score: 0")
			.attr({
        x: Crafty.viewport.width - 300,
        y: Crafty.viewport.height - 50,
        w: 200,
        h: 50
      })
			.css({color: "#fff"});

    var hp = Crafty.e("2D, DOM, Text")
      .text("HP: 100")
      .attr({
        x: Crafty.viewport.width - 200,
        y: Crafty.viewport.height - 50,
        w: 200,
        h: 50
      })
      .css({ color: '#fff' });
		//player entity
		var player = Crafty.e("2D, Canvas, ship, Controls, Collision")
			.attr({
        move: {
          left: false,
          right: false,
          up: false,
          down: false
        },
        xspeed: 0,
        yspeed: 0,
        decay: 0.9, 
        x: Crafty.viewport.width / 2,
        y: Crafty.viewport.height / 2,
        score: 0,
        hp: 100,
        timers: {
          invulnerable: 0
        }
      })
			.origin("center")
			.bind("keydown", function(e) {
				//on keydown, set the move booleans
				if(e.keyCode === Crafty.keys.RIGHT_ARROW) {
					this.move.right = true;
				} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
					this.move.left = true;
				} else if(e.keyCode === Crafty.keys.UP_ARROW) {
					this.move.up = true;
				} else if(e.keyCode === Crafty.keys.DOWN_ARROW) {
					this.move.down = true;
				} else if(e.keyCode === Crafty.keys.SPACE) {
					//create a bullet entity
					Crafty.e("2D, DOM, Color, bullet")
						.attr({
							x: this._x+SPRITE_DIMS/2,
							y: this._y+SPRITE_DIMS/2,
							w: 2, 
							h: 5, 
							rotation: this._rotation, 
							xspeed: 20 * Math.sin(this._rotation / 57.3), 
							yspeed: 20 * Math.cos(this._rotation / 57.3)
						})
						.color("rgb(255, 255, 0)")
						.bind("enterframe", function() {	
							this.x += this.xspeed;
							this.y -= this.yspeed;
							
							//destroy if it goes out of bounds
							if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
								this.destroy();
							}
						});
				}
			}).bind("keyup", function(e) {
				//on key up, set the move booleans to false
				if (e.keyCode === Crafty.keys.RIGHT_ARROW) {
					this.move.right = false;
				} else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
					this.move.left = false;
				} else if(e.keyCode === Crafty.keys.UP_ARROW) {
					this.move.up = false;
				} else if(e.keyCode === Crafty.keys.DOWN_ARROW) {
					this.move.down = false;
				}
			}).bind("enterframe", function() {
				if(this.move.right) this.rotation += 5;
				if(this.move.left) this.rotation -= 5;
				
				// acceleration and movement vector
				var vx = Math.sin(this._rotation * Math.PI / 180) * 0.3,
					vy = Math.cos(this._rotation * Math.PI / 180) * 0.3;
				
				// if the move up is true, increment the y/xspeeds
        var max_speed = 5;
        var min_speed = -5;

				if (this.move.up) {
          var new_y = this.yspeed-vy;
          var new_x = this.xspeed+vx;
          if (new_x > min_speed && new_x < max_speed) {
            this.xspeed = new_x;
          }
          if (new_y > min_speed && new_y < max_speed) {
            this.yspeed = new_y;
          }
        } else if (this.move.down) {
          var new_y = this.yspeed+vy;
          var new_x = this.xspeed-vx;
          if (new_x > min_speed && new_x < max_speed) {
            this.xspeed = new_x;
          }
          if (new_y > min_speed && new_y < max_speed) {
            this.yspeed = new_y;
          }
				} else {
          // if released, slow down the ship
          this.xspeed *= this.decay;
          this.yspeed *= this.decay;
				}
			
				//move the ship by the x and y speeds or movement vector
				this.x += this.xspeed;
				this.y += this.yspeed;
				
				//if ship goes out of bounds, put him back
				if(this._x > Crafty.viewport.width) {
					this.x = -64;
				}
				if(this._x < -64) {
					this.x = Crafty.viewport.width;
				}
				if(this._y > Crafty.viewport.height) {
					this.y = -64;
				}
				if(this._y < -64) {
					this.y = Crafty.viewport.height;
				}
				
				//if all zombies are gone, start again with more
				if (Defense.zombieCount <= 0) {
					spawnZombies(lastCount, lastCount * 2);
				}
			}).collision()
			.onHit("zombie", function() {
        var frame = Crafty.frame();
        if (parseInt(player.timers.invulnerable)+60 < frame) {
          player.hp -= 10;
          player.timers.invulnerable = frame;
          hp.text("HP: "+player.hp);
          // If player gets hit, restart the game
          // Crafty.scene("main");
        }
			});
		
		//zombie component
		Crafty.c("zombie", {
			init: function() {
				this.origin("center");
				this.attr({
					x: Crafty.randRange(0, Crafty.viewport.width),
					y: Crafty.randRange(0, Crafty.viewport.height),
					xspeed: Crafty.randRange(-5, 1), 
					yspeed: Crafty.randRange(1, 1), 
					rspeed: 0
				})
        .bind("enterframe", function() {
					this.x += this.xspeed;
					this.y += this.yspeed;
          var abs_x = Math.abs(this.xspeed);
          var abs_y = Math.abs(this.yspeed);
          var self = this;

          var changeComponent = function(component) {
            var components = ["front","left","back","right"];
            for (var i in components) {
              if (self.has(components[i])) {
                if (component != components[i]) {
                  self.removeComponent(components[i]).addComponent(component);
                }
                break;
              }
            }
          };
          if (Crafty.frame() % FPS == 0) {
            if (abs_x >= abs_y) {
              if (this.xspeed >= 0) {
                changeComponent("right");
              } else {
                changeComponent("left");
              }
            } else {
              if (this.yspeed >= 0) {
                changeComponent("front");
              } else {
                changeComponent("back");
              }
            }
          }

					if(this._x > Crafty.viewport.width) {
						this.x = -64;
					}
					if(this._x < -64) {
						this.x =  Crafty.viewport.width;
					}
					if(this._y > Crafty.viewport.height) {
						this.y = -64;
					}
					if(this._y < -64) {
						this.y = Crafty.viewport.height;
					}
				}).collision()
				.onHit("bullet", function(e) {
					//if hit by a bullet increment the score
					player.score += 5;
					score.text("Score: "+player.score);
					e[0].obj.destroy(); //destroy the bullet

          Defense.zombieCount--;
          this.destroy();
				
          this.x -= 5*this.xspeed;
          this.y -= 5*this.yspeed;

					// Split into two zombies by creating another zombie
					// Crafty.e("2D, DOM, "+size+", Collision, zombie").attr({x: this._x, y: this._y});
				});
			}
		});
		
		//first level has between 1 and 10 zombies
		spawnZombies(1, 10);
	});
});
