import { Message } from "discord.js";

const cache = require("../utils/cache");

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

        msg.channel.send("All your triggers and ignores are reset");
    }
};
