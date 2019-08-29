import { Shard, Message } from "discord.js";

const { ShardingManager } = require("discord.js");
const Logger = require("./utils/logger");
const { Metrics } = require("./metrics/index");

const manager = new ShardingManager("./build/src/shard.js", {
    token: process.env.TOKEN,
});

Metrics(manager);

manager.on("launch", (shard: Shard) => Logger.info(`Shard[X]:[+]Launched Shard[${shard.id}]`));

manager.on("message", (shard: Shard, message: Message) => {
    if (message && ("_eval" in message)) return;
    Logger.log(`Shard[${shard.id}:${message}]`);
});

manager.spawn();

export {}
