import { Guild } from "discord.js";
const cache = require("../cache");

module.exports = async (guild: Guild) => {
    if (!guild.available) return;

    cache.delGuild(guild.id);
};
