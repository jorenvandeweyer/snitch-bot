const cache = require("../utils/cache");
const Logger = require("../utils/logger");

module.exports = {
    name: "list",
    usage: "",
    args: 0,
    async execute () {
        const guild = this.channel.guild.id;
        const user = this.author.id;

        let result = await cache.getTrigger(guild, user);

        let message;

        if (result.length) {
            message = await this.member.send(`List of your triggers:\n${result.map(row => row.keyword).join(", ")}`);
        } else {
            message = await this.member.send(`You don't have any triggers`);
        }

        this.original.delete().catch(e => Logger.error(e));
    }
};
