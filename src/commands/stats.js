const db = require("../utils/database");
const Logger = require("../utils/logger");
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "stats",
    usage: "",
    args: 0,
    async execute (msg) {
        const client = msg.original.client;

        const result = await db.query("SELECT COUNT(*) AS total FROM triggers");
        const members_all = await client.broadcast({ request: "members" });
        const guilds_all = await client.broadcast({ request: "guilds" });

        let members, guilds;
        if (members_all.success) members = members_all.results.map(result => result.data.members).reduce((total, num) => total + num);
        if (guilds_all.success) guilds = guilds_all.results.map(result => result.data.guilds).reduce((total, num) => total + num);

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
                    value: `Listening in **${guilds}** guilds!`,
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
