// need a function where input artist/song is queried to echo and eventually an mp3 url is given as a response.
// if there are multiple matches, user can pick one.
//
//
API_KEY = 'PAHHVTZEZEZLX9WQB';

function get_song_id(artist, title) {
    $.ajax({
        url: 'http://developer.echonest.com/api/v4/song/search?api_key=' + API_KEY + '&format=json&results=5&artist='+encodeURIComponent(artist)+'&title='+encodeURIComponent(title),
        method: 'GET',
        success: function(data) {
                //for each song in results, show artist and title and a link to click and get the audio
            $("div#player ul").html('');
            for(var i=0; i < 5; i++) {
                console.log(data.response.songs[i].id);
                var url='http://t06a.hypem.com/sec/85ca98a0e39f004d2130413037a03969/4e6c1d28/archive/509/8/6f9033fb466412eb9893e75c83c2d2bd.mp3';
                //var url=get_song_url(data.response.songs[i].id);
                
                var choice = $('<li><a href="'+ url +'" id="'+data.response.songs[i].id+'">'+data.response.songs[i].artist_name +': '+ data.response.songs[i].title +'</a></li>');
                $('div#player ul').prepend(choice);
            };
        }
    });
};

function get_song_url(song_id) {
    /*$.getJSON('http://developer.echonest.com/api/v4/artist/audio?api_key=' + API_KEY + '&id=' + song_id + '&format=json&results=1&start=0',
            function(data) {
                console.log(data.response.audio.url);
            }
    );*/

    $.ajax({
        url:'http://developer.echonest.com/api/v4/artist/audio?api_key=' + API_KEY + '&id=' + song_id + '&format=json&results=1&start=0',
        header:{'Access-Control-Allow-Origin':'*'},
        success: function(data) {
            console.log(data.response.audio.url);
            //$('#url').html('<a href="'+ data.response.audio.url +'">' + artist + ': '+ song +'</a>');
        }
    });
   
};

$(document).ready(function() {
    $('#search_form').submit(function(e) {
        e.preventDefault();
        var artist = $('#artist').val();
        var title = $('#title').val();
        get_song_id(artist, title);
    });
});
