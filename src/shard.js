const Discord = require('discord.js');
const MessageHandler = require("./utils/messageHandler");
const Logger = require("./utils/logger");
const discordbots = require("./utils/discordbots");

const client = new Discord.Client();

client.on('ready', () => {
    Logger.info(`Logged in as ${client.user.tag}!`);
    discordbots(client);
});

client.on('message', msg => {
    MessageHandler(msg)
});

client.on("guildCreate", () => {
    discordbots(client);
});

client.login();
