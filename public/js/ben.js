// need a function where input artist/song is queried to echo and eventually an mp3 url is given as a response.
// if there are multiple matches, user can pick one.
//
//
API_KEY = 'PAHHVTZEZEZLX9WQB';

function get_song_id(artist, title) {
    $.ajax({
        url: '/api/v4/song/search?api_key=' + API_KEY + '&format=json&results=5&artist='+encodeURIComponent(artist)+'&title='+encodeURIComponent(title),
        method: 'GET',
        success: function(data) {
                //for each song in results, show artist and title and a link to click and get the audio
            $("div#player ul").html('');
            console.dir(data.response);
            for(var i=0; i < data.response.songs.length; i++) {
                var url='http://akjigga.com/wp-content/uploads/2011/07/Digital-Love-ALGERONICS-remix.mp3';
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
        url:'/api/v4/artist/audio?api_key=' + API_KEY + '&id=' + song_id + '&format=json&results=1&start=0',
        success: function(data) {
            console.log(data.response.audio.url);
            //$('#url').html('<a href="'+ data.response.audio.url +'">' + artist + ': '+ song +'</a>');
        }
    });
   
};

function get_song_analysis_link() {
    var id='TRXXHTJ1294CD8F3B3';
   $.ajax({
            type:'POST',
            //contentType:'multipart/form-data',
            data: {
                'api_key': API_KEY,
                'format':'json',
                'id':id,
                'bucket':'audio_summary'
            },
            url:'/api/v4/track/analyze',
           success: function(data) {
                console.log(data.response.track.audio_summary.analysis_url);
            //    song_analysis(data.response.track.audio_summary.analysis_url);
            }
    }); 
};

function song_analysis(analysis_url) {
  $.ajax({
        url:analysis_url,
        success: function(data){
            console.log(data)
        }
    });  
};

$(document).ready(function() {
    $('#search_form').submit(function(e) {
        e.preventDefault();
        var artist = $('#artist').val();
        var title = $('#title').val();
        get_song_id('muse','starlight'); //artist, title);
    });
});
