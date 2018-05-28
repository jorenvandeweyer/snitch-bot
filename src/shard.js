const Discord = require('discord.js');
const MessageHandler = require("./utils/messageHandler");
const Logger = require("./utils/logger");

const client = new Discord.Client();

client.on('ready', () => {
    Logger.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    MessageHandler(msg)
});

client.login();
