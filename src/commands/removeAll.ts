import { Message } from "discord.js";

const cache = require("../utils/cache");
const STRINGS = require("../strings/index");

module.exports = {
    name: "removeall",
    guildOnly: true,
    usage: "[word]",
    args: 0,
    async execute (msg: Message) {
        const guild = msg.guild.id;
        const user = msg.author.id;

        cache.delTriggersOf(guild, user);
        cache.delIgnoresOf(guild, user);

        msg.channel.send(STRINGS.C_REMOVEALL_SUCCESS);
    }
};
