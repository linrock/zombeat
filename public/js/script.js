$(function() {
  if (Modernizr.audio.ogg) {
    console.log('HTML5 audio is supported!');
    Defense.loadScene("intro");
  } else {
    console.log('HTML5 audio unsupported!');
    Defense.loadScene("unsupported");
  }
});

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
