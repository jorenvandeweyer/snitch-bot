const { ShardingManager } = require("discord.js");
const { token } = require("../config.json");
const Logger = require("./utils/logger");
const { Metrics } = require("./metrics/index");

const manager = new ShardingManager("./src/shard.js", {
    token,
});

Metrics(manager);

manager.on("launch", shard => Logger.info(`Shard[X]:[+]Launched Shard[${shard.id}]`));

manager.on("message", (shard, message) => {
    if (message && ("_eval" in message)) return;
    Logger.log(`Shard[${shard.id}:${message}]`);
});

manager.spawn();
