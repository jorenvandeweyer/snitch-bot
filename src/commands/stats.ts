import { Message } from "discord.js";

const db = require("../utils/database");
const { RichEmbed } = require("discord.js");
const STRINGS = require("../strings/index");

module.exports = {
    name: "stats",
    usage: "",
    args: 0,
    async execute (msg: Message) {
        const shard = msg.client.shard;

        const result = await db.query("SELECT COUNT(*) AS total FROM triggers");
        const members = await shard.broadcastEval("this.guilds.map(guild => guild.memberCount)").then(members => members.filter(arr => arr.length).map(arr => arr.reduce((total:number, num:number) => total + num)).reduce((total, num) => total + num));
        const guilds = await shard.broadcastEval("this.guilds.size").then(guilds => guilds.reduce((total:number, num:number) => total + num));

        const embed = new RichEmbed({
            title: STRINGS.C_STATS_TITLE,
            color: parseInt("FF0000", 16),
            fields: [
                {
                    name: STRINGS.C_STATS_TITLE_TRIGGERS,
                    value: STRINGS.C_STATS_CONTENT_TRIGGERS.complete(result[0].total),
                    inline: true,
                },
                {
                    name: STRINGS.C_STATS_TITLE_GUILDS,
                    value: STRINGS.C_STATS_CONTENT_GUILDS.complete(guilds),
                    inline: true,
                },
                {
                    name: STRINGS.C_STATS_TITLE_USERS,
                    value: STRINGS.C_STATS_CONTENT_USERS.complete(members),
                    inline: false,
                },
            ]
        });

        msg.channel.send(embed);
    }
};
