const FPS = 60;
const SPRITE_DIMS = 48;
const SPRITES = [
  "img/abg.jpg",
  "img/poof.png",
  "img/boom.png",
  "img/sm-corpse.gif",
  "img/tot-corpse.gif",
  "img/gifs/heart.gif",
  "img/gifs/question.gif",
  "img/gifs/present.gif",
  "img/gifs/possessor.gif",
  "img/gifs/possessor_oj.gif",
  "img/gifs/trick-or-treat.gif",
  "img/gifs/boss.gif",
  "img/gifs/sm-front.gif",
  "img/gifs/sm-right.gif",
  "img/gifs/sm-back.gif",
  "img/gifs/sm-left.gif",
  "img/gifs/z-front.gif",
  "img/gifs/z-right.gif",
  "img/gifs/z-back.gif",
  "img/gifs/z-left.gif",
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
];

const WIDTH = 960;
const HEIGHT = 550;

const ZOMBIE_MAX_SPEED = 1.5;
const PLAYER_MAX_SPEED = 4;
const BOSS_HP = 50;

const SHOT_DELAY = 8;


var Defense = {
  zombieCount: 0,
  wave: 0,
  kills: 0,
  gameOver: false,
  gameStarted: false,
  songStarted: false,
  player: false,
  nextWave: false,
  loadScene: false,
};
window.Defense = Defense;


