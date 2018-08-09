const EnrichMessage = require("../enrichMessage");
const Logger = require("../logger");
const { RichEmbed } = require("discord.js");
const cache = require("../cache");
const Stats = require("../metrics/stats");

module.exports = async (msg) => {
    if (msg.client.user.id === msg.author.id) return;
    Stats.update("messages");
    const richMessage = await EnrichMessage(msg);

    if (richMessage.isCommand) {
        if (msg.channel.type !== "text" && richMessage.command.guildOnly) {
            msg.reply("Please use the commands in a guild.");
            return;
        } else if (richMessage.command.args <= richMessage.command.params.length) {
            await richMessage.command.execute(richMessage);
        } else {
            await msg.channel.send(`This command requires atleast ${richMessage.command.args} argument${richMessage.command.args === 1 ? "" : "s"}`);
        }
    }

    richMessage.on("hit", async (info) => {
        Stats.update("hits");
        const guild = info.msg.channel.guild;
        const channel = info.msg.channel;
        const message = info.msg;
        const author = info.msg.author;
        const member = info.member;
        Logger.log(`Shard[${msg.client.shard.id}]:Notified member: "${guild} | ${author.tag} -> ${member.user.tag} | ${info.word}"`);

        let messageContent = `**${author}** mentioned the word **${info.word}** in **${channel}** (${guild.name})`;
        // messageContent += `\n\nWord: ${info.word}\nServer: ${guild.name}\nChannel: ${channel}\nMentioner: ${author}`;
        messageContent += `\n\n\`${info.msg.content}\``;
        messageContent += `\n\n**Go to channel:** ${channel}`;
        messageContent += `\n\n**Jump to message:**\nhttps://discordapp.com/channels/${guild.id}/${channel.id}/${message.id}`;
        messageContent += `\n\n**React with ❌ to remove:** \`${info.word}\``;
        const embed = new RichEmbed({
            title: "A word that you are following was mentioned",
            description: messageContent,
            // fields: [
            //     {
            //         name: "Message:",
            //         value: `\`${info.msg.content}\``,
            //     },
            //     {
            //         name: "Unfollow",
            //         value: `React with ❌ to remove: \`${info.word}\``
            //     },
            //     {
            //         name: "Link:",
            //         value: `https://discordapp.com/channels/${guild.id}/${channel.id}/${message.id}`
            //     },
            // ],
            color: parseInt("FF0000", 16),
            footer: {
                text: `${info.word} ${guild.id}`,
            },
            timestamp: info.msg.original.createdAt,
        });
        try {
            const message = await member.send(embed);
            await message.react("❌");
        } catch (e) {
            const triggers = await cache.getTrigger(guild.id, member.id);
            triggers.forEach(trigger => cache.delTrigger(guild.id, member.id, trigger.keyword));
        }
    });

    richMessage.search();
}
