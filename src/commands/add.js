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

        if (keyword.length >= 99) {
            return msg.channel.send("Your word can't exceed the 99 character limit");
        }

        let result = await cache.setTrigger(guild, user, keyword, false);

        if (result.added) {
            await msg.channel.send(`Added the word **${keyword}** succesfully`);
        } else if (result.exists) {
            await msg.channel.send(`The word **${keyword}** is already in your trigger list`);
        }
    }
};
