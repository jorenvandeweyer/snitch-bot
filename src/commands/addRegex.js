const cache = require("../utils/cache");

module.exports = {
    name: "addregex",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    vote: true,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        let result = await cache.setTrigger(guild, user, keyword, true);

        let message;
        if (result.added) {
            message = await msg.channel.send(`Added the RegExp **${keyword}** succesfully`);
        } else if (result.exists) {
            message = await msg.channel.send(`The RegExp **${keyword}** is already in your trigger list`);
        }

        // setTimeout(() => {
        //     if (msg.original.deletable) {
        //         msg.original.delete();
        //     }
        //     message.delete();
        // }, 3000);
    }
};
