const { RichEmbed } = require("discord.js");

module.exports = {
    name: "help",
    usage: "",
    args: 0,
    async execute (msg) {
        const embed = new RichEmbed({
            title: "Help",
            color: parseInt("FF0000", 16),
            description: "**\nlisten!add [word]**\n\n**listen!remove [word]**\n\n**listen!addRegex [regexp]**\n\n**listen!removeRegex [regexp]**\n\n**listen!list**\n\n**listen!invite**\n\n**listen!stats**"
        });

        msg.author.send(embed);
        if (msg.original.deletable) {
            msg.original.delete();
        }
    }
};
