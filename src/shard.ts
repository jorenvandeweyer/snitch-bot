const Discord = require("discord.js");
const message = require("./utils/listeners/message");
const messageReactionAdd = require("./utils/listeners/messageReactionAdd");
const guildMemberRemove = require("./utils/listeners/guildMemberRemove");
const guildDelete = require("./utils/listeners/guildDelete");
const extend = require("./utils/extend");
const Logger = require("./utils/logger");
const discordbots = require("./utils/discordbots");
const { ShardMetrics } = require("./metrics/index");
const Cache = require("./utils/cache");

const client = new Discord.Client();
client.metrics = ShardMetrics();

extend(client);
discordbots(client);

client.on("ready", () => {
    Cache.build(client.guilds);
    Logger.success(`Shard[${client.shard.id}]:Ready!`);
    client.user.setActivity("your messages | listen!help", {
        type: "WATCHING"
    });
});

client.on("message", message);
client.on("messageReactionAdd", messageReactionAdd);
client.on("guildMemberRemove", guildMemberRemove);
client.on("guildDelete", guildDelete);

client.on("error", (e: Error) => Logger.error(`Shard[${client.shard.id}]:Client error: ${e.message}`));

client.login();

export {}
