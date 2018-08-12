const Discord = require('discord.js');
const MessageHandler = require("./utils/listeners/messageHandler");
const ReactionHandler = require("./utils/listeners/reactionHandler");
const MemberHandler = require("./utils/listeners/memberHandler");
const extendEvents = require("./utils/listeners/events");
const Logger = require("./utils/logger");
const discordbots = require("./utils/discordbots");
const { ShardMetrics } = require("./metrics/index");
const Cache = require("./utils/cache");

const client = new Discord.Client();
client.metrics = ShardMetrics();

extendEvents(client);

client.on('ready', () => {
    Cache.build(client.guilds);
    Logger.success(`Shard[${client.shard.id}]:Ready!`)
    discordbots(client);
    client.user.setActivity("your messages | listen!help", {
        type: "WATCHING"
    });
});

client.on("guildCreate", () => { discordbots(client); });
client.on('message', MessageHandler);
client.on("messageReactionAdd", ReactionHandler);
client.on("guildMemberRemove", MemberHandler);

client.on("error", e => Logger.error(`Shard[${client.shard.id}]:Client error: ${e.message}`));

client.login();
