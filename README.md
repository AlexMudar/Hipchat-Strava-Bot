# A Strava Hipchat Bot

The Strava Hipchat bot utilizes the "build your own integration" opion in Hipchat. When a request is made via a slash command, for example /strava, the hipchat bot requests the relevant information from Strava's api and posts it back to Hipchat.

Development
To get up and running on your local machine you'll need to install Node, NPM, and the Heroku toolbelt. 
You'll also need to create a new file in the same directory as the source named .env no file name just .env . This should include several environmental variables, like a token for accessing Strava's api and a token for posting to Hipchat. It will look something like this:

StravaToken=
hipChatCyclingTest=
hipChatCycling=
hipChatRunning=

For developing at Quicken, contact Alex Mudar for a completed .env file. This is done to avoid posting sensitive cridentials into public source control. 
When all that is in order, from the command line in the same folder as source type "heroku local web" wait a second and it will launch the application localy. To test use postman or another tool to post to http://localhost:5000/running with any valid json. This {} will work. 

If all this sounds too foreboding but you'd still like to try out an idea, make blind changes and we can test them on my machine before deploying. 