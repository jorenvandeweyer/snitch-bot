import { GuildMember } from "discord.js";

const cache = require("../cache");

module.exports = async (member:GuildMember) => {
    cache.delTriggersOf(member.guild.id, member.id);
    cache.delIgnoresOf(member.guild.id, member.id);
};
