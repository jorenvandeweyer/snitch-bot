import { Trigger } from "typings";
import { GuildMember } from "discord.js";

const { RichEmbed } = require("discord.js");
const commands = require("../commands");
const Cache = require("../cache");
const Logger = require("../logger");

const prefixes = ["listen!", "l!"];

module.exports.isCommand = async function() {
    this.prefix = startsWithPrefix(this.content.toLowerCase());
    if (this.prefix) {
        this.command = {};

        this.command.params = this.content.toLowerCase().slice(this.prefix.length).split(" ");
        this.command.name = this.command.params.shift();// || "help";

        if (commands.has(this.command.name)) {
            this.command = Object.assign(this.command, commands.get(this.command.name));
        } else {
            this.command = false;
        }
    } else {
        this.command = false;
    }

    if (this.command) {
        if (!this.member && this.channel.type === "text") {
            this.member = await this.guild.fetchMember(this.author.id);
        }
    }
};

module.exports.search = function() {
    if (this.channel.type !== "text") return;
    const guild = this.guild;

    const list = Cache.triggers.get(guild.id);

    list && list.forEach((trigger: Trigger, keyword: string) => {
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

            if (!match) return;

            test.users.forEach(async (user) => {
                if (Cache.ignores.has(guild.id) && Cache.ignores.get(guild.id).has(user)) {
                    if (Cache.ignores.get(guild.id).get(user).includes(this.author.id)) return;
                }

                let member;
                if (guild.members.has(user)) {
                    member = guild.members.get(user);
                } else {
                    member = await guild.fetchMember(user).catch(() => {
                        Cache.delTriggersOf(guild.id, user);
                        return null;
                    });
                }

                if (!member || !member.permissionsIn(this.channel).has("VIEW_CHANNEL")) return;

                this.client.metrics.incH(test.isRegex);

                Logger.log(`Shard[${this.client.shard.id}]:Notified member: "${guild} | ${this.author.tag} -> ${member.user.tag} | ${keyword}"`);

                let messageContent = `**${this.author.tag}** mentioned the ${test.isRegex ? "RegExp": "word"} **${keyword}** in **${this.channel}** (${guild.name})`;
                messageContent += `\n\n\`${this.content.replace(/`/g, "").slice(0, 1000)}\``;
                messageContent += `\n\n[Click to jump to message](https://discordapp.com/channels/${guild.id}/${this.channel.id}/${this.id})`;
                messageContent += `\n\n**Go to channel:** ${this.channel}`;
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
                    console.log(e);
                    Cache.delTriggersOf(guild.id, member.id);
                }
            });
        });
    });
};

function startsWithPrefix(content: string) {
    for (let prefix of prefixes) {
        if (content.substring(0, prefix.length) === prefix) {
            return prefix;
        }
    }
    return false;
}
