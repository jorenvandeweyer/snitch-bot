const fs = require("fs");
const EventEmitter = require('events');
const Cache = require("./cache");
const { Collection } = require("discord.js");

const commands = new Collection();

addDirToCommands(`${__dirname}/../commands`);

function newCommand(msg) {
    const params = msg.content.slice(msg.prefix.length).split(" ");
    const command_name = getCommandName(params);
    const command = commands.get(command_name);

    if (!command) return false;

    command.params = params;
    return command;
}

class RichMessage extends EventEmitter {
    constructor(msg) {
        super();
        Object.assign(this, msg);
        this.original = msg;
    }

    async search() {
        const hits = [];

        if (this.channel.type !== "text") return;

        const guild_id = this.channel.guild.id;
        const words = this.content.split(" ").map(word => word.toLowerCase());

        const list = Cache.triggers.get(guild_id);

        list && words.forEach((word) => {
            if (list.has(word) && !hits.includes(word)) {
                hits.push(word);

                const users = list.get(word);

                users.forEach(async (user) => {
                    const guild = this.channel.guild;
                    let member;
                    if (guild.members.has(user)) {
                        member = guild.members.get(user);
                    } else {
                        member = await guild.fetchMember(user).catch(() => {
                            Cache.delTriggersOf(guild_id, user);
                            return null;
                        });
                    }

                    if (member && member.permissionsIn(this.channel).has("VIEW_CHANNEL")) {
                        this.emit("hit", {
                            msg: this,
                            word,
                            member,
                        });
                    }
                });
            }
        });

        this.emit("finished");
    }
}

module.exports = async (msg) => {
    msg.prefix = "listen!";
    const richMessage = new RichMessage(msg);

    richMessage.isCommand = richMessage.content.slice(0, richMessage.prefix.length).toLowerCase() === richMessage.prefix.toLowerCase();

    if (richMessage.isCommand) {
        richMessage.command = newCommand(richMessage);
        if (!richMessage.command) {
            richMessage.isCommand = false;
        }
        if (richMessage.member == null && msg.channel.type === "text") {
            richMessage.member = await richMessage.guild.fetchMember(richMessage.author.id);
        }
    }
    return richMessage;
}

function addDirToCommands(path) {
    let files = fs.readdirSync(path);
    for (let file of files) {
        if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
            addDirToCommands(`${path}/${file}`);
        } else {
            let command = require(`${path}/${file}`);
            commands.set(command.name, command);
        }
    }
}

function getCommandName(params) {
    if (params[0]) {
        return params.shift().toLowerCase();
    } else {
        params.shift();
        return params[0] ? "add" : "help";
    }
}
