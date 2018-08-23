import { Message } from "discord.js";

const cache = require("../utils/cache");
const member = require("../utils/extractors/member");
const STRINGS = require("../strings/index");

module.exports = {
    name: "ignore",
    guildOnly: true,
    usage: "[user_id or username]",
    args: 1,
    async execute (msg: Message) {
        const guild = msg.guild.id;
        const user = msg.author.id;

        const ignore_member = await member(msg);

        if (!ignore_member) {
            return await msg.channel.send(STRINGS.INVALID_MEMBER);
        }

        let result = await cache.setIgnore(guild, user, ignore_member.user.id);

        if (result.added) {
            await msg.channel.send(STRINGS.C_IGNORE_SUCCESS.complete(ignore_member.user.tag));
        } else if (result.exists) {
            await msg.channel.send(STRINGS.C_IGNORE_E_DUPLICATE.complete(ignore_member.user.tag));
        }
    }
};
