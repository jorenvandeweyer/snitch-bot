const Discord = require('discord.js');
const MessageHandler = require("./utils/listeners/messageHandler");
const ReactionHandler = require("./utils/listeners/reactionHandler");
const MemberHandler = require("./utils/listeners/memberHandler");
const Logger = require("./utils/logger");
const discordbots = require("./utils/discordbots");
const shardBroadcastHelper = require("./utils/shardBroadcastHelper");
const { ShardMetrics } = require("./metrics/index");

const client = new Discord.Client();
client.metrics = ShardMetrics();

process.on("message", message => shardBroadcastHelper(client, message));

client.on('ready', () => {
    Logger.success(`Shard[${client.shard.id}]:Ready!`)
    discordbots(client);
    client.user.setActivity("your messages | listen!help", {
        type: "WATCHING"
    });
});

client.on("guildCreate", () => {
    discordbots(client);
});

client.on('message', MessageHandler);
client.on("messageReactionAdd", ReactionHandler);
client.on("error", e => Logger.error(`Shard[${client.shard.id}]:Client error: ${e.message}`));
client.on("guildMemberRemove", MemberHandler);

client.login();

client.broadcast = (message) => {
    return new Promise(async (resolve, reject) => {
        const id = createId();

        const handler = (message) => {
            if (message && message.type === "broadcast-result") {
                clearTimeout(timeout);
                process.removeListener("message", handler);
                resolve(message);
            }
        }

        process.on("message", handler);

        await client.shard.send(Object.assign(message, {
            id,
            type: "broadcast-request"
        }));

        const timeout = setTimeout(() => {
            process.removeListener("message", handler);
            resolve({
                success: false,
                reason: "timeout",
            });
        }, 2500);
    });
}

function createId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
