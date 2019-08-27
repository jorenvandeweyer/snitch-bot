import { Message } from "discord.js";

const cache = require("../utils/cache");
const regex = require("../utils/regex");
const STRINGS = require("../strings/index");

module.exports = {
    name: "addregex",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    vote: false,
    async execute (msg: Message) {
        const guild = msg.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params.join(" ").toLowerCase();

        if (keyword.length >= 99) {
            return msg.channel.send(STRINGS.C_ADDREGEX_E_LENGTH);
        }

        if (!regex.isValid(keyword)) {
            return msg.channel.send(STRINGS.C_ADDREGEX_E_INVALID.complete(keyword));
        }

        if (!regex.isSafe(keyword)) {
            return msg.channel.send(STRINGS.C_ADDREGEX_E_UNSAFE.complete(keyword));
        }

        if (regex.matchesEverything(keyword)) {
            return msg.channel.send(STRINGS.C_ADDREGEX_E_MATCHES.complete(keyword));
        }

        let result = await cache.setTrigger(guild, user, keyword, true);

        if (result.added) {
            await msg.channel.send(STRINGS.C_ADDREGEX_SUCCESS.complete(keyword));
        } else if (result.exists) {
            await msg.channel.send(STRINGS.C_ADDREGEX_E_DUPLICATE.complete(keyword));
        }
    }
};
