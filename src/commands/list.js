const cache = require("../utils/cache");
const member = require("../utils/extractors/member");

module.exports = {
    name: "list",
    guildOnly: true,
    usage: "",
    args: 0,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;

        let triggers = await cache.getTriggers(guild, user);
        let ignores = await cache.getIgnores(guild, user);

        if (ignores.length) {
            ignores = await Promise.all(ignores.map(row => member(msg, row.user)));
        }

        if (triggers.length) {
            await msg.member.send(`**List of your triggers:**\n${
                triggers.map(row => "`" + row.keyword + "`" + (row.regex ? "  (R)" : "")).join("\n")
            }${
                ignores.length ? `\n\n**Ignoring**:\n${ignores.map(member => member.user.tag).join("\n")}` : ""
            }`);
        } else {
            await msg.member.send("You don't have any triggers");
        }
    }
};
