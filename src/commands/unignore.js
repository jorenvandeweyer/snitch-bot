const cache = require("../utils/cache");
const member = require("../utils/extractors/member");

module.exports = {
    name: "unignore",
    guildOnly: true,
    usage: "[user_id or username]",
    args: 1,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const user = msg.author.id;

        const ignore_member = await member(msg);

        if (!ignore_member) {
            return await msg.channel.send("This is not a valid member");
        }

        let result = await cache.delIgnore(guild, user, ignore_member.user.id);

        if (result.deleted) {
            await msg.channel.send(`You unignored **${ignore_member.user.tag}**`);
        } else {
            await msg.channel.send(`You are not ignoring **${ignore_member.user.tag}**`);
        }
    }
};
