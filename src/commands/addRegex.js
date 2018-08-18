const cache = require("../utils/cache");
const regex = require("../utils/regex");

module.exports = {
    name: "addregex",
    guildOnly: true,
    usage: "[word]",
    args: 1,
    vote: true,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;
        const keyword = msg.command.params.join(" ").toLowerCase();

        if (keyword.length >= 99) {
            return msg.channel.send("Your regex can't exceed the 99 character limit");
        }

        if (!regex.isValid(keyword)) {
            return msg.channel.send(`\`${keyword}\` is not a valid RegExp.`);
        }

        if (!regex.isSafe(keyword)) {
            return msg.channel.send(`The RegExp \`${keyword}\` is not supported by Snitch. It got flagged as a malicious RegExp, if you think this is a false positive, please report this to Ecstabis#0001 so it can be whitelisted.`);
        }

        if (regex.matchesEverything(keyword)) {
            return msg.channel.send(`The RegExp \`${keyword}\` matches to much cases and got flagged as malicious,  if you think this is a false positive, please report this to Ecstabis#0001 so it can be whitelisted.`);
        }

        let result = await cache.setTrigger(guild, user, keyword, true);

        if (result.added) {
            await msg.channel.send(`Added the RegExp \`${keyword}\` succesfully`);
        } else if (result.exists) {
            await msg.channel.send(`The RegExp \`${keyword}\` is already in your trigger list`);
        }
    }
};
