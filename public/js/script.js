if (Modernizr.audio.ogg) {
  console.log('HTML5 audio is supported!');
}

var segments = data.segments;
var events = [];

var normalizeSegments = function() {


};

for (var i in segments) {
  if (segments[i].confidence > 0.5) {
    var start_time = segments[i].start;
    var loudness = segments[i].loudness_max;
    var results = [start_time, loudness];
    events.push(results);
  }
}
var waves = [];
for (var i in data.sections) {
  var start_time = data.sections[i].start;
  waves.push(start_time);
}
// var $strobe = $(".strobe");
var $lightning = $("#dude-canvas");
var $audio = $("#the-audio")[0];

// timeupdate is once every 250ms or so. Better way would be to use
// setInterval and polling as a way of checking the current time.
// $("#the-audio").bind('timeupdate', function() {});

setInterval(function() {
  var time = $audio.currentTime;
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
  if (time > events[0][0]) {
    // console.log(events[0]+"");
    var amplitude = events[0][1];
    if (amplitude >= -5) {
      Defense.spawnZombies(1,2);
      // $strobe.css({ 'background-color': 'white' });
      $lightning.css({ 'opacity': 0.4 });
    }
    events.shift();
  }
  if (time > waves[0]) {
    Defense.nextWave();
    console.log('NEXT WAVE!! - ' + Defense.wave);
    waves.shift();
  }
}, 75);

$("#the-audio")
  .bind('play', function() {
    Defense.songStarted = true;
    if (Crafty._paused === true) {
      Crafty.pause();
    }
  })
  .bind('pause', function() {
    if (Crafty._paused === false || typeof Crafty._paused === 'undefined') {
      Crafty.pause();
    }
  });
