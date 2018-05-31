const fs = require("fs");
const EventEmitter = require('events');
const Cache = require("./cache");
const { Collection } = require("discord.js");

const commands = new Collection();

addDirToCommands(`${__dirname}/../commands`);

function newCommand(msg) {
    const params = msg.content.slice(msg.prefix.length).split(" ");
    const command_name = params.shift().toLowerCase();
    const command = commands.get(command_name);

    command.params = params;
    command.execute = command.execute.bind(msg);

    return command;
}

class RichMessage extends EventEmitter {
    constructor(msg) {
        super();
        Object.assign(this, msg);
        this.original = msg;
    }

    async search() {
        if (this.channel.type !== "text") return;

        const guild_id = this.channel.guild.id;
        const words = this.content.split(" ");

        const list = Cache.triggers.get(guild_id);

        list && words.forEach((word) => {
            if (list.has(word)) {
                const users = list.get(word);
                users.forEach((user) => {
                    this.emit("hit", {
                        msg: this,
                        word,
                        user,
                    });
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
        if (!richMessage.command.execute) {
            richMessage.isCommand = false;
        }
        if (richMessage.member == null) {
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
