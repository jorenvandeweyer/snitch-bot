const db = require("../utils/database");
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "stats",
    usage: "",
    args: 0,
    async execute (msg) {
        const shard = msg.client.shard;

        const result = await db.query("SELECT COUNT(*) AS total FROM triggers");
        const members = await shard.broadcastEval("this.guilds.map(guild => guild.memberCount)").then(members => members.filter(arr => arr.length).map(arr => arr.reduce((total, num) => total + num)).reduce((total, num) => total + num));
        const guilds = await shard.broadcastEval("this.guilds.size").then(guilds => guilds.reduce((total, num) => total + num));

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
                },
            ]
        });

        msg.channel.send(embed);
    }
};
