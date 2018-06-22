const db = require("../utils/database");
const Logger = require("../utils/logger");
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "stats",
    usage: "",
    args: 0,
    async execute (msg) {
        const guild = msg.channel.guild.id;
        const result = await db.query("SELECT COUNT(*) AS total FROM triggers");

        let members = 0;
        for (let guild of msg.original.client.guilds) {
            members+=guild[1].memberCount;
        }

        const embed = new RichEmbed({
            title: "💾 Stats 💾",
            color: parseInt("FF0000", 16),
            fields: [
                {
                    name: "💥 Triggers 💥",
                    value: `Listening to **${result[0].total}** triggers!`,
                    inline: true,
                },
                {
                    name: "👥 Guilds 👥",
                    value: `Listening in **${msg.original.client.guilds.size}** guilds!`,
                    inline: true,
                },
                {
                    name: "👤 Users 👤",
                    value: `Listening to **${members}** users!`,
                    inline: false,
                }
            ]
        });

        msg.channel.send(embed);
    }
};
