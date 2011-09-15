#!/bin/bash

# first arg is url of mp3, 2nd is name of output file (e.g. track title)
# i.e. ./link2data.sh http://example.com/title.mp3 title

api_key="PAHHVTZEZEZLX9WQB"
echo "Downloading $1"
wget $1
echo "Uploading to echonest..."
upload=`curl -X POST "http://developer.echonest.com/api/v4/track/upload" -d "api_key=${api_key}&url=${1}" | python id_parse.py`
#upload="curl -X POST \"http://developer.echonest.com/api/v4/track/upload\" -d \"api_key=${api_key}&url=${1}\" | python id_parse.py"
#eval "$upload"
echo "Analyzing track"
alink=`curl -F "api_key=${api_key}" -F "format=json" -F "id=$upload" -F "bucket=audio_summary" "http://developer.echonest.com/api/v4/track/analyze" | python link_parse.py`
echo "Fetching track analysis"
curl "$alink" > $2.js
echo "Converting to JS" 
echo "var data="|cat - $2.js > tmp && mv tmp $2.js
