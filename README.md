# TeamBot
A discord bot that helps with effective scheduling between teams

Github formatting is annoying, please read this here:  https://github.com/Ryguy10712/TeamBot/blob/main/README.md?plain=1
BE SURE TO CHECK OUT THE DEVELOPMENT BRANCH


PLANNED FEATURES
-Preferences
Captains can set preferences for their team such as the minimum amount of players they'd like available for a match (i.e some captains want to have at least 6 players available just in case one guy disconnects or has their headset die), wether or not they want to recive scheduling requests, how long before a match they'd like to be reminded, favorite server, etc. 

-Make requests to other team captains for scrims, matches and challenges for a specific day.
Once this request is accepted by a captain, individual team members on both teams can show their availability throughout the day, and the bot will give a list of times where both teams have their prefered amount of players ready for a match.

-Elo & League Points calculator


POSSIBLE FEATURES
-Scheduling takes account for occupied servers
The bot will show what servers are taken by looking at scheduled times by other teams. Do not rely on this as the #confirmed-times channel in the PCL discord where servers are officially occupied.


HOW TO CONTRIBUTE
-This bot is designed with various class templates (abstract classes) to streamline the devlopment process

-Making Slash commands
Slash commands can be made by making an instance of the DiscordCommand class (located at ./src/discord/DiscordCommand.ts). You can set command properties through "this.properties" and write the code under executeInteraction(client, Interaction). Once done, make sure to run registerCommand(new DiscordCommand()) in the TeamBot constructor to properly register the command with the DiscordAPI application. (May change to an automated directory checking system in the future)

-Making listeners
Listeners can be made through instances of the Discord Listener class (located at ./src/discord/DiscordListener). Look at ReadyListener (located at ./src/discord/Listeners/ReadyListener.ts) for example.



HOW TO RUN/TEST
-Have node.js installed
To install the dependencies (located in package.json)
    npm install

You can test this bot through ts-node (typescript runtinme) or tsc (typescript compiler), but before making pull requests BE SURE that the bot runs properly with the typescript compiler.
To test via ts-node you can either run this in the terminal:
    ts-node ./src/Bot.ts
Or run the Development Debug configuration provided in ./vscode/launch.json

To test/run compiled typescript (tsc) you need to build first by either runinng this in the terminal
    tsc ./src/Bot.ts
Or running "tsc build" by pressing Ctrl+Shift+B on your keybaord. Once the program is compiled, you can run it by either running
    node ./dist/Bot.js
Or by running Production Launch provided in ./vscode/launch.json


