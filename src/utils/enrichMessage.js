const EventEmitter = require('events');
const Cache = require("./cache");

function newCommand(msg) {
    const params = msg.content.slice(prefix.length).split(" ");
    const command = params.shift().toLowerCase();
    return {
        params,
        command
    };
}

module.exports = async (msg) => {
    // const prefix = await Cache.get.prefix(msg.guild.id);

    // msg.isCommand = msg.content.slice(0, prefix.length).toLowerCase() === prefix.toLowerCase();

    const richMessage = new RichMessage(msg);


    richMessage.isCommand = false;

    if (richMessage.isCommand) {
        richMessage.command = newCommand(msg);

        if (richMessage.channel.type === "text" && richMessage.member == null) {
            richMessage.member = await richMessage.guild.fetchMember(richMessage.author.id);
        }
    }

    return richMessage;
}

class RichMessage extends EventEmitter {
    constructor(msg) {
        super();
        Object.assign(this, msg);
    }

    async search() {
        if (this.channel.type !== "text") return;

        console.log(this.channel.guild.id);
        const guild_id = this.guild.id;
        const words = this.content.split(" ");

        words.forEach((word) => {
            const list = Cache.triggers.get(guild_id);

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
