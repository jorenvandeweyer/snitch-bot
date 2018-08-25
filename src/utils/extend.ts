import { Client, Event } from "discord.js";

const messageReaction = require("./extenders/messageReaction");
const { isCommand, search } = require("./extenders/Message");

const { Message } = require("discord.js");

module.exports = (client: Client) => {
    client.on("raw", (event:Event) => { messageReaction(client, event); });
};

Message.prototype.isCommand = isCommand;
Message.prototype.search = search;
