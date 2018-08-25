import { Message } from "discord.js";

const cache = require("../utils/cache");
const STRINGS = require("../strings/index");

module.exports = {
    name: "remove",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    async execute (msg: Message) {
        const guild = msg.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        let result = await cache.delTrigger(guild, user, keyword, false);

        if (result.deleted) {
            await msg.channel.send(STRINGS.C_REMOVE_SUCCESS.complete(keyword));
        } else {
            await msg.channel.send(STRINGS.C_REMOVE_E_NOT_LISTED.complete(keyword));
        }
    }
};
