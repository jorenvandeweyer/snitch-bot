const cache = require("../utils/cache");

module.exports = {
    name: "add",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        let result = await cache.setTrigger(guild, user, keyword, false);

        let message;
        if (result.added) {
            message = await msg.channel.send(`Added the word **${keyword}** succesfully`);
        } else if (result.exists) {
            message = await msg.channel.send(`The word **${keyword}** is already in your trigger list`);
        }

        // setTimeout(() => {
        //     if (msg.deletable) {
        //         msg.delete();
        //     }
        //     message.delete();
        // }, 3000);
    }
};
