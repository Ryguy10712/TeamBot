# TeamBot
A discord bot that helps with effective scheduling between teams


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


