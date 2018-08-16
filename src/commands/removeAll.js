const cache = require("../utils/cache");

module.exports = {
    name: "removeAll",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        cache.delTriggersOf(guild, user);
        cache.delIgnoresOf(guild, user);

        msg.channel.send(`All your triggers and ignores are reset`);
    }
};
