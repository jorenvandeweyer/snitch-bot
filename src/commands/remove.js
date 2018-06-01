const cache = require("../utils/cache");
const Logger = require("../utils/logger");

module.exports = {
    name: "remove",
    usage: "[word]",
    args: 1,
    async execute () {
        const guild = this.channel.guild.id;
        const user = this.author.id;
        const keyword = this.command.params[0].toLowerCase();

        let result = await cache.delTrigger(guild, user, keyword);

        let message;

        if (result.deleted) {
            message = await this.channel.send(`Removed the word **${keyword}** succesfully`);
        } else {
            message = await this.channel.send(`The word **${keyword}** is not on your trigger list`);
        }

        setTimeout(() => {
            this.original.delete().catch(e => Logger.error(e));
            message.delete();
        }, 3000);
    }
};
