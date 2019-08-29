import { Message, TextChannel } from "discord.js";

const cache = require("../utils/cache");
const STRINGS = require("../strings/index");

module.exports = {
    name: "wait",
    guildOnly: true,
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const channel = <TextChannel> msg.channel;
        const member = msg.member;

        let result = await cache.setWaiter(channel.id, member);

        if (result.added) {
            return await msg.channel.send(STRINGS.C_WAIT_SUCCESS.complete(channel.name));
        } else if (result.exists) {
            return await msg.channel.send(STRINGS.C_WAIT_E_DUPLICATE.complete(channel.name));
        }
    }
};
