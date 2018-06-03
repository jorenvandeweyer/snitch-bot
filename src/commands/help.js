const { RichEmbed } = require("discord.js");

module.exports = {
    name: "help",
    usage: "",
    args: 0,
    async execute (msg) {
        const embed = new RichEmbed({
            title: "Help",
            color: parseInt("FF0000", 16),
            description: "**listen!add [word]**\n**listen!remove [word]**\n**listen!list**"
        });

        msg.member.send(embed);

        msg.original.delete();
    }
};
