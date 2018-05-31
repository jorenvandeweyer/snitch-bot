const cache = require("../utils/cache");

module.exports = {
    name: "add",
    usage: "[word]",
    args: 1,
    async execute () {
        const guild = this.channel.guild.id;
        const user = this.author.id;
        const keyword = this.command.params[0].toLowerCase();

        let result = await cache.setTrigger(guild, user, keyword);

        let message;
        if (result.added) {
            message = await this.channel.send(`Added the word **${keyword}** succesfully`);
        } else if (result.exists) {
            message = await this.channel.send(`The word **${keyword}** is already in your trigger list`);
        }

        setTimeout(() => {
            this.original.delete();
            message.delete();
        }, 3000);
    }
};
