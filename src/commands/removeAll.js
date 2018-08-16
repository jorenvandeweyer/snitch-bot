const cache = require("../utils/cache");

module.exports = {
    name: "remove",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        let result = await cache.delTriggersOf(guild, user);
        let result = await cache.delIgnoresOf(guild, user);

        msg.channel.send(`All your triggers and ignores are reset`);
    }
};
