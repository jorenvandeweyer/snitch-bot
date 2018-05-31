const { RichEmbed } = require("discord.js");

module.exports = {
    name: "help",
    usage: "",
    args: 0,
    async execute () {
        const embed = new RichEmbed({
            title: "Help",
            color: parseInt("FF0000", 16),
            description: "**listen!add [word]**\n**listen!remove [word]**\n**listen!list**"
        });

        this.member.send(embed);

        this.original.delete();
    }
};
