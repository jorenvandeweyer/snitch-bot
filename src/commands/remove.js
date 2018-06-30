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

        let result = await cache.delTrigger(guild, user, keyword);

        let message;

        if (result.deleted) {
            message = await msg.channel.send(`Removed the word **${keyword}** succesfully`);
        } else {
            message = await msg.channel.send(`The word **${keyword}** is not on your trigger list`);
        }

        setTimeout(() => {
            if (msg.original.deletable) {
                msg.original.delete();
            }
            message.delete();
        }, 3000);
    }
};
