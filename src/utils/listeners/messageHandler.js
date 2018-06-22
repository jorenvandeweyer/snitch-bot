const EnrichMessage = require("../enrichMessage");
const Logger = require("../logger");
const { RichEmbed } = require("discord.js");
const cache = require("../cache");

module.exports = async (msg) => {
    if (msg.client.user.id === msg.author.id) return;
    if (msg.channel.type !== "text") {
        msg.reply("Please use the commands in a guild.");
        return;
    }

    const richMessage = await EnrichMessage(msg);

    if (richMessage.isCommand) {
        if (richMessage.command.args <= richMessage.command.params.length) {
            await richMessage.command.execute(richMessage);
        } else {
            await msg.channel.send(`This command requires atleast ${richMessage.command.args} argument${richMessage.command.args === 1 ? "" : "s"}`);
        }
    }

    richMessage.on("hit", async (info) => {
        const guild = info.msg.channel.guild;
        const channel = info.msg.channel;
        const author = info.msg.author;
        Logger.log(`Notified member: "${guild} | ${author.tag} | ${info.word}"`);

        let user;

        if (guild.members.has(info.user)) {
            user = guild.members.get(info.user);
        } else {
            user = await guild.fetchMember(info.user);
        }

        let messageContent = `**${author}** mentioned the word **${info.word}** in **${channel}** (${guild.name})`;
        messageContent += `\n\n\`${info.msg.content}\``;
        messageContent += `\n\nGo to channel: ${channel}`;
        // messageContent += `\n\nWord: ${info.word}\nServer: ${guild.name}\nChannel: ${channel}\nMentioner: ${author}`;
        messageContent += `\n\nReact with ❌ to remove this word from your trigger list:`;

        const embed = new RichEmbed({
            title: "A word that you are following was mentioned",
            description: messageContent,
            color: parseInt("FF0000", 16),
            footer: {
                text: `${info.word} ${guild.id}`,
            },
            timestamp: info.msg.original.createdAt,
        });
        try {
            const message = await user.send(embed);
            await message.react("❌");
        } catch (e) {
            const triggers = await cache.getTrigger(guild.id, user.id);
            triggers.forEach(trigger => cache.delTrigger(guild.id, user.id, trigger.keyword));
        }
    });

    richMessage.search();
}
