import { Message } from "discord.js";

module.exports = async (msg:Message, str={}) => {
    if (typeof str === "string") {
        if (msg.guild.members.has(str)) return msg.guild.members.get(str);
        return await msg.guild.fetchMember(str).catch(() => null);
    } else {
        if (msg.mentions.members.size) return msg.mentions.members.first();
        const id = msg.command.params[0];
        if (msg.guild.members.has(id)) return msg.guild.members.get(id);
        return await msg.guild.fetchMember(id).catch(() => null);
    }
};
