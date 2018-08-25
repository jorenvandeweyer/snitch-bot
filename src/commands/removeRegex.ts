import { Message } from "discord.js";

const cache = require("../utils/cache");
const STRINGS = require("../strings/index");

module.exports = {
    name: "removeregex",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    vote: true,
    async execute (msg: Message) {
        const guild = msg.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params.join(" ").toLowerCase();

        let result = await cache.delTrigger(guild, user, keyword, true);

        if (result.deleted) {
            await msg.channel.send(STRINGS.C_REMOVEREGEX_SUCCESS.complete(keyword));
        } else {
            await msg.channel.send(STRINGS.C_REMOVEREGEX_E_NOT_LISTED.complete(keyword));
        }
    }
};
