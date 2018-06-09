const Discord = require('discord.js');
const MessageHandler = require("./utils/listeners/messageHandler");
const ReactionHandler = require("./utils/listeners/reactionHandler");
const Logger = require("./utils/logger");
const discordbots = require("./utils/discordbots");

const client = new Discord.Client();

client.on('ready', () => {
    Logger.info(`Logged in as ${client.user.tag}!`);
    discordbots(client);
    client.user.setActivity("your messages | listen!help", {
        type: "WATCHING"
    });
});

client.on("guildCreate", () => {
    discordbots(client);
});

client.on('message', MessageHandler);
client.on("messageReactionAdd", ReactionHandler);

client.login();
