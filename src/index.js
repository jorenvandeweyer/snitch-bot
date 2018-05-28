const { ShardingManager } = require("discord.js");
const { token } = require("../config.json");
const Logger = require("./utils/logger");

const manager = new ShardingManager("./src/shard.js", {
    token,
});

manager.spawn();
manager.on("launch", shard => Logger.success(`Shard[X]:[+]Launched Shard[${shard.id}]`));

manager.on("message", (shard, message) => {
    Logger.log(`Shard[${shard.id}:${message}]`);
});
