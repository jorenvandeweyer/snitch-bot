import { Message } from "discord.js";

const { RichEmbed } = require("discord.js");
const STRINGS = require("../strings/index");

module.exports = {
    name: "help",
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const embed = new RichEmbed({
            title: "Help",
            color: parseInt("FF0000", 16),
            description: STRINGS.HELP.join("\n"),
            url: "https://dupbit.com/snitch"
        });

        msg.author.send(embed);
    }
};
