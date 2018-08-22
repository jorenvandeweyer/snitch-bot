import { Message } from "discord.js";

const { RichEmbed } = require("discord.js");
const commands = [
    "**listen!add [word]**",
    "**listen!remove [word]**",
    "",
    "**listen!addRegex [regexp]**",
    "**listen!removeRegex [regexp]**",
    "",
    "**listen!removeAll**",
    "",
    "**listen!ignore [userid]**",
    "**listen!unignore [userid]**",
    "",
    "**listen!list**",
    "",
    "**listen!invite**",
    "**listen!stats**",
    "",
    "Alternative prefixes",
    "`l!`, `listen!`"
];

module.exports = {
    name: "help",
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const embed = new RichEmbed({
            title: "Help",
            color: parseInt("FF0000", 16),
            description: commands.join("\n"),
            url: "https://dupbit.com/snitch"
        });

        msg.author.send(embed);
    }
};
