import { Message, TextChannel } from "discord.js";

const cache = require("../utils/cache");
const STRINGS = require("../strings/index");

module.exports = {
    name: "unwait",
    guildOnly: true,
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const channel = <TextChannel> msg.channel;
        const member = msg.member;

        let result = await cache.delWaiter(channel.id, member);

        if (result.deleted) {
            return await msg.channel.send(STRINGS.C_UNWAIT_SUCCESS.complete(channel.name));
        } else {
            return await msg.channel.send(STRINGS.C_UNWAIT_E_NOT_LISTED.complete(channel.name));
        }
    }
};
