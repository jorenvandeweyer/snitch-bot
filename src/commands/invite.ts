import { Message } from "discord.js";

const { RichEmbed } = require("discord.js");

module.exports = {
    name: "invite",
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const embed = new RichEmbed({
            title: "Invite",
            color: parseInt("FF0000", 16),
            description: `[click to invite me](https://discordapp.com/oauth2/authorize?client_id=${msg.client.user.id}&permissions=67497024&scope=bot)`
        });

        msg.author.send(embed);
    }
};
