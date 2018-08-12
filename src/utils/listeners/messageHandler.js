const EnrichMessage = require("../enrichMessage");
const Logger = require("../logger");
const { RichEmbed } = require("discord.js");
const cache = require("../cache");
const db = require("../database");

module.exports = async (msg) => {
    msg.client.metrics.incM();
    if (msg.client.user.id === msg.author.id) return;
    const richMessage = await EnrichMessage(msg);

    if (richMessage.isCommand) {
        if (msg.channel.type !== "text" && richMessage.command.guildOnly) {
            msg.reply("Please use the commands in a guild.");
        } else if (richMessage.command.args <= richMessage.command.params.length) {
            if (richMessage.command.vote) {
                const result = await db.query("select * from discordbots.webhook_dbl where user=? AND bot='452042500828299264' limit 1", [msg.author.id]);
                if (result.length) {
                    await richMessage.command.execute(richMessage);
                } else {
                    await msg.channel.send(`To use this command you need to vote at https://discordbots.org/bot/snitch/vote?c \n This takes 15 seconds and will help to improve and add extra features to the bot! Thanks!`);
                }
            } else {
                await richMessage.command.execute(richMessage);
            }
        } else {
            await msg.channel.send(`This command requires atleast ${richMessage.command.args} argument${richMessage.command.args === 1 ? "" : "s"}`);
        }
    }

    if (msg.channel.type !== "text") return;

    richMessage.on("hit", async (info) => {
        msg.client.metrics.incH();
        const guild = info.msg.channel.guild;
        const channel = info.msg.channel;
        const message = info.msg;
        const author = info.msg.author;
        const member = info.member;
        Logger.log(`Shard[${msg.client.shard.id}]:Notified member: "${guild} | ${author.tag} -> ${member.user.tag} | ${info.keyword}"`);

        let messageContent = `**${author}** mentioned the ${info.regex ? "RegExp": "word"} **${info.keyword}** in **${channel}** (${guild.name})`;
        // messageContent += `\n\nWord: ${info.word}\nServer: ${guild.name}\nChannel: ${channel}\nMentioner: ${author}`;
        messageContent += `\n\n\`${info.msg.content}\``;
        messageContent += `\n\n**Go to channel:** ${channel}`;
        messageContent += `\n\n**Jump to message:**\nhttps://discordapp.com/channels/${guild.id}/${channel.id}/${message.id}`;
        messageContent += `\n\n**React with ❌ to remove:** \`${info.keyword}\``;
        const embed = new RichEmbed({
            title: `A ${info.regex ? "RegExp": "word"} that you are following was mentioned`,
            description: messageContent,
            color: parseInt("FF0000", 16),
            footer: {
                text: `${guild.id} ${info.regex} ${info.keyword} `,
            },
            timestamp: info.msg.original.createdAt,
        });
        try {
            const message = await member.send(embed);
            await message.react("❌");
        } catch (e) {
            const triggers = await cache.getTrigger(guild.id, member.id);
            triggers.forEach(trigger => cache.delTrigger(guild.id, member.id, trigger.keyword, trigger.regex));
        }
    });

    richMessage.search();
}
