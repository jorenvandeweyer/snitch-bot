const cache = require("../utils/cache");
const Logger = require("../utils/logger");

module.exports = {
    name: "add",
    usage: "[word]",
    args: 1,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params[0].toLowerCase();

        let result = await cache.setTrigger(guild, user, keyword);

        let message;
        if (result.added) {
            message = await msg.channel.send(`Added the word **${keyword}** succesfully`);
        } else if (result.exists) {
            message = await msg.channel.send(`The word **${keyword}** is already in your trigger list`);
        }

        setTimeout(() => {
            msg.original.delete().catch(e => Logger.error(e));
            message.delete();
        }, 3000);
    }
};
