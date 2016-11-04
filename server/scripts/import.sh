#!/bin/bash

docker-compose exec mongo mongoimport --drop -d dev -c songs --jsonArray --file=/code/mocks/songs.json
# docker-compose exec mongo mongoimport --drop -d dev -c playlists --jsonArray --file=/code/mocks/playlists.json

