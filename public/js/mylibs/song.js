var API_KEY = 'PAHHVTZEZEZLX9WQB';

var artist = 'system of a down';
var title = 'needles';


var get_songs = function() {
  var url = '/api/v4/song/search?api_key=' + API_KEY + '&format=json&results=5&artist='+encodeURIComponent(artist)+'&title='+encodeURIComponent(title);
  console.log('fetching...');
  $.getJSON(url, function(data) {
    if (data && data.response) {
      console.dir(data);
      var songs = data.response.songs;
      if (songs.length > 0) {
        var id = songs[0].id 
        get_song_by_id(id);
      }
    } else {
      console.log('SHIT');
    }
  });
};

var get_song_by_id = function(id) {
  var id = 'TRXXHTJ1294CD8F3B3';
  var url = '/api/v4/track/analyze';
  var data = {
    api_key: API_KEY,
    format: 'json',
    id: id,
    bucket: 'audio_summary'
  };
  console.log('getting song info for ' + id + '...');
  $.ajax({
    type: 'POST',
    url: url,
    data: data,
    success: function(data) {
      console.dir(data);
    }
  });
};
