# TeamBot
A discord bot that helps with effective scheduling between teams

Teambot is no longer hosted by me, but anyone is free to host it themselves.

### Setting up the bot
You will need NodeJS to run this bot
-Download this repo to your disk by either running ```git clone``` or downloading a zip of the source code.
-Create an application under https://discord.com/developers and create a bot
-Fill out the .env with it's respective properties. Required properties are ```TOKEN``` ```DATABASE_URL``` and ```APPLICATION_ID```. Token and AppID can be found in your discord application.
-Install dependencies with ```npm install```
-Make sure typescript is installed with ```npm install -g typescript```

### Running the bot
-To run the bot on a local machine/personal PC, just navigate to the bot's directory and run ```npm start```
-If you wish to run this bot via an ssh session, you will have to make sure it does not terminate when you logout of SSH. 
ON LINUX: prefix ```nohup``` to ```npm start```. Full command is ```nohup npm start```

Feel free to DM me with any troubles on discord @ryguy10712



