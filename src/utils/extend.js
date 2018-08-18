const messageReaction = require("./extenders/messageReaction");
const { isCommand, search } = require("./extenders/Message");

const { Message } = require("discord.js");

module.exports = (client) => {
    client.on("raw", event => { messageReaction(client, event); });
};

Message.prototype.isCommand = isCommand;
Message.prototype.search = search;
