#!/bin/bash

# first arg is path of ogg, 2nd is name of output file (e.g. track title)
api_key="PAHHVTZEZEZLX9WQB"
echo "Uploading to echonest..."
track_id=`curl -F "api_key=$api_key" -F "filetype=ogg" -F "track=@$1" "http://developer.echonest.com/api/v4/track/upload" | python id_parse.py`
echo "Analyzing track"
alink=`curl -F "api_key=${api_key}" -F "format=json" -F "id=$track_id" -F "bucket=audio_summary" "http://developer.echonest.com/api/v4/track/analyze" | python link_parse.py`
echo "Fetching track analysis"
curl "$alink" > $2.js
echo "Converting to JS" 
echo "var data="|cat - $2.js > tmp && mv tmp $2.js
