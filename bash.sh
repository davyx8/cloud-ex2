#!/bin/bash

#this adds a new user to DB
curl -X POST davyx8.cloudapp.net/newUser -d "username=yossarian&password=22&ContentType=application/json"


# this logs us in
curl -X POST davyx8.cloudapp.net/login -d "username=yossarian&password=22"

#this adds a new album to the user (provided user is authenticated off course)
curl -X POST -d "username=yossarian2&password=22&ContentType=application/json" davyx8.cloudapp.net/createNewAlbum/yossarian/australia



#and another!
curl -X POST -d "username=yossarian2&password=22&ContentType=application/json" davyx8.cloudapp.net/createNewAlbum/yossarian/newzealand



#add a user with read permissions

curl -X POST davyx8.cloudapp.net/australia/addUserRead/mcwatt -v --cookie "username=yossarian"


#add a user with read\write permissions

curl -X POST davyx8.cloudapp.net/australia/addUserWrite/Or -v --cookie "username=yossarian"

#adds an image 
curl -X POST davyx8.cloudapp.net/albums/australia/yossarian/upload -v --cookie "username=yossarian" -d "username=yossarian2&password=22&ContentType=application/json" -H "filename=@sydney.jpg"

#and another
curl -X POST davyx8.cloudapp.net/albums/australia/yossarian/upload -v --cookie "username=yossarian" -d "username=yossarian2&password=22&ContentType=application/json" -H "filename=@brisbane.jpg" 

#get all the albums webpage 
#curl davyx8.cloudapp.net/yossarian/australia/ -v --cookie "username=yossarian"
#get all the albums webpage 
#curl davyx8.cloudapp.net/australia/images -v --cookie "username=yossarian"
