import { Message } from "discord.js";

const cache = require("../utils/cache");
const STRINGS = require("../strings/index");

module.exports = {
    name: "add",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    async execute (msg: Message) {
        const guild = msg.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        if (keyword.length >= 99) {
            return msg.channel.send(STRINGS.COMMAND_ADD_ERROR_MAX_LENGTH);
        }

        let result = await cache.setTrigger(guild, user, keyword, false);

        if (result.added) {
            await msg.channel.send(STRINGS.COMMAND_ADD_SUCCESS.complete(keyword));
        } else if (result.exists) {
            await msg.channel.send(STRINGS.COMMAND_ADD_ERROR_EXISTS.complete(keyword));
        }
    }
};
