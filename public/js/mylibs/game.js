const FPS = 60;
const SPRITE_DIMS = 48;
const SPRITES = [
  "img/abg.png",
  "img/poof.png",
  "img/gifs/sm-front.gif",
  "img/gifs/sm-right.gif",
  "img/gifs/sm-back.gif",
  "img/gifs/sm-left.gif",
  "img/gifs/main-1.gif",
  "img/gifs/main-2.gif",
  "img/gifs/main-3.gif",
  "img/gifs/main-4.gif",
  "img/gifs/main-5.gif",
  "img/gifs/main-6.gif",
  "img/gifs/main-7.gif",
  "img/gifs/main-8.gif",
  "img/gifs/dog-front.gif",
  "img/gifs/dog-right.gif",
  "img/gifs/dog-back.gif",
  "img/gifs/dog-left.gif",
]

const WIDTH = 800;
const HEIGHT = 500;

const ZOMBIE_MAX_SPEED = 2;


var l_context;
$(function() {
  l_canvas = $("#dude-canvas")[0];
  l_canvas.width = WIDTH;
  l_canvas.height = HEIGHT;
  l_context = l_canvas.getContext('2d');
});

var Defense = {
  zombieCount: 0,
  gameOver: false,
  wave: 0,
  nextWave: false
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

  var getBoundedX = function(x) {
    if (x < 0) {
      x = 0;
    } else if (x > Crafty.viewport.width-SPRITE_DIMS) {
      x = Crafty.viewport.width-SPRITE_DIMS;
    }
    return x;
  };
  var getBoundedY = function(y) {
    if (y < 0) {
      y = 0;
    } else if (y > Crafty.viewport.height-SPRITE_DIMS) {
      y = Crafty.viewport.height-SPRITE_DIMS;
    }
    return y;
  };
  var nextWave = function() {
    Defense.wave++;
    wave_num.text("Wave: "+Defense.wave);
    if (Defense.wave >= 2) {
      $("#wave-num").text(Defense.wave);
      $("#wave-indicator").show().fadeOut(2500);
    }
  };
  Defense.nextWave = nextWave;
  Defense.spawnZombies = spawnZombies;
  
  var lastCount;    // keep a count of zombies

	// preload the needed assets
	Crafty.load(SPRITES, function() {
    Crafty.sprite(48, "img/poof.png", { poof: [0,0] });

		Crafty.sprite(32, "img/gifs/sm-front.gif", {  front: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/sm-right.gif", {  right: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/sm-back.gif", {   back: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/sm-left.gif", {   left: [0,0,1,1.5] });
		
    Crafty.sprite(40, "img/gifs/dog-front.gif", {  dfront: [0,0,1.2,1] });
		Crafty.sprite(40, "img/gifs/dog-right.gif", {  dright: [0,0,1.2,1] });
		Crafty.sprite(40, "img/gifs/dog-back.gif", {   dback: [0,0,1.2,1] });
		Crafty.sprite(40, "img/gifs/dog-left.gif", {   dleft: [0,0,1.2,1] });
		
    Crafty.sprite(32, "img/gifs/main-1.gif", { main1: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-2.gif", { main2: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-3.gif", { main3: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-4.gif", { main4: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-5.gif", { main5: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-6.gif", { main6: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-7.gif", { main7: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/main-8.gif", { main8: [0,0,1,1.5] });

		//start the main scene when loaded
		Crafty.scene("main");
	});

  Crafty.scene("game_over", function() {
		Crafty.background("url('img/abg.png')");
    Defense.gameOver = true;
    $("#dude-canvas").css({
      'background-color': 'black',
      opacity: 0.3
    });
    $("#game-over").fadeIn('slow');
  });

  var wave_num;
  var mouseX = 0;
  var mouseY = 0;

	Crafty.scene("main", function() {
    $("#dude-canvas")
    .bind("mousemove", function(e) {
      mouseX = e.layerX;
      mouseY = e.layerY;
    })
    .bind("mousedown", function() {
      player.shootBullet();
    })

		Crafty.background("url('img/abg.png')");
		
    wave_num = Crafty.e("2D, DOM, Text")
      .text("Wave: 1")
      .attr({
        x: Crafty.viewport.width - 300,
        y: 25,
        w: 100,
        h: 25
      })
      .css({ color: '#fff' });

    var hp = Crafty.e("2D, DOM, Text")
      .text("HP: 100")
      .attr({
        x: Crafty.viewport.width - 200,
        y: 25,
        w: 100,
        h: 25
      })
      .css({ color: '#fff' });

		//score display
		var score = Crafty.e("2D, DOM, Text")
			.text("Score: 0")
			.attr({
        x: Crafty.viewport.width - 100,
        y: 25,
        w: 100,
        h: 25
      })
			.css({color: "#fff"});

		//player entity
		var player = Crafty.e("2D, DOM, main1, Controls, Collision")
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
        y: Crafty.viewport.height - 100,
        score: 0,
        hp: 100,
        _rotation: 0,
        timers: {
          invulnerable: 0
        },
        shootBullet: function() {
					// Create a bullet entity
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
							
							// Destroy if it goes out of bounds
							if(this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
								this.destroy();
							}
						});
        }
      })
			.origin("center")
			.bind("keydown", function(e) {
				//on keydown, set the move booleans
				if(e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
					this.move.right = true;
				} else if(e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
					this.move.left = true;
				} else if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
					this.move.up = true;
				} else if(e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
					this.move.down = true;
				} else if(e.keyCode === Crafty.keys.SPACE) {
          this.shootBullet();
				}
			}).bind("keyup", function(e) {
				//on key up, set the move booleans to false
				if (e.keyCode === Crafty.keys.RIGHT_ARROW || e.keyCode === Crafty.keys.D) {
					this.move.right = false;
				} else if(e.keyCode === Crafty.keys.LEFT_ARROW || e.keyCode === Crafty.keys.A) {
					this.move.left = false;
				} else if(e.keyCode === Crafty.keys.UP_ARROW || e.keyCode === Crafty.keys.W) {
					this.move.up = false;
				} else if(e.keyCode === Crafty.keys.DOWN_ARROW || e.keyCode === Crafty.keys.S) {
					this.move.down = false;
				}
			}).bind("enterframe", function() {
				// if(this.move.right) this._rotation += 5;
				// if(this.move.left) this._rotation -= 5;
        if (Crafty.frame() % 5 == 0) {
          y_angle = -(mouseY - this._y);
          x_angle = mouseX - this._x;
          var atan = Math.atan(y_angle/x_angle)*180/Math.PI;
          if (y_angle > 0 && x_angle > 0) {
            // yes
            this._rotation = 90-atan;
          } else if (y_angle > 0 && x_angle < 0) {
            // yes
            this._rotation = 270-atan;
          } else if (y_angle < 0 && x_angle > 0) {
            // no
            this._rotation = -atan-270;
          } else if (y_angle < 0 && x_angle < 0) {
            // yes
            this._rotation = 360-atan-90;
          }
        }
        if (this._rotation < 0) {
          this._rotation += 360;
        } else if (this._rotation > 360) {
          this._rotation -= 360;
        }

				// acceleration and movement vector
        var angle = this._rotation * Math.PI / 180;
				var vx = Math.sin(angle) * 0.3,
            vy = Math.cos(angle) * 0.3;
			
        var self = this;  
        var changePlayerComponent = function(component) {
          var components = ["main1","main2","main3","main4","main5","main6","main7","main8"];
          for (var i in components) {
            if (self.has(components[i])) {
              if (component != components[i]) {
                self.removeComponent(components[i]).addComponent(component);
              }
              break;
            }
          }
        };

        if (Crafty.frame() % (FPS/10) == 0) {
          var angle = this._rotation;
          if ((337.5 < angle && angle < 360) || (angle >= 0 && angle <= 22.5)) {
            changePlayerComponent('main5');
          } else if (22.5 < angle && angle <= 67.5) {
            changePlayerComponent('main6');
          } else if (67.5 < angle && angle <= 112.5) {
            changePlayerComponent('main7');
          } else if (112.5 < angle && angle <= 157.5) {
            changePlayerComponent('main8');
          } else if (157.5 < angle && angle <= 202.5) {
            changePlayerComponent('main1');
          } else if (202.5 < angle && angle <= 247.5) {
            changePlayerComponent('main2');
          } else if (247.5 < angle && angle <= 292.5) {
            changePlayerComponent('main3');
          } else if (292.5 < angle && angle <= 337.5) {
            changePlayerComponent('main4');
          }
        }

				// if the move up is true, increment the y/xspeeds
        var max_speed = 4;

				if (this.move.up) {
          this.yspeed = -max_speed;
        } else if (this.move.down) {
          this.yspeed = max_speed;
        } else if (this.move.left) {
          this.xspeed = -max_speed;
        } else if (this.move.right) {
          this.xspeed = max_speed;
				} else {
          // if released, slow down
          this.xspeed *= this.decay;
          this.yspeed *= this.decay;
				}
			
				// Move the x and y speeds or movement vector
				this.x += this.xspeed;
				this.y += this.yspeed;
        this.x = getBoundedX(this._x);
        this.y = getBoundedY(this._y);
				
				// If all zombies are gone, MORE ZOMBIES
				if (Defense.zombieCount <= 0) {
					spawnZombies(lastCount, lastCount * 1.5);
				}
			}).collision()
			.onHit("zombie", function(e) {
        var vx = this.x-e[0].obj.x;
        var vy = this.y-e[0].obj.y;
        var m = Math.sqrt(vx*vx+vy*vy);
        this.x = getBoundedX(this.x-vx/m*2);
        this.y = getBoundedY(this.y-vy/m*2);

        var frame = Crafty.frame();
        if (parseInt(player.timers.invulnerable)+(FPS/2) < frame) {
          player.hp -= 10;
          this.xspeed *= 0.5;
          this.yspeed *= 0.5;
          player.timers.invulnerable = frame;
          hp.text("HP: "+player.hp);
        }
        if (player.hp <= 0) {
          Crafty.scene("game_over");
        }
			});
		
		//zombie component
		Crafty.c("zombie", {
			init: function() {
        // if (true) {
        if (Defense.wave >= 3 && (Math.random()>0.8)) {
          var is_dog = true;
          this.removeComponent("front").addComponent("dfront");
        } else {
          var is_dog = false;
        }
				this.origin("center");
				this.attr({
					x: Crafty.randRange(0, Crafty.viewport.width),
					y: Crafty.randRange(0, 100),
					xspeed: Crafty.randRange(-5, 1), 
					yspeed: Crafty.randRange(1, 1), 
					rspeed: 0,
          max_speed: ZOMBIE_MAX_SPEED,
          hp: ~~(Defense.wave/2)
				});
        if (is_dog) {
          this.max_speed *= 1.5;
        }
        Crafty.e("2D, DOM, spawn, poof").attr({ 
          x: this._x-12, y: this._y+12
        });
        this.bind("enterframe", function() {
					this.x += this.xspeed;
					this.y += this.yspeed;
          var abs_x = Math.abs(this.xspeed);
          var abs_y = Math.abs(this.yspeed);
          var self = this;

          var changeComponent = function(component) {
            if (is_dog) {
              var components = ["dfront","dleft","dback","dright"];
            } else {
              var components = ["front","left","back","right"];
            }
            for (var i in components) {
              if (self.has(components[i])) {
                if (component != components[i]) {
                  self.removeComponent(components[i]).addComponent(component);
                }
                break;
              }
            }
          };
          var frame = Crafty.frame();
          if (frame % FPS == 0) {
            // Change direction they're facing
            if (abs_x >= abs_y) {
              if (this.xspeed >= 0) {
                if (is_dog) {
                  changeComponent("dright");
                } else {
                  changeComponent("right");
                }
              } else {
                if (is_dog) {
                  changeComponent("dleft")
                } else {
                  changeComponent("left");
                }
              }
            } else {
              if (this.yspeed >= 0) {
                if (is_dog) {
                  changeComponent("dfront") }
                else {
                  changeComponent("front");
                }
              } else {
                if (is_dog) {
                  changeComponent("dback")
                } else {
                  changeComponent("back");
                }
              }
            }
          }
          if (frame % (FPS/10) == 0) {
            // Seek out the player!
            var x_dir = player.x-this.x;
            var y_dir = player.y-this.y;
            var m = Math.sqrt(x_dir*x_dir+y_dir*y_dir);
            x_dir = x_dir/m;
            y_dir = y_dir/m;
            this.xspeed = x_dir*this.max_speed;
            this.yspeed = y_dir*this.max_speed;
          }
          this.x = getBoundedX(this._x);
          this.y = getBoundedY(this._y);
				}).collision()
				.onHit("bullet", function(e) {
					e[0].obj.destroy(); //destroy the bullet
          this.hp -= 1;
          if (this.hp <= 0) {
            player.score += 100;
            score.text("Score: "+player.score);
            Defense.zombieCount--;
            this.destroy();
				  }
          this.x -= 5*this.xspeed;
          this.y -= 5*this.yspeed;

					// Split into two zombies by creating another zombie
					// Crafty.e("2D, DOM, "+size+", Collision, zombie").attr({
          //   x: this._x, y: this._y
          // });
				})
        .onHit("zombie", function(e) {
          if (e.length <= 1) {
            return;
          }
          var x_center = 0;
          var y_center = 0;
          for (var i in e) {
            x_center += e[i].obj.x;
            y_center += e[i].obj.y;
          }
          x_center /= e.length;
          y_center /= e.length;
          for (var i in e) {
            var vx = e[i].obj.x-x_center;
            var vy = e[i].obj.y-y_center;
            var m = Math.sqrt(vx*vx+vy*vy)/2;
            e[i].obj.x = getBoundedX(e[i].obj.x + vx/m+(Math.random()*2)-1);
            e[i].obj.y = getBoundedY(e[i].obj.y + vy/m+(Math.random()*2)-1);
          }
          if (Crafty.frame() % 60 == 0) { }
        });
			}
		});
		Crafty.c("spawn", {
      init: function() {
        this.opacity = 1;
        this.bind("enterframe", function() {
          this.opacity -= 0.04;
          $(this._element).css({ opacity: this.opacity });
          if (this.opacity <= 0.04) {
            this.destroy();
          }
        });
      }
    });
		
		// First level has between 1 and 10 zombies
		spawnZombies(1, 10);
	});
});
