import { Message } from "discord.js";

const { RichEmbed } = require("discord.js");
const STRINGS = require("../strings/index");

module.exports = {
    name: "invite",
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const embed = new RichEmbed({
            title: "Invite",
            color: parseInt("FF0000", 16),
            description: STRINGS.INVITE_URL.complete(msg.client.user.id)
        });

        msg.author.send(embed);
    }
};
