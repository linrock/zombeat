const FPS = 60;
const SPRITE_DIMS = 48;
const SPRITES = [
  "img/abg.png",
  "img/poof.png",
  "img/sm-corpse.gif",
  "img/tot-corpse.gif",
  "img/gifs/powerup.gif",
  "img/gifs/trick-or-treat.gif",
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
const SHOT_DELAY = 8


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
  player: false,
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

		Crafty.sprite(32, "img/sm-corpse.gif", {  smcorpse: [0,0,1,0.75] });
		Crafty.sprite(32, "img/tot-corpse.gif", {  totcorpse: [0,0,1,1.5] });

		Crafty.sprite(32, "img/gifs/powerup.gif", { power: [0,0,1,1.5] });

		Crafty.sprite(32, "img/gifs/trick-or-treat.gif", { tot: [0,0,1,1.5] });

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
    $("#score-num").text(Defense.player.score);
    $("#game-over-score").fadeIn('slow');
  });

  var wave_num;
  var mouseX = 0;
  var mouseY = 0;

	Crafty.scene("main", function() {
    $("#dude-canvas")
      .bind("mousemove", function(e) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
      })
      .bind("mousedown", function() {
        player.shootBullet();
      });

		Crafty.background("url('img/abg.png')");
   
    setTimeout(function() {
      Crafty.e("2D, DOM, power").attr({
        x: Crafty.randRange(0+100, Crafty.viewport.width-100),
        y: Crafty.randRange(0+100, Crafty.viewport.height-100)
      });
    }, 7000);

    setInterval(function() {
      if (Math.random()>0.75) {
        Crafty.e("2D, DOM, power").attr({
          x: Crafty.randRange(0+100, Crafty.viewport.width-100),
          y: Crafty.randRange(0+100, Crafty.viewport.height-100)
        });
      }
    }, 10000);

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
        _rotation: 0,
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
        timers: {
          invulnerable: 0,
          shot: 0,
        },
        powerups: {
          scattershot: 0,
          explosive: 0
        },
        shootBullet: function() {
          var self = this;
          var createBullet = function(rotation) {
            Crafty.e("2D, DOM, Color, bullet")
              .attr({
                x: self._x+SPRITE_DIMS/2,
                y: self._y+SPRITE_DIMS/2,
                w: 5, 
                h: 5, 
                rotation: rotation, 
                xspeed: 20 * Math.sin(rotation / 57.3), 
                yspeed: 20 * Math.cos(rotation / 57.3)
              })
              .color("rgb(255, 255, 0)")
              .bind("enterframe", function() {	
                this.x += this.xspeed;
                this.y -= this.yspeed;
                
                // Destroy if it goes out of bounds
                if (Crafty.frame() % 60 === 0) {
                  if (this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
                    this.destroy();
                  }
                }
              });
          };
          var frame = Crafty.frame();
          if (frame < this.timers.shot + SHOT_DELAY) {
            return;
          }
					// Create a bullet entity
          // if (true) {
          if (this.powerups.scattershot > 0 && frame < this.powerups.scattershot + FPS*10) {
            createBullet(this._rotation);
            createBullet(this._rotation+3);
            createBullet(this._rotation-3);
          } else {
            createBullet(this._rotation);
          }
          this.timers.shot = frame;
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
        var self = this;  
        var slowFrame = Crafty.frame() % 5 == 0;
        if (slowFrame) {
          y_angle = -(mouseY - this._y);
          x_angle = mouseX - this._x;
          var atan = Math.atan(y_angle/x_angle)*180/Math.PI;
          if (y_angle > 0 && x_angle > 0) {
            this._rotation = 90-atan;
          } else if (y_angle > 0 && x_angle < 0) {
            this._rotation = 270-atan;
          } else if (y_angle < 0 && x_angle > 0) {
            this._rotation = -atan-270;
          } else if (y_angle < 0 && x_angle < 0) {
            this._rotation = 270-atan;
          }
        }
        if (this._rotation < 0) {
          this._rotation += 360;
        } else if (this._rotation > 360) {
          this._rotation -= 360;
        }

        if (slowFrame) {
          var angle = this._rotation;
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
          changePlayerComponent(function() {
            if ((337.5 < angle && angle < 360) || (angle >= 0 && angle <= 22.5)) {
              return 'main5';
            } else if (22.5 < angle && angle <= 67.5) {
              return 'main6';
            } else if (67.5 < angle && angle <= 112.5) {
              return 'main7';
            } else if (112.5 < angle && angle <= 157.5) {
              return 'main8';
            } else if (157.5 < angle && angle <= 202.5) {
              return 'main1';
            } else if (202.5 < angle && angle <= 247.5) {
              return 'main2';
            } else if (247.5 < angle && angle <= 292.5) {
              return 'main3';
            } else if (292.5 < angle && angle <= 337.5) {
              return 'main4';
            }
          }());
        }

				// if the move up is true, increment the y/xspeeds
        var max_speed = 4;
        
        this.xspeed *= this.decay;
        this.yspeed *= this.decay;

				if (this.move.up)     { this.yspeed = -max_speed; }
        if (this.move.down)   { this.yspeed =  max_speed; }
        if (this.move.left)   { this.xspeed = -max_speed; }
        if (this.move.right)  { this.xspeed =  max_speed; }
			
				// Move the x and y speeds or movement vector
        this.x = getBoundedX(this._x + this.xspeed);
        this.y = getBoundedY(this._y + this.yspeed);
				
				// If all zombies are gone, MORE ZOMBIES
				if (Defense.zombieCount <= 0) {
					spawnZombies(lastCount, lastCount * 1.5);
				}
			}).collision()
			.onHit("zombie", function(e) {
        var vx = this.x-e[0].obj.x;
        var vy = this.y-e[0].obj.y;
        var m = Math.sqrt(vx*vx+vy*vy);
        if (m > 0.01) {
          this.x = getBoundedX(this._x+vx/m*2);
          this.y = getBoundedY(this._y+vy/m*2);
        }

        var frame = Crafty.frame();
        if (parseInt(player.timers.invulnerable)+(FPS/2) < frame) {
          player.hp -= 10;
          this.xspeed *= 0.9;
          this.yspeed *= 0.9;
          player.timers.invulnerable = frame;
          hp.text("HP: "+player.hp);
        }
        if (player.hp <= 0) {
          Crafty.scene("game_over");
        }
			})
      .onHit("power", function(e) {
				e[0].obj.destroy();
        player.powerups.scattershot = Crafty.frame();
      });
		Defense.player = player;

		// Zombie component. Types: normal, tot, dog
		Crafty.c("zombie", {
			init: function() {
        // if (true) {
        if (Defense.wave >= 3 && (Math.random()>0.8)) {
          var zombie_type = "dog";
          this.removeComponent("front").addComponent("dfront");
        // } else if (true) {
        } else if (Math.random()>0.9) {
          var zombie_type = "tot";
          this.removeComponent("front").addComponent("tot");
        } else {
          var zombie_type = "normal";
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
        if (zombie_type === "dog") {
          this.max_speed *= 1.5;
        } else if (zombie_type === "tot") {
          this.max_speed *= 1.2;
          this.hp += 3;
        }
        Crafty.e("2D, DOM, fadeAway, poof").attr({ 
          x: this._x-12, y: this._y+12
        });
        this.bind("enterframe", function() {
					this.x += this.xspeed;
					this.y += this.yspeed;
          var abs_x = Math.abs(this.xspeed);
          var abs_y = Math.abs(this.yspeed);
          var self = this;

          if (zombie_type === "dog") {
            var components = ["dfront","dleft","dback","dright"];
          } else if (zombie_type === "tot") {
            var components = ["tot","tot","tot","tot"];
          } else {
            var components = ["front","left","back","right"];
          }
          var changeComponent = function(component) {
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
                changeComponent(components[3]);
              } else {
                changeComponent(components[1]);
              }
            } else {
              if (this.yspeed >= 0) {
                changeComponent(components[0]);
              } else {
                changeComponent(components[2]);
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
            if (zombie_type === "normal") {
              Crafty.e("2D, DOM, fadeAway, smcorpse").attr({ 
                x: this._x, y: this._y+24
              });
            } else if (zombie_type === "tot") {
              Crafty.e("2D, DOM, fadeAway, totcorpse").attr({ 
                x: this._x, y: this._y
              });
            }
				  }
          this.x -= 5*this.xspeed;
          this.y -= 5*this.yspeed;

					// Split into two zombies by creating another zombie
					// Crafty.e("2D, DOM, "+size+", Collision, zombie").attr({
          //   x: this._x, y: this._y
          // });
				})
        .onHit("zombie", function(e) {
          // Center of mass collision handling... need to figure out
          // how people really do collision handling.
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
        });
			}
		});
		Crafty.c("fadeAway", {
      init: function() {
        this.opacity = 1;
        this.bind("enterframe", function() {
          this.opacity -= 0.03;
          $(this._element).css({ opacity: this.opacity });
          if (this.opacity <= 0.03) {
            this.destroy();
          }
        });
      }
    });
		
		// First level has between 1 and 10 zombies
		spawnZombies(1, 10);
	});
});