$(function() {
  var l_context;
  l_canvas = $("#dude-canvas")[0];
  l_canvas.width = WIDTH;
  l_canvas.height = HEIGHT;
  l_context = l_canvas.getContext('2d');

	Crafty.init(FPS, WIDTH, HEIGHT);
	// Crafty.canvas.init();
	// Crafty.pause();    // Game is paused at first.
  var enemyCounts = {
    pumpkins: 0,
    fireghosts: 0,
    boss: 0
  }

  //function to fill the screen with zombies by a random amount
  var spawnZombies = function(lower, upper) {
    var numSpawns = Crafty.randRange(lower, upper);
    if (Defense.zombieCount > 30) {
      return;
    } else if (Defense.zombieCount > 20 && Math.random()>0.75) {
      numSpawns = 0;
    } else if (Defense.zombieCount > 12) {
      numSpawns = 1;
    }
    Defense.zombieCount += numSpawns;
    lastCount = numSpawns;
    for(var i = 0; i < numSpawns; i++) {
      Crafty.e("2D, DOM, smfront, Collision, zombie");
    }
  };
  Defense.spawnZombies = spawnZombies;

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

  var buffZombies = function() {
    Crafty.e("2D, DOM, zombieBuff")
    .attr({
      x: 0,
      y: 0,
      w: 1000,
      h: 1000, 
    }).bind("enterframe", function() {
      this.destroy();
    });
  };
  Defense.buffZombies = buffZombies;

  var fadeBackground = function() {
    $("#dude-canvas").css({
      'background-color': 'black',
      opacity: 0.3
    });
  };
  
  var lastCount;    // keep a count of zombies

  var loadScene = function(scene) {
    Crafty.scene(scene);
  };
  Defense.loadScene = loadScene;

	// preload the needed assets
	Crafty.load(SPRITES, function() {
    Crafty.sprite(48, "img/poof.png", { poof: [0,0] });
    Crafty.sprite(43, "img/boom.png", { boom: [0,0,1,1.3] });

		Crafty.sprite(32, "img/sm-corpse.gif", {  smcorpse: [0,0,1,0.75] });
		Crafty.sprite(32, "img/tot-corpse.gif", {  totcorpse: [0,0,1,1.5] });

		Crafty.sprite(32, "img/gifs/present.gif", { powerup: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/heart.gif", { health: [0,0] });

		Crafty.sprite(32, "img/gifs/possessor.gif", { possessor: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/possessor_oj.gif", { fireghost: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/trick-or-treat.gif", { tot: [0,0,1,1.5] });
		Crafty.sprite(80, "img/gifs/boss.gif", { boss: [0,0] });

		Crafty.sprite(32, "img/gifs/sm-front.gif", {  smfront: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/sm-right.gif", {  smright: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/sm-back.gif", {   smback: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/sm-left.gif", {   smleft: [0,0,1,1.5] });
		
    Crafty.sprite(32, "img/gifs/z-front.gif", {  zfront: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/z-right.gif", {  zright: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/z-back.gif", {   zback: [0,0,1,1.5] });
		Crafty.sprite(32, "img/gifs/z-left.gif", {   zleft: [0,0,1,1.5] });
		
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
	});
	Crafty.background("url('img/abg.jpg')");

  Crafty.scene("intro", function() {
    fadeBackground();
    $("#intro-page").show();
    $("#play-button").click(function(e) {
      $("#intro-page").fadeOut(function() {
        Crafty.scene("main");
        $("#dude-canvas").css({ 'background-color' : 'white' });
        $("#the-audio").trigger('play');
        Defense.gameStarted = true;
      });
    });
  });

  Crafty.scene("unsupported", function() {
    Defense.gameOver = true;
    fadeBackground();
    $("#unsupported").show();
  });

  Crafty.scene("you_win", function() {
    Defense.gameOver = true;
    fadeBackground();
    $("#game-over").text("You Win!!!").fadeIn('slow');
    $("#score-num").text(Defense.player.score);
    $("#kills-num").text(Defense.kills);
    $("#game-over-score").fadeIn('slow');
    $("#game-over-kills").fadeIn('slow');
  });

  Crafty.scene("game_over", function() {
    Defense.gameOver = true;
    fadeBackground();
    $("#game-over").fadeIn('slow');
    $("#score-num").text(Defense.player.score);
    $("#kills-num").text(Defense.kills);
    $("#game-over-score").fadeIn('slow');
    $("#game-over-kills").fadeIn('slow');
  });

  var wave_num;
  var mouseX = 0;
  var mouseY = 0;

	Crafty.scene("main", function() {
    $("#dude-canvas")
      .bind("mousemove", function(e) {
        mouseX = e.layerX || e.offsetX;
        mouseY = e.layerY || e.offsetY;
      })
      .bind("mousedown", function() {
        player.shootBullet();
      });


    // Set up event handling and wave changing 
    // based on song data.
    (function() {
      var $lightning = $("#dude-canvas");
      var $audio = $("#the-audio")[0];

      var segments = data.segments;
      var events = (function() {
        var normalizeSegmentsLoudness = function(segments, callback) {
          var min = 0;
          var max = 0;
          for (var i in segments) {
            var loudness = segments[i].loudness_max;
            if (loudness > max) {
              max = loudness;
            }
            if (loudness < min) {
              min = loudness;
            }
          }
          var range = max-min;
          var normalized = []
          for (var i in segments) {
            var n = (segments[i].loudness_max-min)/range;
            normalized.push(n);
          }
          return normalized;
        };
        var getLoudnessTimings = function(normalized) {
          var events = [];
          for (var i in segments) {
            if (segments[i].confidence > 0.5) {
              var start_time = segments[i].start;
              var loudness = normalized[i];
              var results = [start_time, loudness];
              events.push(results);
            }
          }
          return events;
        };
        return getLoudnessTimings(normalizeSegmentsLoudness(segments));
      })();
      var waves = (function() {
        var w = [];
        for (var i in data.sections) {
          var start_time = data.sections[i].start;
          w.push(start_time);
        }
        return w;
      })();
     
      var audioDuration = $audio.duration; 
      var $songCurrentTime = $("#song-current-time");
      $("#song-duration").text(~~(audioDuration));
      var counter = 0;
      var gameInterval = setInterval(function() {
        var audioTime = $audio.currentTime;
        if (window.Defense && !Defense.gameOver) {
          var opacity = parseFloat($lightning.css('opacity'));
          if (opacity > 0) {
            opacity -= 0.15;
            if (opacity <= 0.01) {
              opacity = 0;
            }
            $lightning.css({ 'opacity': opacity });
          }
          // $strobe.css({ 'background-color': 'black' });
        }
        if (audioTime > events[0][0]) {
          // console.log(events[0]+"");
          var loudness = events[0][1];
          // console.log(loudness);
          if (loudness >= 0.75) {
            Defense.spawnZombies(1,2);
            Defense.buffZombies();
            // $strobe.css({ 'background-color': 'white' });
            $lightning.css({ 'opacity': 0.4 });
          }
          events.shift();
        }
        if (audioTime > waves[0]) {
          Defense.nextWave();
          // console.log('NEXT WAVE!! - ' + Defense.wave);
          waves.shift();
        }

        // Check if game is over. Otherwise update time.
        if (counter % 10 == 0) {
          if (audioTime >= audioDuration-0.1) {
            Crafty.scene("you_win");
            clearInterval(gameInterval);
          } else {
            var seconds = ~~(audioTime);
            var minutes = ~~(seconds/60);
            seconds %= 60;
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            $songCurrentTime.text(minutes + ":" + seconds);
          }
        }
        counter += 1;
      }, 75);
    })();

    // Set up powerup and health spawns
    (function() {
      var getDropCoordinates = function() {
        return {
          x: Crafty.randRange(0+100, Crafty.viewport.width-100),
          y: Crafty.randRange(0+100, Crafty.viewport.height-100)
        }
      };
      var getTimeInterval = function() {
        return ~~(Math.random()*5000)+20000;
      };
      setTimeout(function() {
        Crafty.e("2D, DOM, powerup").attr(getDropCoordinates());
      }, 3000);

      var pSpawnNum = 0;
      var hSpawnNum = 0;

      var dropPowerup = function() {
        if (Defense.gameOver) {
          return;
        } else {
          if (pSpawnNum > 0) {
            Crafty.e("2D, DOM, powerup").attr(getDropCoordinates());
          } else {
            pSpawnNum++;
          }
          setTimeout(dropPowerup, getTimeInterval());
        }
      };
      var dropHealth = function() {
        if (Defense.gameOver) {
          return;
        } else {
          if (hSpawnNum > 0) {
            Crafty.e("2D, DOM, health").attr(getDropCoordinates());
          } else {
            hSpawnNum++;
          }
          setTimeout(dropHealth, getTimeInterval()*2);
        }
      };
      dropPowerup();
      dropHealth();
    })();

    // Status display items
    wave_num = Crafty.e("2D, DOM, Text")
      .text("Wave: 1")
      .attr({
        x: Crafty.viewport.width - 400,
        y: 25,
        w: 100,
        h: 25
      })
      .css({ color: '#fff' });

    var hp = Crafty.e("2D, DOM, Text")
      .text("HP: 100")
      .attr({
        x: Crafty.viewport.width - 320,
        y: 25,
        w: 100,
        h: 25
      })
      .css({ color: '#fff' });

		var kills = Crafty.e("2D, DOM, Text")
			.text("Kills: 0")
			.attr({
        x: Crafty.viewport.width - 240,
        y: 25,
        w: 100,
        h: 25
      })
			.css({color: "#fff"});

		var score = Crafty.e("2D, DOM, Text")
			.text("Score: 0")
			.attr({
        x: Crafty.viewport.width - 160,
        y: 25,
        w: 100,
        h: 25
      })
			.css({color: "#fff"});
		

		// The player entity
		var player = Crafty.e("2D, DOM, main1, Controls, Collision")
			.attr({
        _rotation: 0,
        move: {
          left: false,
          right: false,
          up: false,
          down: false
        },
        shooting: false,
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
          if (this.timers.shot + SHOT_DELAY > Crafty.frame()) {
            return;
          }
          var self = this;
          var createBullet = function(rotation, properties) {
            var c = "2D, DOM, Color, bullet";
            Crafty.e(c)
              .attr({
                x: self._x+SPRITE_DIMS/2,
                y: self._y+SPRITE_DIMS/2,
                w: 5, 
                h: 5, 
                rotation: rotation,
                xspeed: 20 * Math.sin(rotation / 57.3), 
                yspeed: 20 * Math.cos(rotation / 57.3),
                properties: properties || {},
                createFrame: Crafty.frame()
              })
              .color("rgb(255, 255, 0)")
              .bind("enterframe", function() {	
                this.x += this.xspeed;
                this.y -= this.yspeed;
                
                // Destroy if it goes out of bounds or is sticking around for some 
                // stupid reason
                if (Crafty.frame() % 60 === 0) {
                  if (Crafty.frame() > this.createFrame+300) {
                    console.log('WTF bullet');
                    this.destroy();
                  }
                  if (this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
                    this.destroy();
                  }
                }
              });
          };
          var frame = Crafty.frame();
					// Create a bullet entity
          // if (true) {
          if (this.powerups.scattershot > 0 && frame < this.powerups.scattershot + FPS*10) {
            createBullet(this._rotation);
            createBullet(this._rotation+3);
            createBullet(this._rotation-3);
          } else if (this.powerups.explosive > 0 && frame < this.powerups.explosive + FPS*10) {
            createBullet(this._rotation, { explosive: true });
          } else {
            createBullet(this._rotation);
          }
          this.timers.shot = frame;
        },
        takeDamage: function(damage) {
          player.hp -= damage;
          player.timers.invulnerable = Crafty.frame();
          hp.text("HP: "+player.hp);
          if (player.hp <= 0) {
            Crafty.scene("game_over");
          }
        },
        changePlayerComponent: function(component) {
          var components = ["main1","main2","main3","main4","main5","main6","main7","main8"];
          for (var i in components) {
            if (this.has(components[i])) {
              if (component != components[i]) {
                this.removeComponent(components[i]).addComponent(component);
              }
              break;
            }
          }
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
          this.shooting = true;
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
				} else if(e.keyCode === Crafty.keys.SPACE) {
          this.shooting = false;
        }
			}).bind("enterframe", function() {
        var slowFrame = Crafty.frame() % 5 == 0;
        if (slowFrame) {
          y_angle = -(mouseY-(this._y+24));
          x_angle = mouseX-(this._x+16);
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
          this.changePlayerComponent(function() {
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
        var max_speed = PLAYER_MAX_SPEED;
        
        this.xspeed *= this.decay;
        this.yspeed *= this.decay;

				if (this.move.up)     { this.yspeed = -max_speed; }
        if (this.move.down)   { this.yspeed =  max_speed; }
        if (this.move.left)   { this.xspeed = -max_speed; }
        if (this.move.right)  { this.xspeed =  max_speed; }
			
				// Move the x and y speeds or movement vector
        this.x = getBoundedX(this._x + this.xspeed);
        this.y = getBoundedY(this._y + this.yspeed);
				
        if (this.shooting && (Crafty.frame() > this.timers.shot + SHOT_DELAY)) {
          this.shootBullet();
        }
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
          this.takeDamage(10);
          this.xspeed *= 0.9;
          this.yspeed *= 0.9;
        }
			})
      .onHit("enemybullet", function(e) {
        // When hit by an enemy bullet
        e[0].obj.destroy();
        this.takeDamage(5);
      })
      .onHit("powerup", function(e) {
        // When a powerup is picked up
				e[0].obj.destroy();
        if (Math.random()>0.5) {
          player.powerups.scattershot = Crafty.frame();
        } else {
          player.powerups.explosive = Crafty.frame();
        }
      })
      .onHit("health", function(e) {
				e[0].obj.destroy();
        player.hp = 100;
        hp.text("HP: "+player.hp);
      });
		Defense.player = player;

		// Zombie component. Types: normal, tot, dog
		Crafty.c("zombie", {
			init: function() {
        if (Defense.wave >= 8 && enemyCounts.boss === 0) {
          this.zombie_type = "boss";
          this.removeComponent("smfront").addComponent("boss");
          enemyCounts.boss++;
        } else if (Defense.wave >= 2 && (Math.random()>0.5)) {
          this.zombie_type = "possessor";
          this.removeComponent("smfront").addComponent("possessor");
        } else if (Defense.wave >= 3 && enemyCounts.pumpkins < 3 && Math.random()>0.9) {
          this.zombie_type = "tot";
          this.removeComponent("smfront").addComponent("tot");
          enemyCounts.pumpkins++;
        } else if (Defense.wave >= 4 && Math.random()>0.9) {
          this.zombie_type = "dog";
          this.removeComponent("smfront").addComponent("dfront");
        } else if (Defense.wave >= 5 && enemyCounts.fireghosts < 2 && Math.random()>0.95) {
          this.zombie_type = "fireghost";
          this.removeComponent("smfront").addComponent("fireghost");
          enemyCounts.fireghosts++;
        } else {
          this.zombie_type = "normal";
        }
				this.origin("center");
				this.attr({
					x: Crafty.randRange(0, Crafty.viewport.width),
					y: Crafty.randRange(0, 100),
					xspeed: Crafty.randRange(-5, 1), 
					yspeed: Crafty.randRange(1, 1), 
					rspeed: 0,
          max_speed: ZOMBIE_MAX_SPEED,
          hp: ~~(Defense.wave/2),
          frameOffset: ~~(Math.random()*FPS),
          createFrame: Crafty.frame(),
          shootEnemyBullet: function(options) {
            var options = options || {};
            var color = options.color || "rgb(255,0,0)";

            var origin_x = this._x+SPRITE_DIMS/2;
            var origin_y = this._y+SPRITE_DIMS/2;

            if (options.direction) {
              var xv = options.direction[0];
              var yv = options.direction[1];
            } else {
              var xv = player._x-origin_x;
              var yv = -(player._y-origin_y);
            }
            var m = Math.sqrt(xv*xv+yv*yv);
            
            Crafty.e("2D, DOM, Color, enemybullet")
              .attr({
                x: origin_x,
                y: origin_y,
                w: 6,
                h: 6,
                xspeed: 7 * xv/m,
                yspeed: 7 * yv/m
              })
              .color(color)
              .bind("enterframe", function() {
                this.x += this.xspeed;
                this.y -= this.yspeed;
                
                // Destroy if it goes out of bounds
                if (Crafty.frame() % 60 === 0) {
                  if (Crafty.frame() > this.createFrame+300) {
                    console.log('WTF enemy bullet');
                    this.destroy();
                  }
                  if (this._x > Crafty.viewport.width || this._x < 0 || this._y > Crafty.viewport.height || this._y < 0) {
                    this.destroy();
                  }
                }
              });
          },
          changeEnemyComponent: function(components, component) {
            for (var i in components) {
              if (this.has(components[i])) {
                if (component != components[i]) {
                  this.removeComponent(components[i]).addComponent(component);
                }
                break;
              }
            }
          }
				});

        if (this.zombie_type === "boss") {
          this.max_speed *= 0.5;
          this.hp = 50;
        }
        if (this.zombie_type === "dog") {
          this.max_speed *= 2;
        } else if (this.zombie_type === "tot") {
          this.max_speed *= 1.2;
          this.hp += 3;
        } else if (this.zombie_type === "possessor") {
          this.max_speed = 0.1;
          this.hp += 1;
        } else if (this.zombie_type === "fireghost") {
          this.max_speed = 0.1;
          this.hp += 7;
        }
        Crafty.e("2D, DOM, fadeAway, poof").attr({ 
          x: this._x-12, y: this._y+12
        });
        this.bind("enterframe", function() {
					this.x += this.xspeed;
					this.y += this.yspeed;
          var abs_x = Math.abs(this.xspeed);
          var abs_y = Math.abs(this.yspeed);

          if (this.zombie_type === "dog") {
            var components = ["dfront","dleft","dback","dright"];
          } else if (this.zombie_type === "tot") {
            var components = ["tot","tot","tot","tot"];
          } else {
            var components = ["smfront","smleft","smback","smright"];
          }
          var frame = Crafty.frame();
          if (frame % FPS == 0) {
            // Change direction they're facing
            if (abs_x >= abs_y) {
              if (this.xspeed >= 0) {
                this.changeEnemyComponent(components, components[3]);
              } else {
                this.changeEnemyComponent(components, components[1]);
              }
            } else {
              if (this.yspeed >= 0) {
                this.changeEnemyComponent(components, components[0]);
              } else {
                this.changeEnemyComponent(components, components[2]);
              }
            }
          }
          if (frame % (FPS/10) == 0) {
            // Seek out the player!
            var x_dir = player.x-this.x;
            var y_dir = player.y-this.y;
            var m = Math.sqrt(x_dir*x_dir+y_dir*y_dir);
            if (m > 0.01) {
              this.xspeed = x_dir/m*this.max_speed;
              this.yspeed = y_dir/m*this.max_speed;
            }
          }
          this.x = getBoundedX(this._x);
          this.y = getBoundedY(this._y);
				}).collision()
				.onHit("bullet", function(e) {
          var takeDamage = function(hp) {
            this.hp -= hp;
            if (this.hp <= 0) {
              if (this.zombie_type === "normal") {
                player.score += 100;
                Crafty.e("2D, DOM, fadeAway, smcorpse").attr({ 
                  x: this._x, y: this._y+24
                });
              } else if (this.zombie_type === "tot") {
                player.score += 350;
                Crafty.e("2D, DOM, fadeAway, totcorpse").attr({ 
                  x: this._x, y: this._y
                });
                enemyCounts.pumpkins--;
              } else if (this.zombie_type === 'possessor') {
                player.score += 100;
                Crafty.e("2D, DOM, fadeAway, possessor").attr({
                  x: this._x, y: this._y
                });
              } else if (this.zombie_type === 'fireghost') {
                player.score += 500;
                Crafty.e("2D, DOM, fadeAway, fireghost").attr({
                  x: this._x, y: this._y
                });
                enemyCounts.fireghosts--;
              } else if (this.zombie_type === "dog") {
                player.score += 125;
                var components = ["dfront", "dleft", "dback", "dright"];
                for (var i in components) {
                  if (this.has(components[i])) {
                    Crafty.e("2D, DOM, fadeAway, " + components[i]).attr({
                      x: this._x, y: this._y
                    });
                    break;
                  }
                }
              }
              score.text("Score: "+player.score);
              Defense.zombieCount--;
              Defense.kills++;
              kills.text("Kills: "+Defense.kills);
              this.destroy();
            }
          };
          var bullet = e[0].obj;
          if (bullet.properties.explosive) {
            Crafty.e("2D, DOM, Collision, boom, fastFadeAway, explosion")
            .attr({
              x: this._x,
              y: this._y,
              w: 43,
              h: 56
            })
            .onHit("zombie", function(e) {
              takeDamage.call(e[0].obj, 0.1);
            });
          }
          bullet.destroy();
          takeDamage.call(this, 1);
          this.x -= 5*this.xspeed;
          this.y -= 5*this.yspeed;

					// Split into two zombies by creating another zombie
					// Crafty.e("2D, DOM, "+size+", Collision, zombie").attr({
          //   x: this._x, y: this._y
          // });
				})
        .onHit("zombieBuff", function(e) {
          if (this.zombie_type === 'normal') {
            if (this.max_speed < PLAYER_MAX_SPEED-0.75) {
              this.max_speed += 0.1;
            }
            this.x += 2*this.xspeed;
            this.y += 2*this.yspeed;
          } else if (this.zombie_type === 'dog') {
            if (this.max_speed < PLAYER_MAX_SPEED+1) {
              this.max_speed += 0.2;
            }
          } else if (this.zombie_type === 'tot') {
            this.shootEnemyBullet({ color: "#FBB117" });
          } else if (this.zombie_type === 'possessor') {
            var m = Math.sqrt(this.xspeed*this.xspeed+this.yspeed*this.yspeed);
            this.x += 25*this.xspeed/m;
            this.y += 25*this.yspeed/m;
            if (this.xspeed <= 0.5 && this.yspeed <= 0.5) {
              this.max_speed += 0.05;
            }
          } else if (this.zombie_type === 'fireghost') {
            var m = Math.sqrt(this.xspeed*this.xspeed+this.yspeed*this.yspeed);
            this.x += 30*this.xspeed/m;
            this.y += 30*this.yspeed/m;
            if (this.xspeed <= 1 && this.yspeed <= 1) {
              this.max_speed += 0.1;
            }
            this.shootEnemyBullet({ direction: [0.5,0.5] });
            this.shootEnemyBullet({ direction: [0.5,-0.5] });
            this.shootEnemyBullet({ direction: [-0.5,0.5] });
            this.shootEnemyBullet({ direction: [-0.5,-0.5] });
          } else if (this.zombie_type === 'boss') {
            if (this.hp < BOSS_HP) {
              this.hp += 2;
            }
          }
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
          if (this.opacity <= 0.031) {
            this.destroy();
          }
        });
      }
    });
		Crafty.c("fastFadeAway", {
      init: function() {
        this.opacity = 1;
        this.bind("enterframe", function() {
          this.opacity -= 0.1;
          $(this._element).css({ opacity: this.opacity });
          if (this.opacity <= 0.11) {
            this.destroy();
          }
        });
      }
    });
		
		// First level has between 3 and 5 zombies
		spawnZombies(3, 5);
	});
});
