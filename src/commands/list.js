const cache = require("../utils/cache");

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
            message = await this.channel.send(`List of your triggers:\n${result.map(row => row.keyword).join(", ")}`);
        } else {
            message = await this.channel.send(`You don't have any triggers`);
        }

        setTimeout(() => {
            this.original.delete();
            message.delete();
        }, 3000);
    }
};
