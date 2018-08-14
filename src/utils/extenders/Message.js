const EventEmitter = require('events');
const { RichEmbed } = require("discord.js");
const commands = require("../commands");
const Cache = require("../cache");
const Logger = require("../logger");

const prefixes = ["listen!", "l!"];

module.exports.isCommand = async function() {
    this.eventEmitter = new EventEmitter();
    this.prefix = startsWithPrefix(this.content.toLowerCase());
    if (this.prefix) {
        this.command = {};

        this.command.params = this.content.toLowerCase().slice(this.prefix.length).split(" ");
        this.command.name = this.command.params.shift() || "help";

        if (commands.has(this.command.name)) {
            this.command = Object.assign(this.command, commands.get(this.command.name));
        } else {
            this.command = false;
        }
    }

    if (this.command) {
        if (!this.member && this.channel.type === "text") {
            this.member = await this.guild.fetchMember(this.author.id);
        }
    }
};

module.exports.search = function() {
    const hits = [];
    const guild = this.channel.guild;

    if (this.channel.type !== "text") return;

    const list = Cache.triggers.get(guild.id);

    list && list.forEach((trigger, keyword) => {
        const arr = [];
        if (trigger.word) {
            arr.push({
                regex: trigger.word,
                users: trigger.users,
                isRegex: false,
            });
        }
        if (trigger.regex) {
            arr.push({
                regex: trigger.regex,
                users: trigger.usersR,
                isRegex: true,
            });
        }

        arr.forEach((test) => {
            const match = this.content.toLowerCase().match(test.regex);

            if (match) {
                test.users.forEach(async (user) => {

                    let member;
                    if (guild.members.has(user)) {
                        member = guild.members.get(user);
                    } else {
                        member = await guild.fetchMember(user).catch(() => {
                            Cache.delTriggersOf(guild.id, user);
                            return null
                        });
                    }

                    if (member && member.permissionsIn(this.channel).has("VIEW_CHANNEL")) {
                        this.client.metrics.incH(test.isRegex);

                        Logger.log(`Shard[${this.client.shard.id}]:Notified member: "${guild} | ${this.author.tag} -> ${member.user.tag} | ${keyword}"`);

                        let messageContent = `**${this.author.tag}** mentioned the ${test.isRegex ? "RegExp": "word"} **${keyword}** in **${this.channel}** (${guild.name})`;
                        messageContent += `\n\n\`${this.content}\``;
                        messageContent += `\n\n**Go to channel:** ${this.channel}`;
                        messageContent += `\n\n**Jump to message:**\nhttps://discordapp.com/channels/${guild.id}/${this.channel.id}/${this.id}`;
                        messageContent += `\n\n**React with ❌ to remove:** \`${keyword}\``;

                        const embed = new RichEmbed({
                            title: `A ${test.isRegex ? "RegExp": "word"} that you are following was mentioned`,
                            description: messageContent,
                            color: parseInt("FF0000", 16),
                            footer: {
                                text: `${guild.id} ${+test.isRegex} ${keyword} `,
                            },
                            timestamp: this.createdAt,
                        });

                        try {
                            const message = await member.send(embed);
                            await message.react("❌");
                        } catch (e) {
                            cache.delTriggersOf(guild.id, member.id);
                        }
                    }
                });
            }
        });

        this.eventEmitter.emit("finished");
    });
}

function startsWithPrefix(content) {
    for (let prefix of prefixes) {
        if (content.substring(0, prefix.length) === prefix) {
            return prefix;
        }
    }
    return false;
}
