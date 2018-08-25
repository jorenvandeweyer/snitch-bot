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
            return msg.channel.send(STRINGS.C_ADD_E_LENGTH);
        }

        let result = await cache.setTrigger(guild, user, keyword, false);

        if (result.added) {
            return await msg.channel.send(STRINGS.C_ADD_SUCCESS.complete(keyword));
        } else if (result.exists) {
            return await msg.channel.send(STRINGS.C_ADD_E_DUPLICATE.complete(keyword));
        }
    }
};
